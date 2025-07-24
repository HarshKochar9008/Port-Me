import { Button } from "@/components/ui/button";
import { useInView } from "@/lib/animations";
import { ArrowDown } from "lucide-react";
import ShapeBlurContainer from "./ShapeBlurContainer";
import { useEffect, useState } from "react";
import "@/styles/animations.css";

const Hero = () => {
  const [ref, isInView] = useInView();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const words = ["Full-Stack Developer", "Web3 Developer", "AI Developer", "UI/UX Designer"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFlipping(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      ref={ref}
      className="min-h-[10vh] sm:min-h-[80vh] flex flex-col justify-center relative overflow-hidden px-6 sm:px-6 pt-0 sm:pt-0 mt-0"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <ShapeBlurContainer 
          variation={0}
          shapeSize={1.5}
          roundness={1}
          borderSize={0.05}
          circleSize={0.5}
          circleEdge={1}
        />
        <div className="absolute inset-0 bg-background opacity-85"></div>
        <div className="absolute top-1/3 -right-16 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -left-16 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full filter blur-3xl animate-float animation-delay-500"></div>
      </div>
      
      <div className="section-container relative z-10 px-6 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-6 sm:mb-6 animate-fade-in">
            <span className={`inline-block transition-all duration-500 transform hover:scale-105 ${isFlipping ? 'animate-flip-out' : 'animate-flip-in'}`}>
              {words[currentWordIndex]}
            </span>
          </span>
          
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in animation-delay-100 leading-tight">
          Hey, I’m <span className="text-primary">Harsh</span>. I design cool stuff and love solving problems.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 animate-fade-in animation-delay-200 max-w-xl">
            I craft clean, user-friendly applications with modern technologies, focused on creating impactful solutions for real-world problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
            <Button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto rounded-md px-6 py-3 text-base"
            >
              View projects
            </Button>
            
            <Button 
              onClick={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="w-full sm:w-auto border-white text-foreground hover:bg-accent rounded-md px-6 py-3 text-base"
            >
              My Resume
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
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
