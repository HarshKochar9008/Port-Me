
import { skills } from "@/lib/projectData";
import { useInView, useStaggeredAnimation } from "@/lib/animations";

const Skills = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <section id="skills" className="">
      <div className="section-container" ref={ref}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 transition-all duration-500 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Expertise
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 delay-100 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            Skills & Technologies
          </h2>
          
          <p className={`text-primary/70 transition-all duration-500 delay-200 ${
            isInView ? 'opacity-100' : 'opacity-0 translate-y-4'
          }`}>
            A comprehensive list of my technical skills and the technologies I work with.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, categoryIndex) => {
            const delays = useStaggeredAnimation(skill.items.length);
            
            return (
              <div 
                key={skill.category}
                className={`glass-card rounded-xl p-6 transition-all duration-500 ${
                  isInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${categoryIndex * 100}ms` }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary">{skill.category}</h3>
                
                <ul className="space-y-2">
                  {skill.items.map((item, itemIndex) => (
                    <li 
                      key={item}
                      className={`flex items-center transition-all duration-300 ${
                        isInView 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${categoryIndex * 100 + delays[itemIndex]}ms` }}
                    >
                      <span className="w-2 h-2 bg-primary/30 rounded-full mr-3"></span>
                      <span className="text-primary/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
