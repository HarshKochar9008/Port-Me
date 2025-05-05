import { skills } from "@/lib/projectData";
import { useInView, useStaggeredAnimation } from "@/lib/animations";
import Ribbons from "./Ribbons";
import { motion } from "framer-motion";

const Skills = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <>
      {/* Rotated text OUTSIDE the skills section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="hidden sm:flex items-center justify-center fixed left-0 top-1/3 -translate-y-1/2 z-30 pl-0 ml-0 "
        style={{ writingMode: 'vertical-rl', rotate: '-90deg' }}
      >
        <span className="text-primary font-extrabold text-4xl font-mono tracking-tight select-none" style={{ transform: 'rotate(-90deg)' }}>
          MOVE CURSOR
        </span>
      </motion.div>
      {/* End rotated text */}
      <section id="skills" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Ribbons
            baseThickness={30}
            colors={['#ffffff']}
            speedMultiplier={0.5}
            maxAge={500}
            enableFade={false}
            enableShaderEffect={true}
          />
        </div>
        <div className="section-container relative z-10 w-full" ref={ref}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block relative">
              <span className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/10 blur-lg"></span>
              <span className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
                Expertise
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                Skills & Technologies
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </h2>
            
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base text-primary/70"
            >
              A comprehensive list of my technical skills and the technologies I work with.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {skills.map((skill, categoryIndex) => {
              const delays = useStaggeredAnimation(skill.items.length);
              
              return (
                <motion.div 
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-primary/20 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                      {skill.category}
                    </h3>
                    
                    <ul className="space-y-3">
                      {skill.items.map((item, itemIndex) => (
                        <motion.li 
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                          className="flex items-center group/item"
                        >
                          <div className="relative">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 group-hover/item:scale-150 transition-transform duration-300"></div>
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover/item:scale-150 transition-transform duration-300"></div>
                          </div>
                          <span className="text-primary/80 group-hover/item:text-primary transition-colors duration-300">{item}</span>
                          <div className="ml-auto flex items-center">
                            <div className="w-16 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${Math.random() * 60 + 40}%` } : { width: 0 }}
                                transition={{ duration: 1, delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                                className="h-full bg-primary rounded-full"
                              />
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;
