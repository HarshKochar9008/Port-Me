import ProjectCard, { projects } from "./ProjectCard";
import { useInView } from "@/lib/animations";
import CardCarousel from "@/components/ui/card-carousel"
import { Project } from "@/types";
import { SparklesIcon } from "lucide-react";

const Projects = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  // Split projects into two columns
  const leftColumn = projects.filter((_, idx) => idx % 2 === 0);
  const rightColumn = projects.filter((_, idx) => idx % 2 === 1);

  const carouselImages = projects.map(project => ({
    src: project.image,
    alt: project.title
  }))

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
            <span className="inline-flex items-center gap-2 justify-center">
              <SparklesIcon className="inline-block fill-[#EEBDE0] stroke-1 text-neutral-800 w-7 h-7 mb-1" />
              Latest Projects
            </span>
          </h2>
          
          <p className={`text-primary/70 transition-all duration-500 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            A selection of my recent development work, showcasing different technologies and problem-solving approaches.
          </p>
        </div>
        {/* Carousel below the heading */}
        <div className="mt-12  mb-12">
          <CardCarousel
            projects={projects}
            autoplayDelay={3000}
            showPagination={true}
            showNavigation={true}
          />
        </div>
         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:justify-center md:items-start">
            
            <div className="flex flex-col gap-8 items-center w-full">
              {leftColumn.map((project, i) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={i * 2} 
                />
              ))}
            </div>
            <div className="flex flex-col gap-8 items-center w-full">
              {rightColumn.map((project, i) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={i * 2 + 1} 
                />
              ))}
            </div>
          </div>  */}
      </div>
    </section>
  );
};

export default Projects;
