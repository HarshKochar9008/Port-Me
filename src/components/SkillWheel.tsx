import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { projects } from "./ProjectCard";
import { Project } from "@/types";
import { useInView } from "@/lib/animations";
import { ExternalLink, Github, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Get all unique skills from projects
const getAllSkills = (): string[] => {
  const skillsSet = new Set<string>();
  projects.forEach((project) => {
    project.techStack.forEach((skill) => {
      skillsSet.add(skill);
    });
  });
  return Array.from(skillsSet);
};

// Get Devicon icon URL for a skill
const getSkillIconUrl = (skill: string): string => {
  const iconMap: { [key: string]: string } = {
    React: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    Express: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
    PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    Firebase: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg",
    "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    "React DnD": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "Twitter API": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg",
    "OpenAI API": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg",
    "Eliza AI": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    TensorFlow: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg",
    Flask: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg",
    HTML5: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    ".NET": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg",
    "Spring Boot": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
  };
  
  if (iconMap[skill]) {
    return iconMap[skill];
  }
  
  const lowerSkill = skill.toLowerCase();
  for (const [key, value] of Object.entries(iconMap)) {
    if (key.toLowerCase() === lowerSkill) {
      return value;
    }
  }
  
  return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg";
};

// Filter projects based on selected skills
const filterProjectsBySkills = (selectedSkills: string[]): Project[] => {
  if (selectedSkills.length === 0) return [];
  
  return projects.filter((project) => {
    return selectedSkills.some((skill) =>
      project.techStack.some(
        (tech) => tech.toLowerCase() === skill.toLowerCase()
      )
    );
  });
};

const CenterCard = ({ project }: { project: Project | null }) => {
  if (!project) {
    return (
      <div className="relative w-[360px] h-[480px]">
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-black/10 backdrop-blur-md border-2 border-primary/40 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50"></div>
          
          <div className="relative z-10 text-center p-8 w-full h-full flex flex-col items-center justify-center">
            {/* Shield with Star Icon */}
            <div className="absolute top-6 right-6 z-20">
              <div className="relative">
                <Shield className="w-12 h-12 text-primary fill-primary/30 drop-shadow-lg" />
                <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white fill-white" />
              </div>
            </div>
            
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Project 1
            </h3>
            <p className="text-lg text-white/70 drop-shadow-md">
              Project Description
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[360px] h-[480px]">
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-black/10 backdrop-blur-md border-2 border-primary/40 shadow-2xl overflow-hidden">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50"></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Shield with Star Icon */}
          <div className="absolute top-6 right-6 z-20">
            <div className="relative">
              <Shield className="w-12 h-12 text-primary fill-primary/30 drop-shadow-lg" />
              <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white fill-white" />
            </div>
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {project.title}
          </h3>
          
          <div className="flex gap-3 mt-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} className="mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
            >
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} className="mr-2" />
                Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillWheel = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const skills = getAllSkills();
  const angleStep = 360 / skills.length;
  
  const rotate = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const springRotate = useSpring(rotate, springConfig);
  
  useEffect(() => {
    setFilteredProjects(filterProjectsBySkills(selectedSkills));
  }, [selectedSkills]);
  
  const handleSkillClick = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };
  
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomRotation = rotation + 360 * 3 + Math.random() * 360;
    setRotation(randomRotation);
    rotate.set(randomRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };
  
  const getSkillPosition = (index: number) => {
    const angle = (index * angleStep - 90) * (Math.PI / 180);
    const radius = 320; // Distance from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };
  
  const currentProject = filteredProjects.length > 0 ? filteredProjects[0] : null;
  
  return (
    <section id="skill-wheel" className="relative w-full overflow-hidden py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="section-container relative z-10" ref={ref}>
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
          <span
            className={`inline-block px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-full mb-6 transition-all duration-500 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            Interactive
          </span>
          
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-500 delay-100 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center gap-3 justify-center text-white">
              <Shield className="inline-block fill-primary stroke-1 text-primary w-8 h-8" />
              Skill Wheel
            </span>
          </h2>
          
          <p
            className={`text-primary/80 text-lg transition-all duration-500 delay-200 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            Explore projects by technology. Click on skills to see matching projects.
          </p>
        </div>
        
        <div className="relative flex items-center justify-center min-h-[700px]">
          <div className="relative w-full max-w-[700px] h-[700px] flex items-center justify-center">
            <div className="absolute w-[680px] h-[680px] rounded-full border border-white/30"></div>
            
            <motion.div
              ref={wheelRef}
              className="relative w-full h-full flex items-center justify-center"
              style={{
                rotate: springRotate,
              }}
            >
              {skills.map((skill, index) => {
                const position = getSkillPosition(index);
                const isSelected = selectedSkills.includes(skill);
                
                return (
                  <motion.button
                    key={skill}
                    onClick={() => handleSkillClick(skill)}
                    className={`absolute flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? "bg-primary/40 scale-110 z-10 border-2 border-primary/70 shadow-lg shadow-primary/30"
                        : "bg-white/5 hover:bg-primary/15 border border-white/20 hover:border-primary/40"
                    }`}
                    style={{
                      left: `calc(50% + ${position.x}px)`,
                      top: `calc(50% + ${position.y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={getSkillIconUrl(skill)}
                      alt={skill}
                      className="w-12 h-12 object-contain"
                    />
                  </motion.button>
                );
              })}
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <CenterCard project={currentProject} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillWheel;
