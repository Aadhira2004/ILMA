import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ClerkProvider, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import CareerExplorerPage from '@/pages/CareerExplorerPage';
import CareerDetailPage from '@/pages/CareerDetailPage';
import CareerMatchPage from '@/pages/CareerMatchPage';
import DomainsPage from '@/pages/DomainsPage';
import DomainDetailPage from '@/pages/DomainDetailPage';
import RoadmapsPage from '@/pages/RoadmapsPage';
import RoadmapDetailPage from '@/pages/RoadmapDetailPage';
import GovernmentExamsPage from '@/pages/GovernmentExamsPage';
import ExamDetailPage from '@/pages/ExamDetailPage';
import ContactPage from '@/pages/ContactPage';
import FounderPage from '@/pages/FounderPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import FAQPage from '@/pages/FAQPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import ResourceLibraryPage from '@/pages/ResourceLibraryPage';
import BlogPage from '@/pages/BlogPage';
import BlogDetailPage from '@/pages/BlogDetailPage';
import NewsPage from '@/pages/NewsPage';
import CompaniesPage from '@/pages/CompaniesPage';
import ResearchHubPage from '@/pages/ResearchHubPage';
import AdminPage from '@/pages/AdminPage';

// REQUIRED — copy verbatim. Resolves the key from window.location.hostname so the
// same build serves multiple Clerk custom domains.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev, auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// Clerk passes full paths to routerPush/routerReplace, but wouter's
// setLocation prepends the base — strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: 'hsl(211 79% 28%)',
    colorForeground: 'hsl(220 30% 10%)',
    colorMutedForeground: 'hsl(220 15% 40%)',
    colorDanger: 'hsl(0 72% 45%)',
    colorBackground: 'hsl(0 0% 100%)',
    colorInput: 'hsl(0 0% 100%)',
    colorInputForeground: 'hsl(220 30% 10%)',
    colorNeutral: 'hsl(220 15% 45%)',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '0.5rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl border border-[hsl(220_15%_90%)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[hsl(220_30%_10%)] font-bold',
    headerSubtitle: 'text-[hsl(220_15%_40%)]',
    socialButtonsBlockButtonText: 'text-[hsl(220_30%_10%)] font-medium',
    formFieldLabel: 'text-[hsl(220_30%_10%)] font-medium',
    footerActionLink: 'text-[hsl(211_79%_28%)] font-semibold hover:text-[hsl(211_79%_38%)]',
    footerActionText: 'text-[hsl(220_15%_40%)]',
    dividerText: 'text-[hsl(220_15%_40%)]',
    identityPreviewEditButton: 'text-[hsl(211_79%_28%)]',
    formFieldSuccessText: 'text-[hsl(174_75%_35%)]',
    alertText: 'text-[hsl(220_30%_10%)]',
    logoBox: 'h-10 justify-center',
    logoImage: 'h-10 w-auto',
    socialButtonsBlockButton: 'border border-[hsl(220_15%_88%)] hover:bg-[hsl(211_79%_97%)]',
    formButtonPrimary: 'bg-[hsl(211_79%_28%)] hover:bg-[hsl(211_79%_24%)] text-white font-semibold',
    formFieldInput: 'border border-[hsl(220_15%_85%)] focus:border-[hsl(211_79%_40%)]',
    footerAction: 'justify-center',
    dividerLine: 'bg-[hsl(220_15%_90%)]',
    alert: 'border border-[hsl(220_15%_90%)]',
    otpCodeFieldInput: 'border border-[hsl(220_15%_85%)]',
    formFieldRow: 'gap-2',
    main: 'gap-5',
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

// Helps user's webview stay up-to-date when the signed-in user changes by invalidating the QueryClient cache.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/careers" component={CareerExplorerPage} />
      <Route path="/career-match" component={CareerMatchPage} />
      <Route path="/careers/:id" component={CareerDetailPage} />
      <Route path="/domains" component={DomainsPage} />
      <Route path="/domains/:id" component={DomainDetailPage} />
      <Route path="/roadmaps" component={RoadmapsPage} />
      <Route path="/roadmaps/:id" component={RoadmapDetailPage} />
      <Route path="/exams" component={GovernmentExamsPage} />
      <Route path="/exams/:id" component={ExamDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/founder" component={FounderPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/resources" component={ResourceLibraryPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/companies" component={CompaniesPage} />
      <Route path="/research" component={ResearchHubPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back to ILMA',
            subtitle: 'Sign in to continue your biomedical journey',
          },
        },
        signUp: {
          start: {
            title: 'Join ILMA',
            subtitle: 'Create your account to track your biomedical career path',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </ThemeProvider>
  );
}

export default App;
