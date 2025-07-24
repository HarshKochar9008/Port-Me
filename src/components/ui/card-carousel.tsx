import React from "react";
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
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 350px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  /* Make Swiper pagination dots pink */
  .swiper-pagination-bullet {
    background: gray !important;
  }
  .swiper-pagination-bullet-active {
    background: blue !important;
  }
  `;
  return (
    <section className="w-ace-y-4">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >

          </Badge>
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">

            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {projects.map((project, index) => (
                  <SwiperSlide key={project.id} style={{ position: 'relative' }}>
                    <div
                      className={`relative group overflow-hidden rounded-xl bg-gray-900 wmax-w-sm mx-auto`}
                    >
                      {/* Background gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
                      {/* Content container */}
                      <div className="relative z-10 p-4">
                        {/* Image section */}
                        <div className="relative mb-4 rounded-lg overflow-hidden aspect-[16/9]">
                          <div className="absolute inset-0 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 ease-out"
                            />
                          </div>
                          <div className="absolute inset-0  dark:from-black/90 dark:via-black/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                              {project.title}
                            </h3>
                            <div className="flex gap-1">
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                              >
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github size={14} className="text-neutral-900 dark:text-white" />
                                </a>
                              </Button>
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                              >
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink size={14} className="text-neutral-900 dark:text-white" />
                                </a>
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white/90 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 text-[10px] px-1.5 py-0.5 hover:scale-105"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Hover effect border */}
                      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-xl transition-colors duration-500"></div>
                    </div>
                  </SwiperSlide>
                ))}
                </Swiper>
                <div className="flex justify-center mt-14">
                    <SlideButton />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel; 