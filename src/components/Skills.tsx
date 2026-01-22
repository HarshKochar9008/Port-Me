import { useInView, useStaggeredAnimation } from "@/lib/animations";
import Ribbons from "./Ribbons";
import { motion } from "framer-motion";
import { 
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiRedux, SiHtml5, SiCss3, SiJavascript,
  SiNodedotjs, SiExpress, SiPython,
  SiMongodb, SiPostgresql, SiMysql, SiFirebase,
  SiDocker, SiGithubactions, SiLinux,
  SiGit, SiFigma, SiPostman, SiNpm,
  SiGraphql, SiAmazon
} from "react-icons/si";
import { FaCode, FaServer, FaDatabase, FaTools, FaCog, FaJava } from "react-icons/fa";
import { VscVscode  } from "react-icons/vsc";

interface SkillItem {
  name: string;
  icon: any;
  color: string;
  linearGradient?: string;
}

interface Skill {
  category: string;
  categoryIcon: any;
  items: SkillItem[];
  gridArea?: string;
}

const skills: Skill[] = [
  {
    category: "Frontend",
    categoryIcon: FaCode,
    gridArea: "frontend",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Redux", icon: SiRedux, color: "#764ABC" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ]
  },
  {
    category: "Backend",
    categoryIcon: FaServer,
    gridArea: "backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#000000" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: FaJava, color: "#007396" },
      { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    ]
  },
  {
    category: "Database",
    categoryIcon: FaDatabase,
    gridArea: "database",
    items: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    ]
  },
  {
    category: "DevOps",
    categoryIcon: FaCog,
    gridArea: "devops",
    items: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "AWS", icon: SiAmazon, color: "#FF9900" },
    ]
  },
  {
    category: "Tools",
    categoryIcon: FaTools,
    gridArea: "tools",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "VS Code", icon: VscVscode , color: "#007ACC" },
      { name: "Figma", icon: SiFigma, linearGradient: "linear-gradient(to right, #ff0808, #ffffff)", color: "#09daff" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "npm", icon: SiNpm, color: "#CB3837" },
    ]
  }
];

const Skills = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="hidden sm:flex items-center justify-center fixed left-0 top-1/3 -translate-y-1/2 z-30 pl-0 ml-0 "
        style={{ writingMode: 'vertical-rl', rotate: '-90deg' }}
      >
        <span className="text-white-500 font-extrabold text-4xl font-mono tracking-tight select-none" style={{position: 'relative', transform: 'rotate(-90deg)',  top: '50px' }}>
          MOVE CURSOR
        </span>
      </motion.div>
      <section id="skills" className="relative overflow-hidden min-h-[auto] !h-auto py-12 sm:py-16">
        <div className="absolute inset-0 z-0">
          <Ribbons
            baseThickness={30}
            colors={['#ffffff']}
            speedMultiplier={1}
            maxAge={500}
            enableFade={false}
            enableShaderEffect={true}
          />
        </div>
        <div className="section-container relative z-10 w-full py-8" ref={ref}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
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
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-auto">
            {skills.map((skill, categoryIndex) => {
              const CategoryIcon = skill.categoryIcon;
              
              // Define different grid spans for bento layout
              const gridSpans = [
                "lg:col-span-2 lg:row-span-2", // Frontend - large
                "lg:col-span-2 lg:row-span-1", // Backend - wide
                "lg:col-span-2 lg:row-span-1", // Database - wide
                "lg:col-span-2 lg:row-span-1", // DevOps - wide
                "lg:col-span-2 lg:row-span-1", // Tools - wide
              ];
              
              return (
                <motion.div 
                  key={skill.category}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className={`relative group ${gridSpans[categoryIndex]}`}
                >
                  <div className="bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-300/60 dark:border-white/10 hover:border-gray-400/80 dark:hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:scale-[1.02] shadow-xl dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.12)] overflow-hidden">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                        <CategoryIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-primary">
                        {skill.category}
                      </h3>
                    </div>
                    
                    <div className={`grid ${categoryIndex === 0 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'} gap-4 flex-1 relative z-10`}>
                      {skill.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: categoryIndex * 0.1 + itemIndex * 0.05,
                              type: "spring",
                              stiffness: 200
                            }}
                            className="flex flex-col items-center justify-center   rounded-xl  hover:bg-white/80 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/10 hover:border-primary/30 transition-all duration-300 group/item cursor-pointer hover:scale-105 hover:shadow-lg"
                            whileHover={{ y: -10 }}
                          >
                            <Icon 
                              className="w-4 h-4 sm:w-10 sm:h-10 mb-2 transition-all duration-300 group-hover/item:scale-110" 
                              style={{ 
                                color: item.color,
                                filter: "drop-shadow(0 2px 4px rgb(0, 0, 0))"
                              }}
                            />
                            <span className="text-xs sm:text-sm font-medium text-center text-foreground/70 dark:text-foreground/80 group-hover/item:text-primary transition-colors duration-300">
                              {item.name}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
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
