import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import SkillsMarquee from "@/components/SkillsMarquee";
import Contact from "@/components/Contact";
import SnakeGame from "@/components/SnakeGame";
import Footer from "@/components/Footer";
import ResumeAnimation from "@/components/ResumeAnimation";
import ClickSpark from "../../components/ClickSpark";

const IndexDesign = () => {
  return (
    <div className="relative min-h-screen bg-transparent pb-24 text-foreground sm:pb-0">
      <Navbar />
      <ClickSpark
        sparkColor="#878787"
        sparkSize={18}
        sparkRadius={25}
        sparkCount={8}
        duration={400}
        extraScale={1.5}
      >
        <main className="overflow-x-hidden">
          <div id="home">
            <Hero />
          </div>
          <Projects />
          <section
            id="resume"
            className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-20"
          >
            <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 shadow-sm">
                Document
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                My Resume
              </h2>
              <p className="text-base sm:text-lg text-primary/70">
                View and download my resume.
              </p>
            </div>
            <ResumeAnimation className="mx-auto w-full max-w-[550px]" />
          </section>
          <SkillsMarquee />
          <Contact />
          <SnakeGame />
        </main>
      </ClickSpark>
      <Footer />
    </div>
  );
};

export default IndexDesign;
