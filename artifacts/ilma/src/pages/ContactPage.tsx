import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Loader2, AlertCircle, CheckCircle2, Instagram, Linkedin, Youtube } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ─── EmailJS config ────────────────────────────────────────────────────────────
const EJS_PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
const EJS_SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EJS_TEMPLATE_CONTACT = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID as string;

// Initialise once at module load so every send() call inherits the public key
if (EJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EJS_PUBLIC_KEY });
} else if (import.meta.env.DEV) {
  console.warn('[EmailJS] VITE_EMAILJS_PUBLIC_KEY is not set – emails will fail.');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Is ILMA free for students?',
    a: 'Yes, all our core resources—career guides, domain overviews, and learning roadmaps—are completely free for students.',
  },
  {
    q: 'Can I contribute an article or roadmap?',
    a: 'Absolutely! We welcome contributions from industry professionals and experienced academics. Send us a message using the form.',
  },
  {
    q: 'Do you offer direct placement services?',
    a: 'Currently, we provide guidance and resources. We plan to launch a dedicated job board in our V4 release.',
  },
  {
    q: 'How often is the data updated?',
    a: 'We review and update our salary data, exam syllabi, and industry trends quarterly to ensure accuracy.',
  },
  {
    q: 'How can I report incorrect information?',
    a: 'Please use the contact form above or email us directly at ilmabiomedical@gmail.com and we will review it promptly.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  useDocumentMeta('Contact', 'Get in touch with ILMA.');
  useScrollTop();

  const [form, setForm]       = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]   = useState<Partial<FormState>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormState]) setErrors((prev) => ({ ...prev, [id]: '' }));
    if (sendError) setSendError('');
    if (success)   setSuccess(false);
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim())             next.name    = 'Name is required.';
    if (!form.email.trim())            next.email   = 'Email is required.';
    else if (!isValidEmail(form.email)) next.email  = 'Please enter a valid email address.';
    if (!form.subject.trim())          next.subject = 'Subject is required.';
    if (!form.message.trim())          next.message = 'Message is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError('');
    setSuccess(false);

    try {
      await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_CONTACT,
        {
          from_name:  form.name.trim(),
          from_email: form.email.trim(),
          reply_to:   form.email.trim(),
          subject:    form.subject.trim(),
          message:    form.message.trim(),
          to_email:   'ilmabiomedical@gmail.com',
        },
      );
      setSuccess(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      console.error('[EmailJS] Contact send failed:', error);
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'text' in error
          ? String((error as { text: unknown }).text)
          : 'Failed to send message. Please try again.';
      setSendError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <Layout>
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, suggestion, or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">

            {/* ── Contact Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 rounded-3xl border border-border shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

              {/* Success banner */}
              {success && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              {/* Error banner */}
              {sendError && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{sendError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`bg-background ${errors.name ? 'border-destructive' : ''}`}
                      disabled={sending}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`bg-background ${errors.email ? 'border-destructive' : ''}`}
                      disabled={sending}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={`bg-background ${errors.subject ? 'border-destructive' : ''}`}
                    disabled={sending}
                  />
                  {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className={`min-h-[150px] bg-background ${errors.message ? 'border-destructive' : ''}`}
                    disabled={sending}
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* ── Contact Info & FAQ ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Connect with us</h2>
                <div className="grid gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent border border-primary/10">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Email Us</p>
                      <a
                        href="mailto:ilmabiomedical@gmail.com"
                        className="text-lg font-semibold hover:text-primary transition-colors break-all"
                      >
                        ilmabiomedical@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent border border-primary/10">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Follow Us</p>
                      <a
                        href="https://www.instagram.com/ilma.biomedical?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-primary transition-colors break-all"
                      >
                        @ilma.biomedical
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent border border-primary/10">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
                      <Linkedin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">LinkedIn</p>
                      <a
                        href="https://www.linkedin.com/company/ilma-biomedical/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-primary transition-colors break-all"
                      >
                        ILMA Biomedical
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent border border-primary/10">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0">
                      <Youtube className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">YouTube</p>
                      <a
                        href="https://www.youtube.com/@ILMA-2026"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-primary transition-colors break-all"
                      >
                        @ILMA-2026
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
