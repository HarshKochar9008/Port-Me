
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: " Twitter AI Agent",
    description: "A full-featured e-commerce platform with product catalog, shopping cart, and secure checkout.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    demoUrl: "https://example.com/demo1",
    githubUrl: "https://github.com/username/ecommerce",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe API"]
  },
  {
    id: "project-2",
    title: "Curd Application",
    description: "A collaborative task management application with real-time updates and team sharing capabilities.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    demoUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/username/taskapp",
    techStack: ["React", "Firebase", "Tailwind CSS", "React DnD"]
  },
  {
    id: "project-3",
    title: "E-Commerce Platform",
    description: "An interactive dashboard visualizing financial data with advanced filtering and reporting features.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    demoUrl: "https://example.com/demo3",
    githubUrl: "https://github.com/username/finance-dashboard",
    techStack: ["React", "TypeScript", "D3.js", "Express", "PostgreSQL"]
  },
  {
    id: "project-4",
    title: "AI Government Chatbot",
    description: "A machine learning-powered tool that generates custom content based on user preferences.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    demoUrl: "https://example.com/demo4",
    githubUrl: "https://github.com/username/ai-content",
    techStack: ["React", "Python", "TensorFlow", "Flask", "Redis"]
  }
];

export interface Skill {
  category: string;
  items: string[];
}

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "HTML/CSS", "JavaScript"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Python", "Django", "Java", "Spring Boot", "RESTful APIs"]
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Prisma", "SQL"]
  },
  {
    category: "DevOps",
    items: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions", "Nginx", "Linux"]
  },
  {
    category: "Tools",
    items: ["Git", "VS Code", "Figma", "Postman", "Jest", "Webpack", "npm/yarn"]
  }
];
