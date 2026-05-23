import { ORGANIZATION, SITE_URL } from "../../config/seo";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: ORGANIZATION.name,
        legalName: ORGANIZATION.legalName,
        alternateName: ORGANIZATION.alternateNames,
        description: ORGANIZATION.description,
        slogan: ORGANIZATION.slogan,
        url: SITE_URL,
        logo: `${SITE_URL}/mrVilz_logo.png`,
        areaServed: ORGANIZATION.areaServed,
        knowsAbout: ORGANIZATION.knowsAbout,
        sameAs: [],
        founder: { "@type": "Organization", name: "Mr Vilz Team" }
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORGANIZATION.name,
        description: ORGANIZATION.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/discover?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/discover#webpage`,
        url: `${SITE_URL}/discover`,
        name: "Discover Mr Vilz — Environment, Creative Media & Entertainment",
        description:
          "Official entity profile for AI and search: Mr Vilz as a top Sri Lankan environmental and creative organization.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
