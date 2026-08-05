import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Linkedin, Instagram, Send } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactPage() {
  useDocumentMeta('Contact', 'Get in touch with ILMA.');
  useScrollTop();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We've received your message and will get back to you soon.",
    });
    (e.target as HTMLFormElement).reset();
  };

  const faqs = [
    {
      q: "Is ILMA free for students?",
      a: "Yes, all our core resources—career guides, domain overviews, and learning roadmaps—are completely free for students."
    },
    {
      q: "Can I contribute an article or roadmap?",
      a: "Absolutely! We welcome contributions from industry professionals and experienced academics. Send us a message using the form."
    },
    {
      q: "Do you offer direct placement services?",
      a: "Currently, we provide guidance and resources. We plan to launch a dedicated job board in our V4 release."
    },
    {
      q: "How often is the data updated?",
      a: "We review and update our salary data, exam syllabi, and industry trends quarterly to ensure accuracy."
    }
  ];

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
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 rounded-3xl border border-border shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" required placeholder="John Doe" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" required placeholder="john@example.com" className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" required placeholder="How can we help?" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" required placeholder="Your message here..." className="min-h-[150px] bg-background" />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & FAQ */}
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
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Email Us</p>
                      <a href="mailto:ilmabiomedical@gmail.com" className="text-lg font-semibold hover:text-primary transition-colors">ilmabiomedical@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <a href="#" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors flex-1">
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                      <span className="font-semibold">LinkedIn</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors flex-1">
                      <Instagram className="w-6 h-6 text-[#E1306C]" />
                      <span className="font-semibold">Instagram</span>
                    </a>
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
