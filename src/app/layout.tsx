import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/site-shell";

const SITE_URL = "https://www.brightlightimmigration.ca";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Top Immigration Consultant in Canada – Bright Light",
    template: "%s | Brightlight Immigration",
  },
  description:
    "Looking for the top immigration consultant in Canada? Bright Light Immigration offers expert guidance for study, work, and PR visas. Trusted support every step.",
  keywords: [
    "Canadian immigration consultant",
    "immigration consultant Surrey BC",
    "Express Entry Canada",
    "BCPNP consultant",
    "study visa Canada",
    "work permit Canada",
    "spousal sponsorship Canada",
    "PR Canada",
    "visa refusal help",
    "RCIC consultant",
    "Brightlight Immigration",
  ],
  authors: [{ name: "Brightlight Immigration", url: SITE_URL }],
  creator: "Brightlight Immigration",
  publisher: "Brightlight Immigration",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "Brightlight Immigration",
    locale: "en_CA",
    url: SITE_URL,
    title: "Brightlight Immigration | Expert Canadian Immigration Consultants",
    description:
      "Trusted RCIC-licensed immigration consultants in Surrey, BC. We simplify Express Entry, BCPNP, visas, work permits & refusal cases.",
    images: [{ url: "/images/ogImage.png", width: 1200, height: 630, alt: "Brightlight Immigration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brightlight Immigration | Expert Canadian Immigration Consultants",
    description: "Trusted RCIC-licensed immigration consultants in Surrey, BC. Simplifying Express Entry, BCPNP, visas & more.",
    images: ["/images/ogImage.png"],
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Brightlight Immigration",
      alternateName: "Bright Light Immigration Inc.",
      url: SITE_URL,
      description:
        "RCIC-licensed Canadian immigration consultants specializing in Express Entry, BCPNP, work permits, study visas, family sponsorship, and overcoming refusals.",
      telephone: "+16045033734",
      email: "info@brightlightimmigration.ca",
      address: {
        "@type": "PostalAddress",
        streetAddress: "15315 66 Ave unit 327",
        addressLocality: "Surrey",
        addressRegion: "BC",
        postalCode: "V3S 2A1",
        addressCountry: "CA",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
      priceRange: "$$",
      areaServed: [
        { "@type": "Country", name: "Canada" },
        { "@type": "City", name: "Surrey" },
        { "@type": "City", name: "Vancouver" },
      ],
      sameAs: [
        "https://ca.linkedin.com/in/loveneet-paneswar-5b2377198",
        "https://www.facebook.com/brightlightimmigration",
        "https://www.instagram.com/brightlightimmigration",
        "https://www.youtube.com/channel/UC2NJoKhIOconAE_IFCxX7uA",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        ratingCount: "200",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Brightlight Immigration",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blogs?search={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#consultant`,
      name: "Loveneet Paneswar",
      jobTitle: "Regulated Canadian Immigration Consultant (RCIC)",
      identifier: "R522969",
      worksFor: { "@id": `${SITE_URL}/#business` },
      sameAs: ["https://ca.linkedin.com/in/loveneet-paneswar-5b2377198"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
