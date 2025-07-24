declare module '@/components/ui/*' {
  const component: any
  export default component
} 
export interface Project {
  id: string;
  title: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  techStack: string[];
}