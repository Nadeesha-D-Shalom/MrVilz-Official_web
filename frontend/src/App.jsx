import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollRestoration from "./components/navigation/ScrollRestoration";
import PageTitle from "./components/seo/PageTitle";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminRoute from "./components/admin/SuperAdminRoute";
import DashboardPage from "./pages/admin/DashboardPage";
import StatsPage from "./pages/admin/StatsPage";
import SocialPage from "./pages/admin/SocialPage";
import TeamPage from "./pages/admin/TeamPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import MessagesPage from "./pages/admin/MessagesPage";
import ApplicationsPage from "./pages/admin/ApplicationsPage";
import JobApplicationsPage from "./pages/admin/JobApplicationsPage";
import GalleryAdminPage from "./pages/admin/GalleryAdminPage";
import AdminsPage from "./pages/admin/AdminsPage";
import ProfilePage from "./pages/admin/ProfilePage";
import AdminCareersPage from "./pages/admin/CareersPage";

const CareersPage = lazy(() => import("./pages/public/CareersPage"));
const CareerApplyPage = lazy(() => import("./pages/public/CareerApplyPage"));
const JoinTeamPage = lazy(() => import("./pages/public/JoinTeamPage"));
const GalleryPage = lazy(() => import("./pages/public/GalleryPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));
const DiscoverPage = lazy(() => import("./pages/public/DiscoverPage"));
const TeamMembersPage = lazy(() => import("./pages/public/TeamMembersPage"));
const TeamMemberProfilePage = lazy(() => import("./pages/public/TeamMemberProfilePage"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full bg-brand-parchment" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTitle />
        <ScrollRestoration />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/careers"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CareersPage />
                </Suspense>
              }
            />
            <Route
              path="/careers/apply"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CareerApplyPage />
                </Suspense>
              }
            />
            <Route
              path="/join"
              element={
                <Suspense fallback={<PageLoader />}>
                  <JoinTeamPage />
                </Suspense>
              }
            />
            <Route
              path="/gallery"
              element={
                <Suspense fallback={<PageLoader />}>
                  <GalleryPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="/discover"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DiscoverPage />
                </Suspense>
              }
            />
            <Route
              path="/team-members/:slug"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TeamMemberProfilePage />
                </Suspense>
              }
            />
            <Route
              path="/team-members"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TeamMembersPage />
                </Suspense>
              }
            />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="job-applications" element={<JobApplicationsPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="careers" element={<AdminCareersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="admins"
              element={
                <SuperAdminRoute>
                  <AdminsPage />
                </SuperAdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
