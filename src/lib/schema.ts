// Schema.org structured data utilities for SEO and AI search
// Multi-product authority site — supports per-product schemas

import { SITE_URL, SITE_NAME, siteConfig } from './config';
import type { Product } from './config';

export { SITE_URL, SITE_NAME };

export const DEFAULT_DATE_MODIFIED = siteConfig.seo.dateModified;

export interface EntityRef {
  name: string;
  url: string;
  type?: string;
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  mentions?: EntityRef[];
  about?: EntityRef[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Generate Article schema
export function generateArticleSchema({
  title,
  description,
  url,
  datePublished = siteConfig.seo.datePublished,
  dateModified = DEFAULT_DATE_MODIFIED,
  image = `${SITE_URL}${siteConfig.seo.defaultOgImage}`,
  mentions,
  about,
}: ArticleSchemaProps) {
  return {
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${siteConfig.seo.defaultOgImage}`,
      },
    },
    datePublished,
    dateModified,
    image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(mentions && mentions.length > 0 && {
      mentions: mentions.map(m => ({
        "@type": m.type || "Thing",
        name: m.name,
        sameAs: m.url,
      })),
    }),
    ...(about && about.length > 0 && {
      about: about.map(a => ({
        "@type": a.type || "Thing",
        name: a.name,
        sameAs: a.url,
      })),
    }),
  };
}

// Generate FAQ schema
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate Breadcrumb schema
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate HowTo schema
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

// Generate Product schema for a specific product
export function generateProductSchema(product?: Product) {
  if (!product) {
    return {
      "@type": "Product",
      name: SITE_NAME,
      description: siteConfig.productDescription,
      brand: { "@type": "Brand", name: SITE_NAME },
      image: `${SITE_URL}${siteConfig.seo.defaultOgImage}`,
      offers: {
        "@type": "Offer",
        url: SITE_URL,
        priceCurrency: 'USD',
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: siteConfig.socialProof.rating,
        reviewCount: siteConfig.socialProof.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    };
  }

  return {
    "@type": "Product",
    name: product.name,
    description: product.verdict,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: `${SITE_URL}${siteConfig.seo.defaultOgImage}`,
    sameAs: `https://www.amazon.com/dp/${product.asin}`,
    offers: {
      "@type": "Offer",
      url: `https://www.amazon.com/dp/${product.asin}?tag=${siteConfig.affiliateTag}`,
      price: product.price,
      priceCurrency: 'USD',
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Amazon",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// Generate ItemList schema for roundup/list pages
export function generateItemListSchema(items: Array<{ name: string; url: string; position?: number }>) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

// Generate Organization schema
export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${siteConfig.seo.defaultOgImage}`,
    sameAs: [],
  };
}

// Generate WebSite schema
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

// Generate Activity schema
export function generateActivitySchema(activityName: string) {
  return {
    "@type": "SportsActivityLocation",
    name: activityName,
    description: `${siteConfig.niche.charAt(0).toUpperCase() + siteConfig.niche.slice(1)} solutions for ${activityName.toLowerCase()}.`,
  };
}

// Combine multiple schemas into a @graph
export function combineSchemas(...schemas: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

// Helper to create full page schema
export function createPageSchema({
  title,
  description,
  url,
  faqs,
  breadcrumbs,
  product,
  includeProduct = false,
  datePublished,
  dateModified,
  mentions,
  about,
}: {
  title: string;
  description: string;
  url: string;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  product?: Product;
  includeProduct?: boolean;
  datePublished?: string;
  dateModified?: string;
  mentions?: EntityRef[];
  about?: EntityRef[];
}) {
  const schemas: object[] = [
    generateArticleSchema({
      title,
      description,
      url: `${SITE_URL}${url}`,
      datePublished,
      dateModified,
      mentions,
      about,
    }),
  ];

  if (faqs && faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs));
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  if (includeProduct) {
    schemas.push(generateProductSchema(product));
  }

  return combineSchemas(...schemas);
}
