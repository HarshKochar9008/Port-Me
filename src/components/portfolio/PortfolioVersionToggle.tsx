import { Switch } from "@/components/ui/switch";
import { usePortfolioVersion } from "@/components/portfolio/portfolio-version";

export default function PortfolioVersionToggle() {
  const { version, setVersion } = usePortfolioVersion();

  const isReal = version === "real";

  return (
    <div className="fixed left-3 top-3 z-[60] flex items-center gap-1.5 rounded-full border border-border/40 bg-background/70 px-2.5 py-1.5 shadow-lg backdrop-blur sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-2">
      <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">Design</span>
      <Switch
        checked={isReal}
        onCheckedChange={(checked) => setVersion(checked ? "real" : "Design")}
        aria-label="Toggle portfolio version"
      />
      <span className="text-[11px] font-medium sm:text-xs">Real</span>
    </div>
  );
}

