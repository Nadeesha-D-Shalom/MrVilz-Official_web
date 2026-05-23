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
    profilePosition: "Founder, Presenter & Full-Stack Developer · AI Engineer",
    summary:
      "Founder of MrVilz and Software Engineering undergraduate — passionate about full-stack development, creative media, travel, and nature storytelling.",
    education: "Bachelor of Science (Hons) in Software Engineering — SLIIT, Malabe, Sri Lanka",
    email: "nadeeshashalom1@gmail.com",
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
    summary:
      "Co-host and Head of Creative Director at MrVilz — shaping visual direction and on-screen storytelling for campaigns.",
    tags: [
      { label: "Creative Direction", icon: Palette },
      { label: "Co-Host", icon: Mic2 },
      { label: "Visual Storytelling", icon: Film },
      { label: "On-Camera", icon: Video }
    ]
  },
  pabodha: {
    greetingName: "Pabodha",
    displayName: "T.M.Pabodha Nuwangi Thennakoon",
    summary:
      "I am a creative and active person with skills in dancing, content creation, teamwork, communication, and nature-based project activities. I am passionate about creative media work, environmental awareness, community projects, and presenting ideas in an attractive way.",
    education:
      "BSc (Hons) in Information Technology Specializing in Artificial Intelligence — SLIIT, Sri Lanka",
    email: "pthennakoon25@gmail.com",
    highlights: [
      "Creative Producer & Brand Partnerships at MrVilz",
      "Content creation, presentation & community-facing media",
      "Teamwork and communication on nature-based project activities",
      "Environmental awareness through creative campaigns"
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
    profilePosition: "Co-Founder & Head of Media Production · Videography & Photography",
    summary:
      "IT undergraduate passionate about videography and photography — capturing MrVilz campaigns, field moments, and conservation stories with a sharp eye for composition, light, and storytelling.",
    education: "BSc (Hons) in Information Technology — SLIIT, Sri Lanka",
    email: "Chamiduworks@gmail.com",
    highlights: [
      "Co-Founder & Head of Media Production at MrVilz",
      "Videography for cleanups, events, and campaign films",
      "Photography for portraits, field work, and social content",
      "Visual storytelling that supports environmental action"
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
      "Passionate contributor driving MrVilz impact across Sri Lanka.",
    education: extended?.education || null,
    email: extended?.email || null,
    socialLinks: extended?.socialLinks || [],
    highlights: extended?.highlights || [],
    tags: extended?.tags || []
  };
}
