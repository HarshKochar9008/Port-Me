
import { projects } from "@/lib/projectData";
import ProjectCard from "./ProjectCard";
import { useInView } from "@/lib/animations";

const Projects = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <section id="projects" className="">
      <div className="section-container" ref={ref}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 transition-all duration-500 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            My Work
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 delay-100 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Featured Projects
          </h2>
          
          <p className={`text-primary/70 transition-all duration-500 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            A selection of my recent development work, showcasing different technologies and problem-solving approaches.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>

    </section>
  );
};

export default Projects;
