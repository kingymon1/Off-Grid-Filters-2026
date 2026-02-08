import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_URL, products, categories, comparisons, guides, siteConfig } from '../lib/config';

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
    ...products.map(p => `- ${SITE_URL}/reviews/${p.slug}/ — ${p.name}`),
    '',
    '## Best Of / Roundups',
    ...categories.map(c => `- ${SITE_URL}/best-${c.slug}/ — ${c.name}`),
    '',
    '## Comparisons',
    ...comparisons.map(c => `- ${SITE_URL}/${c.slug}/ — ${c.title}`),
    '',
    '## Buyer Guides',
    ...buyerGuides.map(g => `- ${SITE_URL}/guides/${g.slug}/ — ${g.title}`),
    '',
    '## Activity Guides',
    ...activityGuides.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}`),
    '',
    '## Knowledge Base',
    ...knowledgeBase.map(g => `- ${SITE_URL}/${g.slug}/ — ${g.title}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
