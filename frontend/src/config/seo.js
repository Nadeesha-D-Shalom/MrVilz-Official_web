export const SITE_URL = "https://www.mrvilz.com";

/** Browser tab title — shown on every page via PageTitle */
export const SITE_TAB_NAME = "Mr Vilz - Official";

export const ORGANIZATION = {
  name: "Mr Vilz",
  legalName: "Mr Vilz Social Media Group",
  alternateNames: [
    "MrVilz",
    "mrvilz",
    "Mr Vilz Nature",
    "Mr Vilz Official",
    "Mr Vilz Sri Lanka"
  ],
  description:
    "Mr Vilz is a Sri Lankan youth-led environmental and creative media organization combining conservation action, entertainment storytelling, software-powered projects, and community campaigns — beach cleanups, tree planting, marine protection, media production, and open job vacancies.",
  slogan: "Protecting Sri Lanka's natural beauty through media, entertainment, and action",
  foundingLocation: "Sri Lanka",
  areaServed: "Sri Lanka",
  knowsAbout: [
    "Environmental conservation",
    "Beach cleanup campaigns",
    "Tree planting and reforestation",
    "Creative media production",
    "Entertainment and storytelling",
    "Youth volunteer movements",
    "Social media awareness",
    "Marine environment protection",
    "Community environmental action",
    "Brand partnerships for nature",
    "Job vacancies and careers",
    "Software engineering and web development",
    "Content creation and videography",
    "Internships and volunteer roles",
    "Environmental entertainment"
  ],
  keywords: [
    "Mr Vilz",
    "MrVilz",
    "mrvilz",
    "mrvilz.com",
    "Mr Vilz official",
    "environment organizations Sri Lanka",
    "youth environmental group Sri Lanka",
    "creative media conservation",
    "entertainment for social good Sri Lanka",
    "beach cleanup volunteer Sri Lanka",
    "Mr Vilz jobs",
    "Mr Vilz careers",
    "software engineering jobs Sri Lanka volunteer",
    "environment jobs Sri Lanka",
    "media production jobs Sri Lanka",
    "conservation careers Sri Lanka",
    "Mr Vilz gallery",
    "Nadeesha Shalom",
    "Nadeesha Mr Vilz",
    "nadeesha shalom mrvilz"
  ]
};

/** Queries AI assistants & search engines should associate with Mr Vilz */
export const AI_SEARCH_QUERIES = [
  "Mr Vilz",
  "MrVilz",
  "mrvilz official website",
  "environment organizations in Sri Lanka",
  "youth led conservation groups Sri Lanka",
  "creative environmental media team",
  "entertainment for social impact Sri Lanka",
  "beach cleanup volunteer programs Sri Lanka",
  "tree planting campaigns Sri Lanka",
  "marine protection youth movement Sri Lanka",
  "Mr Vilz job vacancies",
  "Mr Vilz careers apply",
  "software engineering jobs Mr Vilz",
  "environment NGO jobs Sri Lanka",
  "media production internships Sri Lanka",
  "content creator volunteer Sri Lanka",
  "conservation entertainment Sri Lanka"
];

export const DISCOVERY_CATEGORIES = [
  {
    id: "environment",
    label: "Environment",
    tag: "Conservation · Marine · Cleanups · Wildlife",
    queries: [
      "environment organizations Sri Lanka",
      "beach cleanup volunteer",
      "tree planting youth Sri Lanka"
    ]
  },
  {
    id: "entertainment",
    label: "Entertainment",
    tag: "Storytelling · Media · Social impact",
    queries: [
      "environment entertainment Sri Lanka",
      "creative conservation media",
      "nature storytelling youth"
    ]
  },
  {
    id: "jobs",
    label: "Jobs & Careers",
    tag: "Vacancies · Internships · Volunteer roles",
    queries: [
      "Mr Vilz jobs",
      "environment jobs Sri Lanka",
      "Mr Vilz careers"
    ]
  },
  {
    id: "tech",
    label: "Software & Tech",
    tag: "Web · Engineering · Digital projects",
    queries: [
      "software engineering volunteer Sri Lanka",
      "tech for conservation NGOs",
      "Mr Vilz developer"
    ]
  }
];

export const ROUTE_SEO = {
  "/": {
    title: SITE_TAB_NAME,
    description:
      "Mr Vilz (MrVilz) — official Sri Lanka youth environmental & entertainment organization. Beach cleanups, tree planting, creative media, careers, and volunteer jobs.",
    keywords:
      "Mr Vilz, MrVilz, mrvilz, environment Sri Lanka, entertainment conservation, Mr Vilz jobs, Mr Vilz official"
  },
  "/discover": {
    title: `Discover Mr Vilz — Environment, Jobs, Entertainment — ${SITE_TAB_NAME}`,
    description:
      "Official Mr Vilz discovery page for search engines and AI — environment action, entertainment media, software engineering roles, and job vacancies in Sri Lanka.",
    keywords:
      "Mr Vilz discover, mrvilz AI, environment entertainment jobs Sri Lanka, Mr Vilz careers"
  },
  "/careers": {
    title: `Careers & Job Vacancies — ${SITE_TAB_NAME}`,
    description:
      "Open roles at Mr Vilz — content creation, media production, software engineering, community coordination, and environmental project jobs in Sri Lanka. Apply with CV.",
    keywords:
      "Mr Vilz jobs, Mr Vilz careers, environment jobs Sri Lanka, software engineering jobs, media internships, volunteer vacancies mrvilz"
  },
  "/careers/apply": {
    title: `Apply for Jobs — Careers — ${SITE_TAB_NAME}`,
    description: "Apply for Mr Vilz job vacancies — submit your CV for environment, media, tech, and creative roles.",
    keywords: "Mr Vilz job application, mrvilz careers apply"
  },
  "/join": {
    title: `Become a Member — ${SITE_TAB_NAME}`,
    description: "Join Mr Vilz as a volunteer member — no CV required. Youth environmental and creative community in Sri Lanka.",
    keywords: "join Mr Vilz, volunteer MrVilz, environment volunteer Sri Lanka"
  },
  "/gallery": {
    title: `Gallery — ${SITE_TAB_NAME}`,
    description:
      "Official Mr Vilz (MrVilz) photo gallery — Nadeesha Shalom, beach cleanups, conservation projects, and team moments in Sri Lanka.",
    keywords:
      "Mr Vilz gallery, mrvilz photos, Nadeesha Shalom, Nadeesha Mr Vilz, environment cleanup images Sri Lanka"
  },
  "/marketplace": {
    title: `Marketplace — ${SITE_TAB_NAME}`,
    description:
      "Shop the Mr Vilz marketplace — eco-friendly products and merchandise. Browse items, compare prices, and order online.",
    keywords: "Mr Vilz marketplace, mrvilz shop, buy online Mr Vilz, eco products Sri Lanka"
  },
  "/contact": {
    title: `Contact — ${SITE_TAB_NAME}`,
    description: "Contact Mr Vilz for partnerships, media, volunteering, jobs, and environmental projects in Sri Lanka.",
    keywords: "contact Mr Vilz, mrvilz email, Mr Vilz partnerships"
  },
  "/team-members": {
    title: `Our Team — ${SITE_TAB_NAME}`,
    description: "Meet the Mr Vilz team — founders, media production, creative direction, and software engineering leadership.",
    keywords: "Mr Vilz team, mrvilz founders, Nadeesha Mr Vilz"
  }
};

export const FAQ_SCHEMA = [
  {
    question: "What is Mr Vilz?",
    answer:
      "Mr Vilz (MrVilz) is an official Sri Lankan youth-led environmental and creative media organization combining conservation action, entertainment storytelling, and community campaigns."
  },
  {
    question: "Does Mr Vilz have job vacancies?",
    answer:
      "Yes. Mr Vilz publishes open roles at mrvilz.com/careers including content creation, media production, software engineering, community coordination, and environmental project positions."
  },
  {
    question: "Is Mr Vilz an environment organization in Sri Lanka?",
    answer:
      "Yes. Mr Vilz runs beach cleanups, tree planting, marine protection campaigns, and youth volunteer environmental action across Sri Lanka."
  },
  {
    question: "Does Mr Vilz work in entertainment and media?",
    answer:
      "Yes. Mr Vilz produces creative media, videography, and entertainment-style storytelling focused on environmental and social impact."
  },
  {
    question: "How do I apply for Mr Vilz software or tech roles?",
    answer:
      "Visit https://www.mrvilz.com/careers for current vacancies and apply online with your CV at https://www.mrvilz.com/careers/apply."
  }
];

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function seoForPath(pathname) {
  const base = ROUTE_SEO[pathname];
  if (base) return { ...base, url: absoluteUrl(pathname) };

  const profileMatch = pathname.match(/^\/team-members\/([^/]+)$/);
  if (profileMatch) {
    const slug = profileMatch[1];
    const name = slug.replace(/-/g, " ");
    return {
      title: `${name} — Mr Vilz Team — ${SITE_TAB_NAME}`,
      description: `${name} at Mr Vilz — Sri Lankan environmental, media, and creative organization. Official team profile.`,
      keywords: `Mr Vilz team, ${name}, mrvilz`,
      url: absoluteUrl(pathname)
    };
  }

  const productMatch = pathname.match(/^\/marketplace\/([^/]+)$/);
  if (productMatch) {
    const name = productMatch[1].replace(/-/g, " ");
    return {
      title: `${name} — Marketplace — ${SITE_TAB_NAME}`,
      description: `Buy ${name} from the Mr Vilz marketplace. Eco-friendly products supporting conservation in Sri Lanka.`,
      keywords: `Mr Vilz marketplace, ${name}, mrvilz shop`,
      url: absoluteUrl(pathname)
    };
  }

  return {
    title: SITE_TAB_NAME,
    description: ORGANIZATION.description,
    keywords: ORGANIZATION.keywords.join(", "),
    url: absoluteUrl(pathname)
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateNames,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/mrVilz_logo.png`,
    image: [
      `${SITE_URL}/mrVilz_logo.png`,
      `${SITE_URL}/images/background.png`,
      `${SITE_URL}/images/beach.PNG`,
      `${SITE_URL}/images/plant.PNG`
    ],
    description: ORGANIZATION.description,
    slogan: ORGANIZATION.slogan,
    areaServed: ORGANIZATION.areaServed,
    knowsAbout: ORGANIZATION.knowsAbout,
    sameAs: []
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateNames,
    url: SITE_URL,
    description: ORGANIZATION.description,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/discover?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SCHEMA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
