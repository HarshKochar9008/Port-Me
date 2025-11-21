import { useInView, useStaggeredAnimation } from "@/lib/animations";
import Ribbons from "./Ribbons";
import { motion } from "framer-motion";

interface Skill {
  category: string;
  items: string[];
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
}

const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "HTML/CSS", "JavaScript"],
    size: "medium",
    color: "primary"
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Python", "Java", "RESTful APIs"],
    size: "small",
    color: "secondary"
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "SQL"],
    size: "small",
    color: "accent"
  },
  {
    category: "DevOps",
    items: ["Docker", "GitHub Actions", "Linux"],
    size: "small",
    color: "primary"
  },
  {
    category: "Tools",
    items: ["Git", "VS Code", "Figma", "Postman", "npm/yarn"],
    size: "medium",
    color: "secondary"
  }
];

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
      <section id="skills" className="relative overflow-hidden min-h-[auto] !h-auto py-12 sm:py-16">
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
        <div className="section-container relative z-10 w-full py-8" ref={ref}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
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
              const colorClasses = {
                primary: "from-white/60 to-white/30 dark:from-white/10 dark:to-white/5",
                secondary: "from-white/60 to-white/30 dark:from-white/10 dark:to-white/5",
                accent: "from-white/60 to-white/30 dark:from-white/10 dark:to-white/5"
              };
              
              return (
                <motion.div 
                  key={skill.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-br ${colorClasses[skill.color || 'primary']} backdrop-blur-xl rounded-xl p-5 sm:p-6 border border-gray-300/60 dark:border-white/10 hover:border-gray-400/80 dark:hover:border-white/20 transition-all duration-300 h-full min-h-[200px] flex flex-col hover:scale-[1.02] shadow-xl dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.12)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-100/10 before:to-transparent dark:before:from-white/5 before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`}>
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-4 sm:mb-5">
                      {skill.category}
                    </h3>
                    
                    <ul className="space-y-2.5 sm:space-y-3 flex-1">
                      {skill.items.map((item, itemIndex) => (
                        <motion.li 
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                          className="flex items-center group/item"
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 group-hover/item:scale-150 transition-transform duration-300"></div>
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover/item:scale-150 transition-transform duration-300"></div>
                          </div>
                          <span className="text-sm sm:text-base text-foreground/80 dark:text-foreground/90 group-hover/item:text-primary transition-colors duration-300">{item}</span>
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
