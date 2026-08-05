import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import CareerExplorerPage from '@/pages/CareerExplorerPage';
import CareerDetailPage from '@/pages/CareerDetailPage';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/careers" component={CareerExplorerPage} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
