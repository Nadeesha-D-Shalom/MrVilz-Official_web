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
      "Founder of Mr Vilz — a youth-driven digital and creative brand uniting leadership, creativity, technology, and positive social impact.",
    summary:
      "Nadeesha D Shalom founded Mr Vilz to combine leadership, creativity, technology, and social impact — driving digital creativity, media storytelling, web technologies, and community-centered initiatives across Sri Lanka.",
    education: "BSc (Hons) in Software Engineering — SLIIT, Malabe, Sri Lanka",
    email: "nadeeshashalom1@gmail.com",
    detailsExtras: [
      { label: "Organization", value: "Mr Vilz — Founder & Presenter (Nadeesha D Shalom)" },
      {
        label: "Brand focus",
        value:
          "Digital creativity, media storytelling, web technologies, software-powered solutions, and community-centered initiatives"
      },
      {
        label: "Core values",
        value:
          "Leadership, originality, teamwork, environmental responsibility, and continuous growth"
      },
      {
        label: "Mission",
        value:
          "Empower young talent, encourage creativity, and transform ideas into meaningful digital experiences with lasting impact"
      }
    ],
    about: [
      "I am Nadeesha D Shalom, Founder of Mr Vilz — a modern youth-driven digital and creative brand built with a vision of combining leadership, creativity, technology, and positive social impact into one powerful platform.",
      "Driven by innovation and purpose, Mr Vilz focuses on digital creativity, media storytelling, web technologies, software-powered solutions, and community-centered initiatives that inspire the next generation. The brand represents more than content creation — it reflects leadership, originality, teamwork, environmental responsibility, and continuous growth.",
      "Under my leadership, Mr Vilz continues to grow as a platform that encourages creativity, empowers young talent, and transforms ideas into meaningful digital experiences. From creative media productions and branding to technology-driven projects and awareness campaigns, Mr Vilz aims to create a lasting impact through innovation and visionary thinking.",
      "With a strong passion for leadership and creative excellence, I lead Mr Vilz as a symbol of ambition, innovation, and purpose-driven digital transformation — building experiences that matter for communities, partners, and the next generation in Sri Lanka."
    ],
    highlights: [
      "Founded Mr Vilz — youth-driven digital and creative brand",
      "Unites leadership, creativity, technology, and positive social impact",
      "Digital creativity, media storytelling, web tech, and software-powered solutions",
      "Creative media, branding, technology projects, and awareness campaigns",
      "Environmental responsibility, teamwork, and empowering young talent"
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
