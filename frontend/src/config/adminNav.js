import {
  LayoutDashboard,
  BarChart3,
  Share2,
  Users,
  FolderKanban,
  Mail,
  UserPlus,
  Briefcase,
  Images,
  Shield,
  ExternalLink,
  LogOut,
  Menu,
  X
} from "lucide-react";

export const ADMIN_NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    collapsible: false,
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }]
  },
  {
    id: "website",
    label: "Website content",
    collapsible: true,
    defaultOpen: true,
    items: [
      { to: "/admin/stats", label: "Stats", icon: BarChart3 },
      { to: "/admin/social", label: "Social links", icon: Share2 },
      { to: "/admin/projects", label: "Projects", icon: FolderKanban },
      { to: "/admin/gallery", label: "Gallery", icon: Images },
      { to: "/admin/careers", label: "Career posts", icon: Briefcase }
    ]
  },
  {
    id: "people",
    label: "People & inbox",
    collapsible: true,
    items: [
      { to: "/admin/team", label: "Team", icon: Users },
      { to: "/admin/messages", label: "Messages", icon: Mail }
    ]
  },
  {
    id: "applications",
    label: "Applications",
    collapsible: true,
    items: [
      { to: "/admin/applications", label: "Member apps", icon: UserPlus },
      { to: "/admin/job-applications", label: "Job apps", icon: Briefcase }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    collapsible: true,
    items: [{ to: "/admin/admins", label: "Admin users", icon: Shield }]
  }
];

export const ADMIN_DASHBOARD_GROUPS = [
  {
    label: "Website",
    items: [
      {
        to: "/admin/stats",
        title: "Impact stats",
        desc: "Counters shown on the homepage",
        icon: BarChart3,
        accent: "bg-sky-500/10 text-sky-700"
      },
      {
        to: "/admin/social",
        title: "Social links",
        desc: "Facebook, Instagram, YouTube, TikTok",
        icon: Share2,
        accent: "bg-violet-500/10 text-violet-700"
      },
      {
        to: "/admin/projects",
        title: "Projects",
        desc: "Campaigns and progress updates",
        icon: FolderKanban,
        accent: "bg-emerald-500/10 text-emerald-700"
      },
      {
        to: "/admin/gallery",
        title: "Gallery",
        desc: "Upload, edit, and manage gallery photos",
        icon: Images,
        accent: "bg-rose-500/10 text-rose-700"
      },
      {
        to: "/admin/careers",
        title: "Career posts",
        desc: "Add, edit, publish, or hide job posts",
        icon: Briefcase,
        accent: "bg-teal-500/10 text-teal-700"
      }
    ]
  },
  {
    label: "Community",
    items: [
      {
        to: "/admin/team",
        title: "Team profiles",
        desc: "Members, roles, and photos",
        icon: Users,
        accent: "bg-brand-red/10 text-brand-red"
      },
      {
        to: "/admin/messages",
        title: "Contact messages",
        desc: "Inbox from the contact form",
        icon: Mail,
        accent: "bg-slate-500/10 text-slate-700"
      }
    ]
  },
  {
    label: "Applications",
    items: [
      {
        to: "/admin/applications",
        title: "Become a member",
        desc: "Personal details only (no CV)",
        icon: UserPlus,
        accent: "bg-orange-500/10 text-orange-700"
      },
      {
        to: "/admin/job-applications",
        title: "Job applications",
        desc: "Careers with CV and LinkedIn",
        icon: Briefcase,
        accent: "bg-indigo-500/10 text-indigo-700"
      }
    ]
  },
  {
    label: "Settings",
    items: [
      {
        to: "/admin/admins",
        title: "Admin users",
        desc: "Add staff logins with contact details",
        icon: Shield,
        accent: "bg-slate-800/10 text-slate-800"
      }
    ]
  }
];

export { ExternalLink, LogOut, Menu, X };
