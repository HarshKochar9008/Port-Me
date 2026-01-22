import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Trigger effect when user scrolls near bottom (within 500px of bottom)
      setScrolled(scrollHeight - scrollTop - clientHeight < 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleScrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <footer className={`w-full mt-auto py-8 md:py-6 transition-all duration-500 ease-in-out ${
      scrolled ? 'pb-8' : 'pb-6'
    }`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'max-w-5xl' 
          : 'container max-w-6xl'
      }`}>
        <div className={`flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between md:items-start transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-background/70 backdrop-blur-xl shadow-lg border border-border/30 rounded-full px-8 py-4' 
            : 'bg-transparent border-t border-border/20 px-0 py-0 pt-2'
        }`}>
          <div className="order-3 md:order-1">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Developer Portfolio. All rights reserved by HK.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-6 order-1 md:order-2">
            
            <div className="flex items-center justify-center flex-row gap-x-6">
              <a 
                href="https://github.com/HarshKochar9008" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github size={24} className="sm:w-[30px] sm:h-[30px]" />
              </a>
              <a 
                href="https://www.linkedin.com/in/connectharsh1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} className="sm:w-[30px] sm:h-[30px]" />
              </a>
              <a 
                href="https://twitter.com/Too_harshk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter size={24} className="sm:w-[30px] sm:h-[30px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
