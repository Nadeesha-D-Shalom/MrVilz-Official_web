import {
  Camera,
  Code2,
  Film,
  Globe2,
  Handshake,
  Leaf,
  Mic2,
  Palette,
  Sparkles,
  TreePine,
  Users,
  Video,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Globe
} from "lucide-react";

/**
 * Extended profile content keyed by team member slug.
 * Basic name/role/photo come from the API; this adds the advanced profile layout.
 */
export const TEAM_PROFILES = {
  nadeesha: {
    greetingName: "Nadeesha",
    displayName: "Nadeesha D Shalom",
    cardPosition: "Founder & Presenter",
    profilePosition: "Founder, Presenter & Full-Stack Developer · AI Engineer",
    photoObjectPosition: "center 8%",
    photoScale: 1.45,
    cardSummary:
      "Founder of Mr Vilz — building this platform, leading campaigns, and telling conservation stories through code and camera.",
    summary:
      "Founder of Mr Vilz and BSc (Hons) Software Engineering undergraduate at SLIIT — full-stack development, AI engineering, travel media, and nature storytelling for conservation campaigns across Sri Lanka.",
    education: "BSc (Hons) in Software Engineering — SLIIT, Malabe, Sri Lanka",
    email: "nadeeshashalom1@gmail.com",
    detailsExtras: [
      { label: "Organization", value: "Mr Vilz — Founder & Presenter" },
      {
        label: "Focus",
        value:
          "Full-stack web development, AI tools, environmental media, travel storytelling, and youth-led conservation action"
      },
      {
        label: "Skills",
        value:
          "React, Node.js, APIs, UI/UX, content creation, presenting, project leadership, and digital campaign strategy"
      },
      {
        label: "Interests",
        value: "Marine protection, beach cleanups, tree planting, travel, wildlife, and creative technology"
      }
    ],
    about: [
      "I am Nadeesha D Shalom, Founder and Presenter of Mr Vilz — a Sri Lankan youth-led movement combining environmental action, entertainment, and creative media. I lead the organization’s vision to protect nature while engaging communities through storytelling, technology, and on-screen presence.",
      "As a Software Engineering undergraduate at SLIIT, I design and build the Mr Vilz website and digital tools end to end — from backend APIs and admin systems to public-facing experiences optimized for search, accessibility, and campaign impact. I apply AI where it helps teams work faster and reach more people with conservation messages.",
      "On camera, I present Mr Vilz journeys — travel, field work, cleanups, and planting projects — with a focus on authentic narrative and cinematic quality. I collaborate with our media, creative, and coordination leads to turn field moments into campaigns that inspire volunteers, partners, and the next generation of environmental advocates in Sri Lanka."
    ],
    highlights: [
      "Founder & Presenter — leads Mr Vilz strategy, media, and technology",
      "Built and maintains the Mr Vilz official website and admin platform",
      "Full-stack development and AI engineering for conservation digital projects",
      "On-screen travel and nature storytelling for cleanups, planting, and campaigns",
      "Partners with team leads on beach cleanups, tree planting, and community outreach"
    ],
    socialLinks: [
      { label: "Facebook", url: "https://web.facebook.com/nadeesha.d.shalom/", icon: Facebook },
      { label: "Instagram", url: "https://www.instagram.com/nadeesha_d_shalom", icon: Instagram },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/nadeesha-shalom-a5a2a4251",
        icon: Linkedin
      },
      { label: "GitHub", url: "https://github.com/Nadeesha-D-Shalom", icon: Github },
      {
        label: "Portfolio",
        url: "https://nadeesha-d-shalom.github.io/Nadeesha_UI.github.io/",
        icon: Globe
      }
    ],
    tags: [
      { label: "Full-Stack Dev", icon: Code2 },
      { label: "Content Creation", icon: Video },
      { label: "Nature Storytelling", icon: Leaf },
      { label: "Travel Media", icon: Globe2 },
      { label: "Hi there!", icon: Sparkles },
      { label: "Digital Innovation", icon: Camera }
    ]
  },
  nethmina: {
    greetingName: "Nethmina",
    photoObjectPosition: "center 20%",
    summary:
      "Co-host and Head of Creative Director at Mr Vilz — shapes visual direction and on-screen storytelling for campaigns. Head of planting project coordination and co-hosts Mr Vilz content with bold visual storytelling and audience engagement.",
    education:
      "BSc (Hons) in Information Technology Specializing in Computer Systems and Network Engineering — SLIIT, Sri Lanka",
    highlights: [
      "Visual direction and on-screen storytelling for campaigns",
      "Head of coordination for Mr Vilz planting projects",
      "Bold visual storytelling and audience engagement as co-host",
      "BSc (Hons) IT — Computer Systems & Network Engineering (SLIIT)"
    ],
    tags: [
      { label: "Creative Direction", icon: Palette },
      { label: "Co-Host", icon: Mic2 },
      { label: "Planting Projects", icon: TreePine },
      { label: "Visual Storytelling", icon: Film },
      { label: "On-Camera", icon: Video }
    ]
  },
  pabodha: {
    greetingName: "Pabodha",
    displayName: "T.M.Pabodha Nuwangi Thennakoon",
    photoObjectPosition: "center 22%",
    cardPosition: "Creative Producer & Brand Partnerships",
    profilePosition: "Creative Producer & Brand Partnerships · AI & Media",
    summary:
      "Creative Producer and Brand Partnerships lead at Mr Vilz — BSc (Hons) IT undergraduate specializing in Artificial Intelligence at SLIIT. Drives content creation, on-camera presentation, brand partnerships, and environmental campaigns with strong teamwork and community engagement.",
    education:
      "BSc (Hons) in Information Technology Specializing in Artificial Intelligence — SLIIT, Sri Lanka",
    email: "pthennakoon25@gmail.com",
    highlights: [
      "Creative Producer & Brand Partnerships at Mr Vilz",
      "AI-focused media, content creation, and on-camera presentation",
      "Brand partnerships and community-facing environmental campaigns",
      "Nature-based projects, teamwork, and creative storytelling"
    ],
    tags: [
      { label: "Content Creation", icon: Video },
      { label: "AI & Technology", icon: Sparkles },
      { label: "Brand Partnerships", icon: Handshake },
      { label: "Nature Projects", icon: Leaf },
      { label: "Teamwork", icon: Users },
      { label: "Creative Media", icon: Film }
    ]
  },
  chamidu: {
    greetingName: "Chamidu",
    displayName: "Chamidu Prabodya",
    photoObjectPosition: "center 18%",
    cardPosition: "Co-Founder & Media Production",
    profilePosition: "Co-Founder & Head of Media Production · Videography & Photography",
    summary:
      "Co-Founder and Head of Media Production at Mr Vilz — BSc (Hons) IT undergraduate at SLIIT capturing videography and photography for beach cleanups, events, field work, and conservation storytelling across Sri Lanka.",
    education: "BSc (Hons) in Information Technology — SLIIT, Sri Lanka",
    email: "Chamiduworks@gmail.com",
    highlights: [
      "Co-Founder & Head of Media Production at Mr Vilz",
      "Videography for cleanups, events, and campaign films",
      "Photography for portraits, field work, and social content",
      "Visual storytelling that supports environmental action in Sri Lanka"
    ],
    tags: [
      { label: "Videography", icon: Video },
      { label: "Photography", icon: Camera },
      { label: "Media Production", icon: Film },
      { label: "Field Shoots", icon: Globe2 },
      { label: "Co-Founder", icon: Sparkles },
      { label: "Conservation", icon: TreePine }
    ]
  }
};

export function getTeamProfile(slug) {
  return TEAM_PROFILES[slug] || null;
}

export function mergeTeamProfile(member) {
  if (!member) return null;
  const slug = member.slug || member.name?.toLowerCase().split(/\s+/)[0];
  const extended = getTeamProfile(slug);
  const firstName = member.name?.split(" ")[0] || member.name;

  return {
    ...member,
    name: extended?.displayName || member.name,
    greetingName: extended?.greetingName || firstName,
    position: extended?.profilePosition || member.position,
    summary:
      extended?.summary ||
      member.bio ||
      "Passionate contributor driving Mr Vilz impact across Sri Lanka.",
    cardSummary: extended?.cardSummary || extended?.summary || member.bio || null,
    about: extended?.about || null,
    detailsExtras: extended?.detailsExtras || [],
    photoObjectPosition: extended?.photoObjectPosition || "center 25%",
    photoScale: extended?.photoScale || 1,
    education: extended?.education || null,
    email: extended?.email || null,
    socialLinks: extended?.socialLinks || [],
    highlights: extended?.highlights || [],
    tags: extended?.tags || []
  };
}
