import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_TAB_NAME } from "../../config/seo";
import { TEAM_PROFILES } from "../../config/teamProfiles";

const DEFAULT_TITLE = SITE_TAB_NAME;

const ROUTE_TITLES = {
  "/": DEFAULT_TITLE,
  "/gallery": `Gallery — ${SITE_TAB_NAME}`,
  "/careers": `Careers — ${SITE_TAB_NAME}`,
  "/careers/apply": `Apply — Careers — ${SITE_TAB_NAME}`,
  "/join": `Become a Member — ${SITE_TAB_NAME}`,
  "/contact": `Contact — ${SITE_TAB_NAME}`,
  "/discover": `AI Discover — ${SITE_TAB_NAME}`,
  "/team-members": `Our Team Members — ${SITE_TAB_NAME}`,
  "/admin/login": `Admin Sign In — ${SITE_TAB_NAME}`,
  "/admin": `Admin Dashboard — ${SITE_TAB_NAME}`,
  "/admin/stats": `Stats — Admin — ${SITE_TAB_NAME}`,
  "/admin/social": `Social Links — Admin — ${SITE_TAB_NAME}`,
  "/admin/team": `Team — Admin — ${SITE_TAB_NAME}`,
  "/admin/projects": `Projects — Admin — ${SITE_TAB_NAME}`,
  "/admin/messages": `Messages — Admin — ${SITE_TAB_NAME}`,
  "/admin/applications": `Applications — Admin — ${SITE_TAB_NAME}`,
  "/admin/job-applications": `Job Applications — Admin — ${SITE_TAB_NAME}`,
  "/admin/gallery": `Gallery — Admin — ${SITE_TAB_NAME}`,
  "/admin/careers": `Career Posts — Admin — ${SITE_TAB_NAME}`,
  "/admin/admins": `Admin Users — Admin — ${SITE_TAB_NAME}`
};

function titleForPath(pathname) {
  const profileMatch = pathname.match(/^\/team-members\/([^/]+)$/);
  if (profileMatch) {
    const slug = profileMatch[1];
    const profile = TEAM_PROFILES[slug];
    const name = profile?.greetingName || slug.replace(/-/g, " ");
    return `${name} — Our Team — ${SITE_TAB_NAME}`;
  }
  return ROUTE_TITLES[pathname] || DEFAULT_TITLE;
}

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleForPath(pathname);
  }, [pathname]);

  return null;
}
