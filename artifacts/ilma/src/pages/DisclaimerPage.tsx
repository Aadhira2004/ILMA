import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail } from 'lucide-react';

const LAST_UPDATED = 'August 5, 2026';

const sections = [
  {
    title: '1. Educational & Career Guidance Only',
    content: [
      'ILMA – Biomedical Future is an educational platform. All content on this website—including domain overviews, career guides, learning roadmaps, exam information, and articles—is provided for general informational, educational, and career-guidance purposes only.',
      'ILMA **does not provide medical advice, diagnosis, or treatment** of any kind. Nothing on this website should be interpreted as clinical, medical, or health advice. If you have a health concern, always consult a qualified healthcare professional.',
    ],
  },
  {
    title: '2. Not Professional or Institutional Advice',
    content: [
      'The information we share is intended to help students and learners explore biomedical engineering and related fields. It should not be treated as a substitute for:',
      '• Formal academic counselling from your college or university.',
      '• Professional career, legal, financial, or immigration advice.',
      '• Official guidance from examination bodies, licensing authorities, or employers.',
      'You should independently verify any decision that affects your education, career, or finances with the appropriate qualified professional or official source.',
    ],
  },
  {
    title: '3. Content Accuracy',
    content: [
      'We work to keep our information accurate and up to date, and we review key data such as salary ranges, exam syllabi, and industry trends periodically.',
      'However, ILMA makes no warranties or guarantees about the completeness, reliability, or accuracy of any content. Education systems, exam patterns, career pathways, and salary figures vary by country and change over time.',
      'Any reliance you place on the information found on this website is strictly at your own risk. If you believe any information is inaccurate or outdated, please let us know at ilmabiomedical@gmail.com.',
    ],
  },
  {
    title: '4. Global Audience',
    content: [
      'ILMA serves biomedical students and professionals worldwide. Requirements for degrees, certifications, licensing, exams, and employment differ significantly between countries and regions.',
      'Because of this, general information on this website may not apply to your specific location or circumstances. Always confirm the requirements that apply in your own country or region with official local sources.',
    ],
  },
  {
    title: '5. External Links',
    content: [
      'Our content may include links to third-party websites, organizations, books, tools, and resources that we consider relevant and helpful.',
      'These links are provided for convenience and reference only. ILMA does not control, endorse, or take responsibility for the content, accuracy, availability, or practices of any external website.',
      'Accessing third-party websites is done at your own risk, and their terms and privacy policies will apply to your use of them.',
    ],
  },
  {
    title: '6. No Guarantee of Outcomes',
    content: [
      'ILMA provides resources to support your learning and career exploration, but we cannot and do not guarantee any specific outcome.',
      'We make no promises regarding admission to any programme, success in any examination, employment, salary, or career progression. Individual results depend on many factors outside our control.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'To the fullest extent permitted by law, ILMA – Biomedical Future and its contributors shall not be liable for any loss or damage—direct, indirect, or consequential—arising from your use of, or reliance on, the information provided on this website.',
    ],
  },
  {
    title: '8. Changes to This Disclaimer',
    content: [
      'We may update this Disclaimer from time to time. Any changes will be reflected on this page with an updated "Last Updated" date. We encourage you to review this page periodically.',
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

export default function DisclaimerPage() {
  useDocumentMeta(
    'Disclaimer',
    'ILMA – Biomedical Future provides educational and career guidance only, not medical diagnosis or treatment.'
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
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Disclaimer</h1>
              <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              ILMA – Biomedical Future is an educational and career-guidance platform. This page
              explains the scope of our content and its limitations, including that we do not provide
              medical diagnosis or treatment.
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
              <h3 className="font-bold text-foreground mb-1">Questions About This Disclaimer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you have any questions or wish to report inaccurate information, please contact us at{' '}
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
