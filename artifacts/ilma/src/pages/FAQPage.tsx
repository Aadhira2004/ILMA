import React, { useState } from 'react';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    label: 'About ILMA',
    faqs: [
      {
        q: 'What is ILMA?',
        a: 'ILMA – Biomedical Future is a free educational platform designed exclusively for Biomedical Engineering students. ILMA stands for Innovation, Learning, Medical Technology, and Advancement. It provides structured career guides, biomedical domain overviews, skill roadmaps, government exam preparation resources, and learning materials to help students navigate their academic and professional journey.',
      },
      {
        q: 'Who created ILMA?',
        a: 'ILMA was founded by Aadhira Suleim A. R., a Biomedical Engineer and researcher who identified the lack of structured, accessible resources for BME students and built this platform to bridge that gap.',
      },
      {
        q: 'Is ILMA affiliated with any university or organisation?',
        a: 'No. ILMA is an independent educational platform. It is not affiliated with, endorsed by, or officially associated with any university, government body, or organisation. All content is independently researched and curated.',
      },
    ],
  },
  {
    label: 'Using ILMA',
    faqs: [
      {
        q: 'Is ILMA free to use?',
        a: 'Yes, completely. All content on ILMA — including career guides, domain overviews, skill roadmaps, exam resources, and learning materials — is available free of charge. There are no subscriptions, paywalls, or hidden fees.',
      },
      {
        q: 'Who can use ILMA?',
        a: 'ILMA is primarily built for Biomedical Engineering students at the undergraduate and postgraduate level. However, it is also useful for BME graduates, job seekers, researchers, academics, and anyone interested in the biomedical engineering field.',
      },
      {
        q: 'Do I need to create an account to use ILMA?',
        a: 'No account is required. All resources on ILMA are freely accessible without registration or login.',
      },
      {
        q: 'Is ILMA available on mobile?',
        a: 'Yes. ILMA is fully responsive and works on all screen sizes including smartphones and tablets. Browse it from any modern browser on any device.',
      },
    ],
  },
  {
    label: 'Content & Resources',
    faqs: [
      {
        q: 'Are the study resources on ILMA verified?',
        a: 'Yes. All resources, career data, domain information, and exam content are researched and curated by our founder, who holds a degree in Biomedical Engineering and has published in peer-reviewed journals. We cross-reference information against official sources, government notifications, and industry reports. However, we recommend always verifying critical information — such as exam syllabi, cutoffs, and eligibility — from the official authoritative source, as these may change.',
      },
      {
        q: 'How often is the content updated?',
        a: 'We review and update our career data, salary figures, exam syllabi, and domain content on a regular basis. Major updates are made quarterly. If you notice outdated or incorrect information, please let us know via the Contact page.',
      },
      {
        q: 'What topics does ILMA cover?',
        a: 'ILMA currently covers: Career paths in Biomedical Engineering (roles, salaries, skills), Biomedical domains (medical imaging, clinical engineering, biomedical instrumentation, etc.), Skill roadmaps for each specialisation, Government and competitive exams (GATE, ESE, UPSC, and more), and general learning resources for BME students.',
      },
    ],
  },
  {
    label: 'Newsletter & Contact',
    faqs: [
      {
        q: 'How do I subscribe to the newsletter?',
        a: 'You can subscribe using the newsletter signup form in the footer of any page. Simply enter your email address and click "Subscribe". You will receive updates about new content, career opportunities, and biomedical engineering insights.',
      },
      {
        q: 'How can I contact ILMA?',
        a: 'You can reach us through the Contact page on this website, or by emailing us directly at ilmabiomedical@gmail.com. We aim to respond within 2–3 business days.',
      },
      {
        q: 'How do I unsubscribe from the newsletter?',
        a: 'To unsubscribe, send an email to ilmabiomedical@gmail.com with the subject line "Unsubscribe" from the email address you subscribed with. We will remove you promptly.',
      },
    ],
  },
  {
    label: 'Contributions',
    faqs: [
      {
        q: 'Can I contribute to ILMA?',
        a: 'Yes! We welcome contributions from Biomedical Engineering professionals, researchers, academics, and students. If you would like to contribute an article, domain overview, career guide, or learning resource, please contact us at ilmabiomedical@gmail.com with a brief outline of what you would like to contribute. All submissions are reviewed before publication.',
      },
      {
        q: 'Can I suggest a topic or report an error?',
        a: 'Absolutely. We value feedback from our community. If you find incorrect information, want to suggest a new topic, or have ideas for improving ILMA, please use the Contact page or email ilmabiomedical@gmail.com.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-accent transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm md:text-base leading-snug">{q}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-5 py-4 bg-background border-t border-border">
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{a}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function FAQPage() {
  useDocumentMeta('FAQ', 'Frequently asked questions about ILMA – Biomedical Future.');
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
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground text-sm">
                Can't find your answer?{' '}
                <Link href="/contact" className="text-primary font-medium hover:underline underline-offset-2">
                  Contact us
                </Link>
              </p>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Everything you need to know about ILMA – Biomedical Future, our resources, and how to get the most out of the platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-14">
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.07 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-3">
                <span className="inline-block w-1.5 h-5 rounded-full bg-gradient-to-b from-primary to-secondary" />
                {cat.label}
              </h2>
              <div className="space-y-3">
                {cat.faqs.map((item, fi) => (
                  <FAQItem key={fi} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="container px-4 md:px-6 max-w-4xl mx-auto mt-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">Still have a question?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We're happy to help. Reach us at{' '}
                <a href="mailto:ilmabiomedical@gmail.com" className="text-primary font-medium hover:underline underline-offset-2">
                  ilmabiomedical@gmail.com
                </a>{' '}
                or use the{' '}
                <Link href="/contact" className="text-primary font-medium hover:underline underline-offset-2">
                  Contact page
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
