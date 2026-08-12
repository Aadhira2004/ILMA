import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  Map,
  BookOpen,
  Award,
  CheckCircle2,
  Microscope,
  Cog,
  Bot,
  Cpu,
  Dna,
  BrainCircuit,
  HeartPulse,
  Scan,
  Binary,
  Wrench,
  Smartphone,
  FlaskConical,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  useDocumentMeta('Home', 'The Future of Biomedical Engineering Starts Here');

  const stats = [
    { label: "Careers Explained", value: 65, suffix: "+", icon: Compass },
    { label: "Biomedical Domains", value: 50, suffix: "", icon: BookOpen },
    { label: "Skill Roadmaps", value: 10, suffix: "", icon: Map },
    { label: "Government Exams", value: 10, suffix: "", icon: Award },
  ];

  // Titles must exactly match the "category" values in domains.json
  const exploreCategories = [
    { title: "Biomedical Engineering", icon: Cog },
    { title: "Biomedical Science", icon: Microscope },
    { title: "Medical Devices", icon: Scan },
    { title: "Biotechnology", icon: Dna },
    { title: "AI & Computing", icon: Cpu },
    { title: "Healthcare", icon: HeartPulse },
    { title: "Robotics", icon: Bot },
    { title: "Clinical", icon: Wrench },
    { title: "Research", icon: FlaskConical },
    { title: "Emerging Technologies", icon: BrainCircuit },
    { title: "Digital Health", icon: Smartphone },
    { title: "All Domains", icon: Binary, all: true },
  ];

  const features = [
    {
      title: "Career Guidance",
      description: "Discover paths from clinical engineering to AI in healthcare. See salaries, daily routines, and growth trajectories.",
      icon: Compass,
      link: "/careers",
      color: "bg-blue-500"
    },
    {
      title: "Learning Roadmaps",
      description: "Step-by-step guides for mastering essential skills like Python, MATLAB, and Medical Image Processing.",
      icon: Map,
      link: "/roadmaps",
      color: "bg-teal-500"
    },
    {
      title: "Biomedical Domains",
      description: "Deep dive into specialized fields like Tissue Engineering, Neural Engineering, and Biomechanics.",
      icon: BookOpen,
      link: "/domains",
      color: "bg-purple-500"
    },
    {
      title: "Government Exams",
      description: "Comprehensive details on GATE, ISRO, DRDO, and other public sector opportunities.",
      icon: Award,
      link: "/exams",
      color: "bg-orange-500"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing Blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary font-medium text-sm mb-6 border border-primary/10 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Platform V1.0 is Live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              The Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Biomedical Engineering</span>
              <br className="hidden md:block" /> Starts Here
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Empowering students with structured learning, career guidance, skill roadmaps, and exam preparation. Build the future of healthcare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-medium group">
                <Link href="/careers">
                  Explore Careers
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-medium bg-background/50 backdrop-blur">
                <Link href="/domains">
                  Explore Domains
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Animated ECG Line SVG */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 w-full max-w-3xl mx-auto h-24 relative overflow-hidden"
          >
            <svg viewBox="0 0 1000 100" className="w-full h-full stroke-primary/30" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <motion.path 
                d="M 0 50 L 200 50 L 220 30 L 240 70 L 270 10 L 300 90 L 320 50 L 700 50 L 720 30 L 740 70 L 770 10 L 800 90 L 820 50 L 1000 50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="p-4 rounded-2xl bg-accent text-primary mb-2">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-heading text-foreground">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore the Biomedical World */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary font-medium text-sm mb-6 border border-primary/10 shadow-sm">
              <Compass className="h-4 w-4" />
              Discover Your Path
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore the Biomedical World</h2>
            <p className="text-lg text-muted-foreground">
              From cells to circuits, dive into the interconnected fields shaping the future of medicine and healthcare technology.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {exploreCategories.map((category, i) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              >
                <Link
                  href={category.all ? "/domains" : `/domains?category=${encodeURIComponent(category.title)}`}
                  className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  <div className="relative h-full flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    {/* Hover gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                    <div className="p-4 rounded-2xl bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <category.icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-sm md:text-base font-semibold leading-snug text-foreground">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ILMA */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-muted-foreground">
              We've mapped out the entire biomedical engineering landscape so you can navigate your education and career with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={feature.link} className="block group h-full">
                  <div className="h-full p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col">
                    <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`} />
                    
                    <div className="p-3 bg-accent rounded-xl w-fit mb-6 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-primary font-medium text-sm">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        {/* Abstract pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>

        <div className="container px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-primary-foreground"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Stop guessing your career path. Join the most comprehensive platform built exclusively for Biomedical Engineers.
            </p>
            <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold group bg-white text-primary hover:bg-white/90 shadow-xl">
              <Link href="/careers">
                Start Exploring Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
