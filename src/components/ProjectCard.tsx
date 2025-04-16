
import { Project } from "@/lib/projectData";
import { useInView } from "@/lib/animations";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [ref, isInView] = useInView();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isEven = index % 2 === 0;
  
  const animationClass = isInView 
    ? `opacity-100 translate-y-0 ${isEven ? 'translate-x-0' : 'translate-x-0'}`
    : `opacity-0 translate-y-10 ${isEven ? '-translate-x-10' : 'translate-x-10'}`;
    
  return (
    <div 
      ref={ref}
      className={`glass-card rounded-xl overflow-hidden transition-all duration-700 ease-out ${animationClass}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
          <div 
            className={`absolute inset-0 bg-gray-200 ${!imageLoaded ? 'animate-pulse' : ''}`}
          ></div>
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{project.title}</h3>
          
          <p className="text-primary/70 mb-4 flex-grow">{project.description}</p>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-normal">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              asChild
              variant="default" 
              size="sm"
              className="rounded-md flex items-center"
            >
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="rounded-md flex items-center"
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={16} className="mr-2" />
                Source Code
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
