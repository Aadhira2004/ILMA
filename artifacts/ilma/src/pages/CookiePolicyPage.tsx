import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Cookie, Mail } from 'lucide-react';

const LAST_UPDATED = 'August 5, 2026';

const sections = [
  {
    title: '1. What Are Cookies?',
    content: [
      'Cookies are small text files that a website may store on your device to help it function, remember your preferences, or keep you signed in. Alongside cookies, websites can also use browser storage mechanisms such as **local storage** and **session storage** to keep information on your device.',
      'This policy explains how ILMA – Biomedical Future uses cookies and similar technologies, and what choices you have.',
    ],
  },
  {
    title: '2. How We Use Cookies & Storage',
    content: [
      'ILMA uses only the cookies and browser storage that are necessary for the site to work properly and to remember your preferences. Specifically:',
      '• **Authentication & session cookies** are used to keep you securely signed in when you access account features. These are set by our authentication provider, Clerk.',
      '• **Theme preference** (light or dark mode) is stored in your browser’s local storage so the site remembers your choice on future visits.',
      '• **Session preferences**, such as whether the intro screen has already been shown, are stored in your browser’s session storage and are cleared when you close the tab.',
      'We do **not** use advertising cookies, cross-site tracking cookies, or third-party marketing pixels.',
    ],
  },
  {
    title: '3. Strictly Necessary Cookies',
    content: [
      'Some cookies are essential for core functionality and cannot be switched off through our systems.',
      '• **Clerk authentication cookies:** When you sign in, our authentication provider Clerk sets secure cookies to manage your session and protect your account. Without these, sign-in and account features would not work. Please see Clerk’s Privacy Policy at https://clerk.com/legal/privacy for details.',
    ],
  },
  {
    title: '4. Preference Storage (Local & Session Storage)',
    content: [
      'To improve your experience, we store a small amount of preference data directly on your device using local and session storage. This data is not transmitted to our servers:',
      '• **Theme setting:** remembers whether you prefer light or dark mode.',
      '• **Intro/splash state:** remembers, for the current browsing session, that the loading screen has already been displayed so it is not shown again.',
      'You can clear this data at any time by clearing your browser’s site data.',
    ],
  },
  {
    title: '5. Third-Party Services',
    content: [
      'ILMA relies on a small number of trusted third-party services that may set their own cookies or storage:',
      '• **Clerk (clerk.com):** provides secure authentication and sets session cookies when you sign in.',
      '• **EmailJS (emailjs.com):** processes contact and enquiry form submissions. It does not set tracking cookies on our site.',
      'We do not use Google Analytics, Facebook Pixel, or any advertising or behavioural-tracking scripts.',
    ],
  },
  {
    title: '6. Managing Cookies',
    content: [
      'You can control and delete cookies and browser storage through your browser settings. Most browsers let you block or remove cookies and clear site data.',
      'Please note that if you block strictly necessary cookies—such as authentication cookies—some features, including signing in, may not work correctly.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    content: [
      'We may update this Cookie Policy from time to time to reflect changes in the technologies we use. Any changes will be reflected on this page with an updated "Last Updated" date. We encourage you to review this page periodically.',
    ],
  },
];

function renderLine(line: string, i: number) {
  // Bold **text**
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={i} className={`text-muted-foreground leading-relaxed ${line.startsWith('•') ? 'pl-4' : ''}`}>
      {parts.map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>
          : part
      )}
    </p>
  );
}

export default function CookiePolicyPage() {
  useDocumentMeta(
    'Cookie Policy',
    'How ILMA – Biomedical Future uses cookies and browser storage, including authentication and theme preferences.'
  );
  useScrollTop();

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 bg-card border-b border-border">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-5"
          >
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Cookie className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Cookie Policy</h1>
              <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              This policy explains how ILMA – Biomedical Future uses cookies and similar browser
              storage. We keep our use minimal: essential authentication and your on-device
              preferences only—no advertising or tracking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border"
              >
                <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                <div className="space-y-2">
                  {section.content.map((line, j) => renderLine(line, j))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Cookie Enquiries</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For any questions about how we use cookies or browser storage, please contact us at{' '}
                <a href="mailto:ilmabiomedical@gmail.com" className="text-primary font-medium hover:underline underline-offset-2">
                  ilmabiomedical@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
