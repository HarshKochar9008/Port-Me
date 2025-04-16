
import { Button } from "@/components/ui/button";
import { useInView } from "@/lib/animations";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const [ref, isInView] = useInView();

  const handleScrollDown = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      ref={ref}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background opacity-90"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-float animation-delay-500"></div>
      </div>
      
      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-6 animate-fade-in">
            Full-Stack Developer
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in animation-delay-100">
            Building digital experiences that make a difference
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-200 max-w-xl">
            I craft clean, user-friendly applications with modern technologies, focused on creating impactful solutions for real-world problems.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
            <Button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-md px-6 py-2.5"
            >
              View projects
            </Button>
            
            <Button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-border text-foreground hover:bg-accent rounded-md px-6 py-2.5"
            >
              Contact me
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={handleScrollDown}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-md text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
