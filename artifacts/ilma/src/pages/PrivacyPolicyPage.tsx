import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';

const LAST_UPDATED = 'August 5, 2026';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'ILMA – Biomedical Future collects only the information you voluntarily provide:',
      '• **Contact Form:** Your name, email address, subject line, and message when you submit the contact form.',
      '• **Newsletter Subscription:** Your email address when you subscribe to our newsletter.',
      'We do not collect any automatically generated personal data such as IP addresses, browser fingerprints, or device identifiers through our own systems.',
    ],
  },
  {
    title: '2. How We Use Your Data',
    content: [
      'The information you provide is used solely for the following purposes:',
      '• **Contact Form submissions** are used to respond to your enquiry or feedback.',
      '• **Newsletter subscriptions** are used to send you updates about new content, career guides, and biomedical engineering resources.',
      'We will never sell, rent, or share your personal information with third parties for commercial purposes.',
    ],
  },
  {
    title: '3. Cookies',
    content: [
      'ILMA – Biomedical Future does not use tracking cookies or analytics cookies.',
      'Your browser may store a session preference (such as dark or light mode) in local storage. This data is stored entirely on your device and is never transmitted to our servers.',
    ],
  },
  {
    title: '4. Email Subscriptions',
    content: [
      'When you subscribe to the ILMA newsletter, your email address is collected via our contact form and used exclusively to send you relevant updates.',
      'You may unsubscribe at any time by contacting us directly at ilmabiomedical@gmail.com with the subject line "Unsubscribe".',
      'We do not use automated mailing platforms that profile or segment subscribers.',
    ],
  },
  {
    title: '5. Third-Party Services',
    content: [
      'ILMA uses the following third-party service to process form submissions:',
      '• **EmailJS (emailjs.com):** Our contact and newsletter forms use EmailJS to deliver your submitted messages to our email inbox. EmailJS processes the data fields you submit (name, email, subject, message) solely for the purpose of delivery. Please refer to the EmailJS Privacy Policy at https://www.emailjs.com/legal/privacy-policy/ for details on how they handle data.',
      'We do not use Google Analytics, Facebook Pixel, or any advertising-related third-party scripts.',
    ],
  },
  {
    title: '6. Data Protection',
    content: [
      'We take reasonable precautions to protect the information you submit:',
      '• All data transmitted through our forms is encrypted in transit via HTTPS.',
      '• We do not store form submission data on our own servers; messages are delivered directly to our email inbox via EmailJS.',
      '• We retain contact and subscription data only as long as necessary to fulfil the purpose for which it was collected.',
      'As ILMA is an educational platform with no user accounts or databases, the data we handle is minimal.',
    ],
  },
  {
    title: '7. Your Rights',
    content: [
      'You have the right to:',
      '• Request access to any personal data we hold about you.',
      '• Request correction or deletion of your personal data.',
      '• Withdraw consent for us to contact you at any time.',
      'To exercise any of these rights, please contact us at ilmabiomedical@gmail.com.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last Updated" date. We encourage you to review this page periodically.',
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

export default function PrivacyPolicyPage() {
  useDocumentMeta('Privacy Policy', 'How ILMA – Biomedical Future collects, uses, and protects your data.');
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
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Privacy Policy</h1>
              <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              ILMA – Biomedical Future is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights.
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
              <h3 className="font-bold text-foreground mb-1">Privacy Enquiries</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For any privacy-related questions or requests, please contact us at{' '}
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
