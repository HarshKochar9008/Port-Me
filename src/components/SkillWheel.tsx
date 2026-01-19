import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { projects } from "./ProjectCard";
import { Project } from "@/types";
import { useInView } from "@/lib/animations";
import { ExternalLink, Github, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface FlipCardProps {
  project: Project | null;
  selectedSkills: string[];
  isFlipped: boolean;
  onFlip: () => void;
}

const FlipCard = ({ project, selectedSkills, isFlipped, onFlip }: FlipCardProps) => {
  if (!project) {
    return (
      <div className="relative w-[360px] h-[480px] perspective-1000">
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: 0 }}
        >
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-black/10 backdrop-blur-md border-2 border-primary/40 shadow-2xl flex items-center justify-center overflow-hidden">
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
              <p className="text-sm text-white/50 mt-4">
                Select skills from the wheel to see matching projects
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-[360px] h-[480px] perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onClick={onFlip}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-black/10 backdrop-blur-md border-2 border-primary/40 shadow-2xl overflow-hidden">
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
            
            <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-white/70 mb-6 drop-shadow-md">Click to view details</p>
            
            <div className="flex gap-3 mt-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-white/5 via-white/5 to-black/10 backdrop-blur-md border-2 border-primary/40 shadow-2xl overflow-hidden rotate-y-180">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50"></div>
          
          <div className="relative z-10 h-full flex flex-col p-6">
            {/* Shield with Star Icon */}
            <div className="absolute top-6 right-6 z-20">
              <div className="relative">
                <Shield className="w-12 h-12 text-primary fill-primary/30 drop-shadow-lg" />
                <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white fill-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-lg">
              {project.title}
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-4 text-center">
                  Technologies Used
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {project.techStack.map((tech) => {
                    const isSelected = selectedSkills.includes(tech);
                    return (
                      <div
                        key={tech}
                        className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all ${
                          isSelected
                            ? "bg-primary/30 border-2 border-primary/60 shadow-lg shadow-primary/20"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        <img
                          src={getSkillIconUrl(tech)}
                          alt={tech}
                          className="w-8 h-8 object-contain flex-shrink-0"
                        />
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-white font-semibold" : "text-white/80"
                          }`}
                        >
                          {tech}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="flex-1 bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
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
                className="flex-1 bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
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
      </motion.div>
    </div>
  );
};

const SkillWheel = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  
  // Touch gesture state
  const touchStartAngle = useRef<number>(0);
  const touchStartRotation = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const lastTouchAngle = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTouchTime = useRef<number>(0);
  const dragDistance = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const skills = getAllSkills();
  const angleStep = 360 / skills.length;
  
  const rotate = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const springRotate = useSpring(rotate, springConfig);
  
  useEffect(() => {
    setFilteredProjects(filterProjectsBySkills(selectedSkills));
    setCurrentProjectIndex(0);
    setIsFlipped(false);
  }, [selectedSkills]);
  
  // Calculate angle from touch point to center
  const getAngleFromTouch = (clientX: number, clientY: number): number => {
    if (!wheelContainerRef.current) return 0;
    const rect = wheelContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentProject) return; // Don't allow spinning when project is shown
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    dragDistance.current = 0;
    isDragging.current = false; // Will be set to true after minimum drag distance
    touchStartAngle.current = getAngleFromTouch(touch.clientX, touch.clientY);
    touchStartRotation.current = rotation;
    lastTouchAngle.current = touchStartAngle.current;
    lastTouchTime.current = Date.now();
    velocityRef.current = 0;
    
    // Stop any ongoing spring animation
    rotate.set(rotation);
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || currentProject) return;
    if (e.touches.length !== 1) return;
    
    e.preventDefault(); // Prevent scrolling
    
    const touch = e.touches[0];
    const currentAngle = getAngleFromTouch(touch.clientX, touch.clientY);
    const deltaAngle = currentAngle - touchStartAngle.current;
    
    // Calculate velocity for momentum
    const now = Date.now();
    const timeDelta = now - lastTouchTime.current;
    if (timeDelta > 0) {
      const angleDelta = currentAngle - lastTouchAngle.current;
      // Normalize angle delta to handle wrap-around
      let normalizedDelta = angleDelta;
      if (normalizedDelta > 180) normalizedDelta -= 360;
      if (normalizedDelta < -180) normalizedDelta += 360;
      velocityRef.current = normalizedDelta / timeDelta;
    }
    
    lastTouchAngle.current = currentAngle;
    lastTouchTime.current = now;
    
    // Update rotation
    const newRotation = touchStartRotation.current + deltaAngle;
    setRotation(newRotation);
    rotate.set(newRotation);
  };
  
  // Handle touch end with momentum
  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Apply momentum
    if (Math.abs(velocityRef.current) > 0.5) {
      const momentum = velocityRef.current * 300; // Adjust multiplier for spin strength
      const newRotation = rotation + momentum;
      setRotation(newRotation);
      rotate.set(newRotation);
    }
    
    // Reset velocity
    velocityRef.current = 0;
  };
  
  // Handle mouse drag (for desktop testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentProject) return;
    if (e.button !== 0) return; // Only left click
    
    isDragging.current = true;
    touchStartAngle.current = getAngleFromTouch(e.clientX, e.clientY);
    touchStartRotation.current = rotation;
    lastTouchAngle.current = touchStartAngle.current;
    lastTouchTime.current = Date.now();
    velocityRef.current = 0;
    
    rotate.set(rotation);
    
    // Add global mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      const currentAngle = getAngleFromTouch(e.clientX, e.clientY);
      const deltaAngle = currentAngle - touchStartAngle.current;
      
      const now = Date.now();
      const timeDelta = now - lastTouchTime.current;
      if (timeDelta > 0) {
        const angleDelta = currentAngle - lastTouchAngle.current;
        let normalizedDelta = angleDelta;
        if (normalizedDelta > 180) normalizedDelta -= 360;
        if (normalizedDelta < -180) normalizedDelta += 360;
        velocityRef.current = normalizedDelta / timeDelta;
      }
      
      lastTouchAngle.current = currentAngle;
      lastTouchTime.current = now;
      
      const newRotation = touchStartRotation.current + deltaAngle;
      setRotation(newRotation);
      rotate.set(newRotation);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      if (Math.abs(velocityRef.current) > 0.5) {
        const momentum = velocityRef.current * 300;
        const newRotation = rotation + momentum;
        setRotation(newRotation);
        rotate.set(newRotation);
      }
      velocityRef.current = 0;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
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
    if (isSpinning || currentProject) return;
    setIsSpinning(true);
    const randomRotation = rotation + 360 + Math.random() * 360;
    setRotation(randomRotation);
    rotate.set(randomRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      handleSkillClick(randomSkill);
    }, 2000);
  };
  
  const getSkillPosition = (index: number) => {
    const angle = (index * angleStep - 90) * (Math.PI / 180);
    const radius = 320; // Distance from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };
  
  const currentProject = filteredProjects.length > 0 ? filteredProjects[currentProjectIndex] : null;
  
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
            Spin the wheel to explore projects by technology. Drag to spin on mobile or click SPIN button. Select skills to filter projects.
          </p>
        </div>
        
        <div className="relative flex items-center justify-center min-h-[700px]">
          <div 
            ref={wheelContainerRef}
            className="relative w-full max-w-[700px] h-[700px] flex items-center justify-center touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{ touchAction: 'none' }}
          >
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
                    className={`absolute flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 backdrop-blur-md ${
                      isSelected
                        ? "bg-primary/40 scale-110 z-10 border-2 border-primary/70 shadow-lg shadow-primary/30"
                        : "bg-white/5 hover:bg-primary/15 border border-white/20 hover:border-primary/40"
                    }`}
                    style={{
                      left: `calc(50% + ${position.x}px)`,
                      top: `calc(50% + ${position.y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-white/10" : ""}`}>
                      <img
                        src={getSkillIconUrl(skill)}
                        alt={skill}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isSelected ? "text-white font-bold" : "text-white/70"
                      }`}
                    >
                      {skill}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <FlipCard
                project={currentProject}
                selectedSkills={selectedSkills}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />
            </div>
            
            {/* Spin button - Hidden when project is shown */}
            {!currentProject && (
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-36 h-36 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 border-2 border-primary/50 flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSpinning ? "Spinning..." : "SPIN"}
              </motion.button>
            )}
          </div>
          
          {/* Project navigation and selected skills - Positioned below wheel */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full max-w-2xl px-4">
            {filteredProjects.length > 1 && (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentProjectIndex((prev) => 
                      prev > 0 ? prev - 1 : filteredProjects.length - 1
                    );
                    setIsFlipped(false);
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
                >
                  ← Prev
                </Button>
                <span className="text-sm text-white/70">
                  {currentProjectIndex + 1} / {filteredProjects.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentProjectIndex((prev) => 
                      prev < filteredProjects.length - 1 ? prev + 1 : 0
                    );
                    setIsFlipped(false);
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/50 backdrop-blur-sm"
                >
                  Next →
                </Button>
              </div>
            )}
            
            {selectedSkills.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-white/70 mb-3">Selected Skills:</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                  {selectedSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-primary/30 text-white hover:bg-primary/40 border border-primary/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default SkillWheel;
