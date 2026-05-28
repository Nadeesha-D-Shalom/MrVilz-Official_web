const defaultHero = {
  eyebrow: "Protecting Sri Lanka's marine future",
  title: "Mr Vilz",
  subtitle: "We are striving to protect the marine environment of Sri Lanka.",
  primaryAction: { label: "Be Involved", href: "#projects" },
  secondaryAction: { label: "Contact", href: "/contact" },
  mediaType: "image",
  mediaUrl: "/images/background.png",
  mediaAlt: "Mr Vilz hero background"
};

const defaultAbout = {
  title: "What Mr Vilz Does",
  paragraphs: [
    "Mr Vilz is a Sri Lankan youth-led environmental and creative media organization combining conservation action, entertainment storytelling, and community campaigns across beaches, forests, and wildlife protection.",
    "We believe small actions can create a big change. Through our projects and social media, we inspire people to protect Sri Lanka's beaches, forests, wildlife, and natural beauty.",
    "Our team consists of passionate individuals and volunteers who are committed to making a positive impact on nature and society.",
    "Would you like to be a part of making Sri Lanka cleaner, greener, and more beautiful?"
  ]
};

const defaultCareersPage = {
  title: "Careers at Mr Vilz",
  intro:
    "Join a youth-led movement protecting Sri Lanka's beaches, forests, and wildlife through media, community action, and environmental projects."
};

const defaultStats = [
  { stat_key: "volunteers", label: "Volunteers", value: 120, suffix: "+", sort_order: 1 },
  { stat_key: "cleanups", label: "Beach Cleanups", value: 24, suffix: "", sort_order: 2 },
  { stat_key: "trees", label: "Trees Planted", value: 8500, suffix: "+", sort_order: 3 },
  { stat_key: "followers", label: "Community Reach", value: 50000, suffix: "+", sort_order: 4 }
];

const defaultSocialLinks = [
  { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/", icon: "facebook", sort_order: 1 },
  { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/", icon: "instagram", sort_order: 2 },
  { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/", icon: "youtube", sort_order: 3 },
  { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/", icon: "tiktok", sort_order: 4 }
];

const defaultTeam = [
  {
    name: "Nadeesha D Shalom",
    slug: "nadeesha",
    position: "Founder, Presenter & Full-Stack Developer",
    bio: "Founder of Mr Vilz and BSc (Hons) Software Engineering undergraduate at SLIIT — full-stack development, AI engineering, travel media, and nature storytelling for conservation campaigns across Sri Lanka.",
    image_url: "/images/nadeesha1.JPG",
    sort_order: 1,
    is_leadership: 1
  },
  {
    name: "Chamidu",
    slug: "chamidu",
    position: "Co-Founder & Head of Media Production",
    bio: "Co-Founder and Head of Media Production at Mr Vilz — videography and photography for beach cleanups, events, field work, and conservation storytelling across Sri Lanka.",
    image_url: "/images/chamidu.jpeg",
    sort_order: 2,
    is_leadership: 1
  },
  {
    name: "Pabodha Nuwangi",
    slug: "pabodha",
    position: "Creative Producer & Brand Partnerships",
    bio: "Creative Producer and Brand Partnerships lead at Mr Vilz — AI-focused IT undergraduate driving content creation, brand partnerships, and environmental campaigns with strong community engagement.",
    image_url: "/images/paboda.jpeg",
    sort_order: 3,
    is_leadership: 1
  },
  {
    name: "Nethmina",
    slug: "nethmina",
    position: "Co-Host & Head of Creative Director",
    bio: "Shapes creative direction and co-hosts Mr Vilz content with a focus on bold visual storytelling and audience engagement.",
    image_url: "/images/nethmina.JPG",
    sort_order: 4,
    is_leadership: 1
  }
];

const defaultProjects = [
  {
    title: "Clean Panadura Beach Sri Lanka",
    summary:
      "A coastal cleanup effort focused on reducing waste, protecting the shoreline, and building stronger community action around a cleaner beach environment.",
    progress: 46,
    image_url: "/images/beach.PNG",
    visual_layout: "landscape",
    highlights: ["Beach cleanup", "Volunteer action", "Coastal protection"],
    sort_order: 1
  },
  {
    title: "Plants Donation Campaign",
    summary:
      "A greening campaign that encourages communities to plant, nurture, and protect young trees for a healthier and cleaner future.",
    progress: 2,
    image_url: "/images/plant.PNG",
    visual_layout: "portrait",
    highlights: ["Plant today", "Nurture growth", "Protect nature"],
    sort_order: 2
  }
];

const defaultCareerPosts = [
  {
    title: "Content Creator",
    role_type: "Volunteer / Part-time",
    description: "Create photo and video content for campaigns and social platforms.",
    is_published: 1,
    sort_order: 0
  },
  {
    title: "Community Coordinator",
    role_type: "Volunteer",
    description: "Organize cleanups, tree planting, and local outreach events.",
    is_published: 1,
    sort_order: 1
  },
  {
    title: "Media Production Assistant",
    role_type: "Internship",
    description: "Support filming, editing, and publishing for Mr Vilz channels.",
    is_published: 1,
    sort_order: 2
  }
];

const defaultGallery = [
  { title: "Beach Cleanup", caption: "Panadura shoreline action", image_url: "/images/beach.PNG", category: "projects", sort_order: 1 },
  { title: "Tree Planting", caption: "Greening our communities", image_url: "/images/plant.PNG", category: "projects", sort_order: 2 },
  { title: "Team Moment", caption: "Behind the scenes", image_url: "/images/nadeesha1.JPG", category: "team", sort_order: 3 },
  { title: "On Location", caption: "Field production", image_url: "/images/chamidu.jpeg", category: "media", sort_order: 4 }
];

module.exports = {
  defaultHero,
  defaultAbout,
  defaultCareersPage,
  defaultStats,
  defaultSocialLinks,
  defaultTeam,
  defaultProjects,
  defaultCareerPosts,
  defaultGallery
};
