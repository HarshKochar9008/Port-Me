declare module '@/components/ui/*' {
  const component: any
  export default component
} 
export interface Project {
  id: string;
  title: string;
  logo: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  techStack: string[];
  /** One line on what the project actually does. A list of tech stacks tells a
   *  reader what it was built with but not what it is, so the Real page's
   *  project rows show this alongside the badges. Optional — the Design page's
   *  card layout has no room for it and ignores it. */
  blurb?: string;
}