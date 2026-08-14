import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Handshake,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  FlaskConical,
  Building2,
  Presentation,
  Compass,
  Lightbulb,
  Users,
  Briefcase,
} from 'lucide-react';

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

// ─── Partnership types ──────────────────────────────────────────────────────────
const partnershipTypes = [
  {
    icon: GraduationCap,
    title: 'College & University Partnerships',
    description:
      'Integrate ILMA’s biomedical career resources into your academic programmes, orientation, and student support services.',
  },
  {
    icon: FlaskConical,
    title: 'Research Collaborations',
    description:
      'Collaborate on research-driven content, case studies, and knowledge-sharing initiatives across biomedical disciplines.',
  },
  {
    icon: Building2,
    title: 'Industry Partnerships',
    description:
      'Partner with us to showcase real-world roles, tools, and skills that connect students to the biomedical industry.',
  },
  {
    icon: Presentation,
    title: 'Workshops',
    description:
      'Co-host workshops and skill sessions on biomedical engineering, healthcare technology, and applied research.',
  },
  {
    icon: Compass,
    title: 'Career Guidance Sessions',
    description:
      'Deliver guidance sessions that help students navigate biomedical career paths, exams, and higher-study options.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Challenges',
    description:
      'Design and run innovation challenges and hackathons that encourage students to solve real biomedical problems.',
  },
  {
    icon: Users,
    title: 'Mentorship',
    description:
      'Connect experienced professionals and academics with students seeking mentorship in biomedical fields.',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    description:
      'Offer internship opportunities that give students hands-on experience in biomedical research and technology.',
  },
];

const PARTNERSHIP_OPTIONS = partnershipTypes.map((p) => p.title);

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  organization: string;
  contact: string;
  email: string;
  partnershipType: string;
  message: string;
}
const EMPTY_FORM: FormState = {
  organization: '',
  contact: '',
  email: '',
  partnershipType: '',
  message: '',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function PartnershipsPage() {
  useDocumentMeta(
    'Partner with ILMA',
    'Collaborate with ILMA – Biomedical Future through university partnerships, research, industry programmes, workshops, mentorship, and internships.'
  );
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

  function handleTypeChange(value: string) {
    setForm((prev) => ({ ...prev, partnershipType: value }));
    if (errors.partnershipType) setErrors((prev) => ({ ...prev, partnershipType: '' }));
    if (sendError) setSendError('');
    if (success)   setSuccess(false);
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.organization.trim())        next.organization    = 'Organization name is required.';
    if (!form.contact.trim())             next.contact         = 'Contact person is required.';
    if (!form.email.trim())               next.email           = 'Email is required.';
    else if (!isValidEmail(form.email))   next.email           = 'Please enter a valid email address.';
    if (!form.partnershipType.trim())     next.partnershipType = 'Please select a partnership type.';
    if (!form.message.trim())             next.message         = 'Message is required.';
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
          from_name:  form.contact.trim(),
          from_email: form.email.trim(),
          reply_to:   form.email.trim(),
          subject:    `Partnership Enquiry – ${form.partnershipType} (${form.organization.trim()})`,
          message:
            `Organization: ${form.organization.trim()}\n` +
            `Contact Person: ${form.contact.trim()}\n` +
            `Email: ${form.email.trim()}\n` +
            `Partnership Type: ${form.partnershipType}\n\n` +
            `${form.message.trim()}`,
          to_email:   'ilmabiomedical@gmail.com',
        },
      );
      setSuccess(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      console.error('[EmailJS] Partnership send failed:', error);
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
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="p-3 bg-primary/10 text-primary rounded-xl mb-6">
              <Handshake className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Partner with ILMA</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ILMA – Biomedical Future works with universities, research groups, industry, and mentors
              worldwide to help biomedical students explore careers, build skills, and access
              opportunities. Explore the ways we can collaborate and reach out to start the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ways to Collaborate</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you are an institution, a company, a researcher, or an individual professional,
              there is a way to work together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {partnershipTypes.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
                  className="p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{type.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{type.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Partnership Enquiry</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tell us about your organization and how you would like to collaborate. You can also{' '}
                <Link href="/contact" className="text-primary font-medium hover:underline underline-offset-2">
                  contact us directly
                </Link>
                .
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background p-8 rounded-3xl border border-border shadow-sm"
            >
              {/* Success banner */}
              {success && (
                <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Thank you! Your partnership enquiry has been sent successfully. We'll get back to you soon.
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
                  {/* Organization */}
                  <div className="space-y-1.5">
                    <label htmlFor="organization" className="text-sm font-medium">Organization Name</label>
                    <Input
                      id="organization"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="University / Company / Institution"
                      className={`bg-background ${errors.organization ? 'border-destructive' : ''}`}
                      disabled={sending}
                    />
                    {errors.organization && <p className="text-xs text-destructive">{errors.organization}</p>}
                  </div>

                  {/* Contact person */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact" className="text-sm font-medium">Contact Person</label>
                    <Input
                      id="contact"
                      value={form.contact}
                      onChange={handleChange}
                      placeholder="Full name"
                      className={`bg-background ${errors.contact ? 'border-destructive' : ''}`}
                      disabled={sending}
                    />
                    {errors.contact && <p className="text-xs text-destructive">{errors.contact}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@organization.com"
                      className={`bg-background ${errors.email ? 'border-destructive' : ''}`}
                      disabled={sending}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  {/* Partnership type */}
                  <div className="space-y-1.5">
                    <label htmlFor="partnershipType" className="text-sm font-medium">Partnership Type</label>
                    <Select
                      value={form.partnershipType}
                      onValueChange={handleTypeChange}
                      disabled={sending}
                    >
                      <SelectTrigger
                        id="partnershipType"
                        className={`bg-background ${errors.partnershipType ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNERSHIP_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.partnershipType && <p className="text-xs text-destructive">{errors.partnershipType}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your goals and how you'd like to collaborate..."
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
                      Send Enquiry
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
