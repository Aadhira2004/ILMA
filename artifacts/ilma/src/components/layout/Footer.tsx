import React from 'react';
import { Link } from 'wouter';
import { ActivitySquare, Mail, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <ActivitySquare className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl leading-none tracking-tight">ILMA</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-xs">
              Empowering Biomedical Engineering students with structured learning, career guidance, skill roadmaps, and exam preparation.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="p-2 bg-accent text-accent-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-accent text-accent-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-accent text-accent-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Explore</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About ILMA</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Explorer</Link></li>
              <li><Link href="/domains" className="text-sm text-muted-foreground hover:text-primary transition-colors">Biomedical Domains</Link></li>
              <li><Link href="/roadmaps" className="text-sm text-muted-foreground hover:text-primary transition-colors">Skill Roadmaps</Link></li>
              <li><Link href="/exams" className="text-sm text-muted-foreground hover:text-primary transition-colors">Government Exams</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Resources</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest biomedical trends and career opportunities.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background border-input"
              />
              <Button className="w-full group">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ILMA – Biomedical Future. All rights reserved.</p>
          <p>Designed for Biomedical Engineers, by Biomedical Engineers.</p>
        </div>
      </div>
    </footer>
  );
}
