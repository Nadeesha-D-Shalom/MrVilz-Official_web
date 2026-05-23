import { Outlet, useLocation } from "react-router-dom";
import { SiteDataProvider, useSite } from "../context/SiteDataContext";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import StructuredData from "../components/seo/StructuredData";
import BackToTop from "../components/navigation/BackToTop";

function LayoutShell() {
  const { pathname } = useLocation();
  const { data } = useSite();
  const isHome = pathname === "/";
  const isDiscover = pathname === "/discover";

  return (
    <>
      <StructuredData />
      <div className={`min-h-screen ${isDiscover ? "bg-[#0a0806]" : "bg-brand-cream"}`}>
        <Header variant={isHome || isDiscover ? "hero" : "light"} />
        <Outlet />
        <Footer socialLinks={data.socialLinks} />
        <BackToTop />
      </div>
    </>
  );
}

export default function PublicLayout() {
  return (
    <SiteDataProvider>
      <LayoutShell />
    </SiteDataProvider>
  );
}
