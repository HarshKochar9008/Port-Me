import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const handleScrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-background border-t border-border/20 py-8 md:py-6 w-full mt-auto">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between md:items-start">
          <div className="order-3 md:order-1">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Developer Portfolio. All rights reserved by HK.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-6 order-1 md:order-2">
            <Button
              onClick={handleScrollToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center h-10 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md transition font-medium"
            >
              Send Message
            </Button>
            
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
