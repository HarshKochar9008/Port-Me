import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PortfolioVersion = "Design" | "real";

type PortfolioVersionContextValue = {
  version: PortfolioVersion;
  setVersion: (v: PortfolioVersion) => void;
  toggleVersion: () => void;
};

const PortfolioVersionContext = createContext<PortfolioVersionContextValue | null>(null);

const STORAGE_KEY = "portfolio_version";

export function PortfolioVersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersionState] = useState<PortfolioVersion>("Design");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "Design" || saved === "real") setVersionState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setVersion = (v: PortfolioVersion) => {
    setVersionState(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // ignore
    }
  };

  const value = useMemo<PortfolioVersionContextValue>(
    () => ({
      version,
      setVersion,
      toggleVersion: () => setVersion(version === "real" ? "Design" : "real"),
    }),
    [version]
  );

  return (
    <PortfolioVersionContext.Provider value={value}>
      {children}
    </PortfolioVersionContext.Provider>
  );
}

export function usePortfolioVersion() {
  const ctx = useContext(PortfolioVersionContext);
  if (!ctx) throw new Error("usePortfolioVersion must be used within PortfolioVersionProvider");
  return ctx;
}

