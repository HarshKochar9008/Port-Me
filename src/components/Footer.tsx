import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border/20 py-4 w-full relative bottom-20 h-  4">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center gap-4">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Developer Portfolio. All rights reserved by HK.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6 w-full md:w-auto">
            <a 
              href="https://github.com/HarshKochar9008" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={30} />
            </a>
            <a 
              href="https://www.linkedin.com/in/connectharsh1/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={30} />
            </a>
            <a 
              href="https://twitter.com/Too_harshk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={30} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
