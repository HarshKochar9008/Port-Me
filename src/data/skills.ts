import {
  SiAmazon,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFigma,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiPython,
} from "react-icons/si";
import { FaCode, FaCog, FaDatabase, FaJava, FaServer, FaTools } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";

export interface SkillItem {
  name: string;
  icon: any;
  color: string;
  linearGradient?: string;
}

export interface SkillCategory {
  category: string;
  categoryIcon: any;
  items: SkillItem[];
}

// Mirrors the content used in `src/components/Skills.tsx` (same labels + icons).
export const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    categoryIcon: FaCode,
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Redux", icon: SiRedux, color: "#764ABC" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ],
  },
  {
    category: "Backend",
    categoryIcon: FaServer,
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#000000" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: FaJava, color: "#007396" },
      { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    category: "Database",
    categoryIcon: FaDatabase,
    items: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    ],
  },
  {
    category: "DevOps",
    categoryIcon: FaCog,
    items: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "AWS", icon: SiAmazon, color: "#FF9900" },
    ],
  },
  {
    category: "Tools",
    categoryIcon: FaTools,
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "VS Code", icon: VscVscode, color: "#007ACC" },
      { name: "Figma", icon: SiFigma, linearGradient: "linear-gradient(to right, #ff0808, #ffffff)", color: "#09daff" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "npm", icon: SiNpm, color: "#CB3837" },
    ],
  },
];

