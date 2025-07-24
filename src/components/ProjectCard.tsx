import { useInView } from "@/lib/animations";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Twitter AI Agent ",
    image: "https://i.ibb.co/ZR2hPSwK/image.png",
    demoUrl: "https://twitter-ai-agent.vercel.app/",
    githubUrl: "https://github.com/username/ecommerce",
    techStack: ["Twitter API", "OpenAI API", "TypeScript", "Eliza AI"]
  },
  {
    id: "project-2",
    title: "Crud Application",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    demoUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/username/taskapp",
    techStack: ["React", "Firebase", "Tailwind CSS", "React DnD"]
  },
  {
    id: "project-3",
    title: "PizzaBoi (E-Commerce)",
    image: "https://i.ibb.co/Rp1KD3bj/Screenshot-2025-07-24-232542.png",
    demoUrl: "https://pizza-boi.vercel.app/",
    githubUrl: "https://github.com/username/finance-dashboard",
    techStack: ["React", "TypeScript", "Express", "PostgreSQL"]
  },
  {
    id: "project-4",
    title: "AI Government Chatbot",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    demoUrl: "https://example.com/demo4",
    githubUrl: "https://github.com/username/ai-content",
    techStack: ["React", "Python", "TensorFlow", "Flask"]
  }
];

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [ref, isInView] = useInView();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  
  const animationClass = isInView 
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !imageRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      imageRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    };

    const handleMouseLeave = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = 'translate(0, 0) scale(1)';
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
    
  return (
    <div 
      ref={ref}
      className={`relative group overflow-hidden rounded-xl 
        ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
          ? 'bg-gradient-to-br dark:from-white/10 dark:to-black/5 dark:bg-gradient-to-br'
          : 'bg-slate-200'}
        backdrop-blur-sm border border-black-200 dark:border-white/20
        ${animationClass}
        max-w-sm`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
      
      {/* Content container */}
      <div className="relative z-10 p-4">
        {/* Image section with parallax */}
        <div className="relative mb-4 rounded-lg overflow-hidden aspect-[16/9]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              ref={imageRef}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-out"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent dark:from-black/90 dark:via-black/30 dark:to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Title and description */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>
            <div className="flex gap-1">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github size={14} className="text-neutral-900 dark:text-white" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} className="text-neutral-900 dark:text-white" />
                </a>
              </Button>
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white/90 hover:bg-primary/10 dark:hover:bg-primary/20 
                  transition-all duration-300 text-[10px] px-1.5 py-0.5 hover:scale-105"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 
        rounded-xl transition-colors duration-500"></div>
    </div>
  );
};

export default ProjectCard;
