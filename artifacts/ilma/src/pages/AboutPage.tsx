import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Shield, Zap, GraduationCap, Briefcase, BookOpen } from 'lucide-react';

export default function AboutPage() {
  useDocumentMeta('About ILMA', 'Our mission to revolutionize biomedical engineering education.');
  useScrollTop();

  const objectives = [
    {
      title: "Bridge the Industry Gap",
      description: "Connect academic learning with real-world industry requirements through practical roadmaps.",
      icon: Briefcase
    },
    {
      title: "Clear Career Navigation",
      description: "Provide transparent data on salaries, growth, and daily responsibilities for every BME niche.",
      icon: Target
    },
    {
      title: "Curated Knowledge",
      description: "Organize the vast field of biomedical engineering into digestible, structured domains.",
      icon: BookOpen
    },
    {
      title: "Exam Preparation",
      description: "Demystify government and competitive exams with clear syllabi and strategy guides.",
      icon: GraduationCap
    },
    {
      title: "Foster Innovation",
      description: "Inspire the next generation to tackle complex healthcare challenges through engineering.",
      icon: Lightbulb
    }
  ];

  const personas = [
    {
      title: "Undergraduate Students",
      description: "Lost in the vastness of BME? Find your specialization, discover what skills you actually need, and plan your career before graduation.",
      icon: Users
    },
    {
      title: "Job Seekers & Freshers",
      description: "Prepare for interviews, understand the roles recruiters are hiring for, and build projects that stand out on your resume.",
      icon: Briefcase
    },
    {
      title: "Researchers & Academics",
      description: "Discover emerging domains, find recommended literature, and explore pathways to higher education and R&D roles.",
      icon: Lightbulb
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-card border-b border-border overflow-hidden relative">
        {/* Abstract SVG Illustration Background */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.7,-18,95.4,-3C94.1,12,85.5,26.5,74.7,38.6C63.9,50.7,50.9,60.4,36.5,67.6C22.1,74.8,6.3,79.5,-8.4,78.2C-23.1,76.9,-36.7,69.6,-49.8,60.1C-62.9,50.6,-75.5,38.9,-83.4,24.3C-91.3,9.7,-94.5,-7.8,-89.6,-22.6C-84.7,-37.4,-71.7,-49.5,-57.4,-56.9C-43.1,-64.3,-27.5,-67,-12.3,-69.7C2.9,-72.4,18.1,-75.1,30.5,-78.9C42.9,-82.7,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <SectionHeader 
            title="About ILMA" 
            subtitle="We believe that Biomedical Engineering is the most important discipline of the 21st century. Our mission is to equip the students who will build it."
            badge="Our Story"
            align="left"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-xl mb-2">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize access to high-quality career guidance, skill development, and industry knowledge for Biomedical Engineering students globally. We transform confusion into clarity.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 md:p-10 bg-accent rounded-3xl border border-primary/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
              <div className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-xl mb-6 relative z-10">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 relative z-10 text-foreground">The Vision</h2>
              <p className="text-lg text-foreground/80 leading-relaxed relative z-10">
                A world where every biomedical graduate transitions seamlessly into the industry, fully equipped to innovate and improve global healthcare outcomes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Core Objectives" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-accent rounded-lg text-primary w-fit mb-4">
                  <obj.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{obj.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{obj.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Who is ILMA for?" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {personas.map((persona, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <persona.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{persona.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{persona.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <SectionHeader title="Future Plans" subtitle="We are just getting started. Here is our roadmap." />
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            
            {[
              { version: "V1", date: "Present", title: "Information Hub", desc: "Launch of comprehensive career, domain, and roadmap databases." },
              { version: "V2", date: "Upcoming", title: "Interactive Learning", desc: "Interactive quizzes, practical coding environments, and project repositories." },
              { version: "V3", date: "Future", title: "Community Network", desc: "Peer-to-peer forums, mentorship matching, and verified recruiter access." },
              { version: "V4", date: "Vision", title: "Job Board", desc: "A dedicated hiring platform specifically for biomedical engineering roles globally." }
            ].map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-xs z-10">
                  {milestone.version}
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{milestone.title}</h3>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{milestone.date}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </Layout>
  );
}
