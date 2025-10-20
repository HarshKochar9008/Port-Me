import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ResumeAnimation from "@/components/ResumeAnimation";
import ClickSpark from "../../components/ClickSpark";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen bg-background text-foreground pb-16 sm:pb-0">
        <Navbar />
        <ClickSpark
          sparkColor='#878787'
          sparkSize={18}
          sparkRadius={25}
          sparkCount={8}
          duration={400}
          extraScale={1.5}
        >
          <main>
            <section id="home">
              <Hero />
            </section>
            <section id="projects">
              <Projects />
            </section>
            <section id="resume" className="py-10 sm:py-20 flex flex-col items-center justify-center">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 shadow-sm">Document</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  My Resume
                </h2>
                <p className="text-base sm:text-lg text-primary/70">
                  View and download my professional resume.
                </p>
              </div>
              <ResumeAnimation className="mx-auto w-full max-w-[550px]" />
            </section>
            <section id="skills">
              <Skills />
            </section>
            <section id="scroll-animation">
              <ScrollAnimation />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </main>
        </ClickSpark>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
