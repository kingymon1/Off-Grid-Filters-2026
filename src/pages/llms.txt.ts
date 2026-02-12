import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_URL, products, categories, comparisons, guides, siteConfig, getProductBySlug } from '../lib/config';

export const GET: APIRoute = () => {
  const buyerGuides = guides.filter(g => g.type === 'buyer');
  const activityGuides = guides.filter(g => g.type === 'activity');
  const knowledgeBase = guides.filter(g => g.type === 'knowledge');

  const lines = [
    `# ${SITE_NAME}`,
    `> ${siteConfig.tagline}`,
    '',
    '## About',
    siteConfig.productDescription,
    '',
    '## Product Reviews',
    ...products.map(p => `- ${SITE_URL}/reviews/${p.slug}/ — ${p.name} Review: ${p.verdict}`),
    '',
    '## Best Of / Roundups',
    ...categories.map(c => `- ${SITE_URL}/best-${c.slug}/ — Best ${c.name}: ${c.description}`),
    '',
    '## Comparisons',
    ...comparisons.map(c => {
      const a = getProductBySlug(c.productA);
      const b = getProductBySlug(c.productB);
      const title = `${a?.name ?? c.productA} vs ${b?.name ?? c.productB}`;
      return `- ${SITE_URL}/${c.slug}/ — ${title}: Side-by-side specs, performance, and value comparison`;
    }),
    '',
    '## Buyer Guides',
    ...buyerGuides.map(g => `- ${SITE_URL}/guides/${g.slug}/ — ${g.title}: ${g.description}`),
    '',
    '## Activity Guides',
    ...activityGuides.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}: ${g.description}`),
    '',
    '## Knowledge Base',
    ...knowledgeBase.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}: ${g.description}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
