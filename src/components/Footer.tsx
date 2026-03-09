import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter } from "lucide-react";

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
  
  return (
    <footer className={`mt-auto w-full py-6 transition-all duration-500 ease-in-out md:py-6 ${
      scrolled ? 'pb-8' : 'pb-6'
    }`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'max-w-5xl' 
          : 'container max-w-6xl'
      }`}>
        <div className={`flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-in-out md:flex-row md:items-start md:justify-between md:gap-6 ${
          scrolled 
            ? 'rounded-2xl border border-border/30 bg-background/70 px-5 py-4 shadow-lg backdrop-blur-xl sm:rounded-full sm:px-8' 
            : 'border-t border-border/20 bg-transparent px-0 pt-2'
        }`}>
          <div className="order-3 md:order-1">
            <p className="text-center text-xs text-muted-foreground sm:text-sm md:text-left">
              © {currentYear} Developer Portfolio. All rights reserved by HK.
            </p>
          </div>
          
          <div className="order-1 flex flex-col items-center justify-center gap-4 md:order-2 md:gap-6">
            
            <div className="flex flex-row items-center justify-center gap-x-5 sm:gap-x-6">
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
