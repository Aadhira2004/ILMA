import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';

const LAST_UPDATED = 'August 5, 2026';

const sections = [
  {
    title: '1. Educational Purpose',
    content: [
      'ILMA – Biomedical Future ("ILMA", "we", "us") is an independent educational platform created to provide free career guidance, domain knowledge, skill roadmaps, and government exam resources for Biomedical Engineering students.',
      'All content published on ILMA is intended strictly for educational and informational purposes. It does not constitute professional career advice, medical advice, legal advice, or financial advice.',
      'While we strive to keep information accurate and up to date, ILMA makes no warranties regarding the completeness, accuracy, or reliability of any content on this website.',
    ],
  },
  {
    title: '2. Intellectual Property',
    content: [
      'All original content on this website — including but not limited to text, data compilations, graphics, layout, and educational materials — is the intellectual property of ILMA – Biomedical Future and its founder, Aadhira Suleim A. R.',
      'You may view and use content on ILMA for personal, non-commercial, educational purposes only.',
      '• You may not reproduce, republish, distribute, or commercially exploit any content from this website without prior written permission.',
      '• You may not use ILMA content to build competing products or services.',
      'Third-party content referenced on ILMA (such as external links, cited sources, or logos) remains the property of their respective owners.',
    ],
  },
  {
    title: '3. User Responsibilities',
    content: [
      'By using ILMA, you agree to:',
      '• Use the website solely for lawful, personal, and educational purposes.',
      '• Not attempt to gain unauthorised access to any part of the website or its infrastructure.',
      '• Not submit false, misleading, or harmful content through any forms on the website.',
      '• Not use automated tools to scrape, crawl, or extract content from ILMA in bulk.',
      '• Respect the intellectual property rights associated with all content on the platform.',
    ],
  },
  {
    title: '4. Limitation of Liability',
    content: [
      'To the fullest extent permitted by applicable law, ILMA – Biomedical Future and its founder shall not be liable for:',
      '• Any direct, indirect, incidental, or consequential damages arising from your use of this website.',
      '• Career, academic, or professional decisions made based on information found on ILMA.',
      '• Inaccuracies in salary data, exam syllabi, or industry information, which may change over time.',
      '• Any interruption, suspension, or discontinuation of the website or its services.',
      'You use this website at your own risk. Always verify important information from official and authoritative sources.',
    ],
  },
  {
    title: '5. External Links',
    content: [
      'ILMA may contain links to external websites for reference purposes. These links are provided as a convenience and do not imply endorsement of the linked site or its content.',
      'We have no control over the content, privacy practices, or availability of external websites. Accessing external links is entirely at your own risk.',
    ],
  },
  {
    title: '6. Changes to the Website',
    content: [
      'We reserve the right to:',
      '• Modify, update, or remove any content on the website at any time without prior notice.',
      '• Change the structure, features, or availability of the platform.',
      '• Update these Terms of Service. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
      'The "Last Updated" date at the top of this page reflects the most recent revision.',
    ],
  },
  {
    title: '7. Governing Law',
    content: [
      'These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of India.',
    ],
  },
  {
    title: '8. Contact Information',
    content: [
      'If you have any questions or concerns regarding these Terms of Service, please contact us at ilmabiomedical@gmail.com.',
    ],
  },
];

function renderLine(line: string, i: number) {
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

export default function TermsOfServicePage() {
  useDocumentMeta('Terms of Service', 'Terms and conditions for using ILMA – Biomedical Future.');
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
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Terms of Service</h1>
              <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Please read these terms carefully before using ILMA – Biomedical Future. By accessing this website, you agree to be bound by the following terms and conditions.
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
              <h3 className="font-bold text-foreground mb-1">Legal Enquiries</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For questions about these terms, contact us at{' '}
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
