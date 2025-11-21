import ProjectCard, { projects } from "./ProjectCard";
import { useInView } from "@/lib/animations";
import CardCarousel from "@/components/ui/card-carousel"
import { Project } from "@/types";
import { SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    <section id="projects" className="relative overflow-hidden">
      <div className="section-container relative z-10" ref={ref}>
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4"
          >
            My Work
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <motion.div
                animate={isInView ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.6, delay: 0.3, repeat: Infinity, repeatDelay: 3 }}
              >
                <SparklesIcon className="inline-block fill-[#EEBDE0] stroke-1 text-neutral-800 dark:text-neutral-200 w-7 h-7 mb-1" />
              </motion.div>
              Latest Projects
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-primary/70"
          >
            A selection of my recent development work, showcasing different technologies and problem-solving approaches.
          </motion.p>
        </div>
        {/* Carousel below the heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-12 mb-8 sm:mb-12"
        >
          <CardCarousel
            projects={projects}
            autoplayDelay={3000}
            showPagination={true}
            showNavigation={true}
          />
        </motion.div>
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
