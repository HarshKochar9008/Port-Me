import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { SparklesIcon, Github, ExternalLink } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { SlideButton } from "./slide-button";
import { motion } from "framer-motion";

interface CarouselProps {
  projects: Project[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

const CardCarousel: React.FC<CarouselProps> = ({
  projects,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 80px;
    padding-top: 20px;
    overflow: visible;
    min-height: 600px;
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 350px;
    max-width: 90vw;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transition: transform 0.3s ease;
  }
  @media (min-width: 640px) {
    .swiper-slide {
      width: 450px;
    }
  }
  @media (min-width: 1024px) {
    .swiper-slide {
      width: 550px;
    }
  }
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  .swiper-pagination {
    bottom: 10px !important;
  }
  .swiper-pagination-bullet {
    background: rgba(156, 163, 175, 0.5) !important;
    width: 10px !important;
    height: 10px !important;
    transition: all 0.3s ease !important;
  }
  .swiper-pagination-bullet-active {
    background: hsl(var(--primary)) !important;
    width: 24px !important;
    border-radius: 5px !important;
  }
  `;
  return (
    <section className="w-full">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative w-full">
          <div className="relative w-full overflow-hidden">
            <Swiper
              spaceBetween={30}
              autoplay={{
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={projects.length >= 3}
              slidesPerView={"auto"}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 200,
                modifier: 1.5,
                slideShadows: true,
              }}
              pagination={showPagination ? {
                clickable: true,
                dynamicBullets: true,
              } : false}
              navigation={showNavigation}
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              className="!overflow-visible"
            >
                {projects.map((project, index) => {
                  const isActive = activeIndex === index;
                  const isHovered = hoveredCard === index;
                  
                  return (
                    <SwiperSlide key={project.id} style={{ position: 'relative' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: isActive ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        onHoverStart={() => setHoveredCard(index)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className={`relative group overflow-hidden rounded-2xl bg-card border border-border/50 backdrop-blur-sm max-w-xl mx-auto cursor-pointer ${
                          isActive ? 'shadow-2xl shadow-primary/20' : 'shadow-lg'
                        }`}
                      >
                        {/* Animated background gradient */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
                          animate={{
                            opacity: isHovered ? 0.3 : 0.1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Shine effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                        />
                        
                        {/* Content container */}
                        <div className="relative z-10 p-5 sm:p-6">
                          {/* Image section with zoom effect */}
                          <motion.div 
                            className="relative mb-5 sm:mb-6 rounded-xl overflow-hidden aspect-[16/9] bg-muted"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              animate={{
                                scale: isHovered ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </motion.div>
                          
                          <div className="space-y-4">
                            {/* Title and icons */}
                            <div className="flex items-start justify-between gap-3">
                              <motion.h3 
                                className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 flex-1"
                                animate={{
                                  x: isHovered ? 5 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                {project.title}
                              </motion.h3>
                              <div className="flex gap-2 flex-shrink-0">
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary/10 transition-all duration-300"
                                  >
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                      <Github size={16} className="text-foreground" />
                                    </a>
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary/10 transition-all duration-300"
                                  >
                                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                                      <ExternalLink size={16} className="text-foreground" />
                                    </a>
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                            
                            {/* Tech stack badges with stagger animation */}
                            <div className="flex flex-wrap gap-2">
                              {project.techStack.map((tech, techIndex) => (
                                <motion.div
                                  key={tech}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ 
                                    opacity: isActive ? 1 : 0.7,
                                    scale: 1,
                                  }}
                                  transition={{ 
                                    delay: techIndex * 0.05,
                                    duration: 0.2 
                                  }}
                                  whileHover={{ scale: 1.1, y: -2 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="bg-muted text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs px-2.5 py-1 cursor-default"
                                  >
                                    {tech}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Animated border on hover */}
                        <motion.div 
                          className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-colors duration-300 ${
                            isHovered ? 'border-primary/30' : 'border-transparent'
                          }`}
                        />
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              
              {/* Slide button with animation */}
              <motion.div 
                className="flex justify-center items-center mt-8 mb-4 min-h-[3rem]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative w-full max-w-[12rem] h-12">
                  <SlideButton />
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel; 