import { createContext, useContext } from "react";
import useSiteData from "../hooks/useSiteData";

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const site = useSiteData();
  return <SiteDataContext.Provider value={site}>{children}</SiteDataContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSite must be used within SiteDataProvider");
  }
  return context;
}
