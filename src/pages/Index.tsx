import { lazy, Suspense } from "react";
const IndexDesign = lazy(() => import("./IndexDesign"));
const IndexReal = lazy(() => import("./IndexReal"));
import { usePortfolioVersion } from "@/components/portfolio/portfolio-version";

const Index = () => {
  const { version } = usePortfolioVersion();
  const Page = version === "real" ? IndexReal : IndexDesign;
  return <Suspense fallback={<div className="min-h-screen" />}><Page /></Suspense>;
};

export default Index;
