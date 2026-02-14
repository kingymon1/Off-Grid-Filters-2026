import { describe, it, expect } from 'vitest';
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateProductSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateItemListSchema,
  combineSchemas,
  createPageSchema,
  SITE_URL,
  SITE_NAME,
} from './schema';

describe('generateArticleSchema', () => {
  it('generates valid Article schema with required fields', () => {
    const result = generateArticleSchema({
      title: 'Test Article',
      description: 'A test description',
      url: `${SITE_URL}/test/`,
    });

    expect(result['@type']).toBe('Article');
    expect(result.headline).toBe('Test Article');
    expect(result.description).toBe('A test description');
    expect(result.mainEntityOfPage['@id']).toBe(`${SITE_URL}/test/`);
    expect(result.author.name).toBe(SITE_NAME);
    expect(result.author.url).toBe(`${SITE_URL}/about/`);
    expect(result.publisher.name).toBe(SITE_NAME);
  });

  it('uses default dates when not provided', () => {
    const result = generateArticleSchema({
      title: 'Test',
      description: 'Test',
      url: `${SITE_URL}/test/`,
    });

    expect(result.datePublished).toBeDefined();
    expect(result.dateModified).toBeDefined();
  });

  it('uses custom dates when provided', () => {
    const result = generateArticleSchema({
      title: 'Test',
      description: 'Test',
      url: `${SITE_URL}/test/`,
      datePublished: '2026-01-15',
      dateModified: '2026-02-04',
    });

    expect(result.datePublished).toBe('2026-01-15T00:00:00+00:00');
    expect(result.dateModified).toBe('2026-02-04T00:00:00+00:00');
  });

  it('includes mentions when provided', () => {
    const result = generateArticleSchema({
      title: 'Test',
      description: 'Test',
      url: `${SITE_URL}/test/`,
      mentions: [
        { name: 'Brita Elite', url: 'https://amazon.com/dp/B0CX5PV6LC', type: 'Product' },
      ],
    });

    expect(result.mentions).toHaveLength(1);
    expect(result.mentions[0]['@type']).toBe('Thing');
    expect(result.mentions[0].name).toBe('Brita Elite');
    expect(result.mentions[0].sameAs).toBe('https://amazon.com/dp/B0CX5PV6LC');
  });

  it('includes about when provided', () => {
    const result = generateArticleSchema({
      title: 'Test',
      description: 'Test',
      url: `${SITE_URL}/test/`,
      about: [
        { name: 'Water Filtration', url: 'https://www.wikidata.org/entity/Q842467' },
      ],
    });

    expect(result.about).toHaveLength(1);
    expect(result.about[0]['@type']).toBe('Thing');
    expect(result.about[0].name).toBe('Water Filtration');
  });

  it('omits mentions and about when not provided', () => {
    const result = generateArticleSchema({
      title: 'Test',
      description: 'Test',
      url: `${SITE_URL}/test/`,
    });

    expect(result).not.toHaveProperty('mentions');
    expect(result).not.toHaveProperty('about');
  });
});

describe('generateFAQSchema', () => {
  it('generates valid FAQPage schema', () => {
    const faqs = [
      { question: 'What is this?', answer: 'A product.' },
      { question: 'Is it safe?', answer: 'Yes, completely safe.' },
    ];

    const result = generateFAQSchema(faqs);

    expect(result['@type']).toBe('FAQPage');
    expect(result.mainEntity).toHaveLength(2);
    expect(result.mainEntity[0]['@type']).toBe('Question');
    expect(result.mainEntity[0].name).toBe('What is this?');
    expect(result.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(result.mainEntity[0].acceptedAnswer.text).toBe('A product.');
  });

  it('handles empty FAQ array', () => {
    const result = generateFAQSchema([]);
    expect(result.mainEntity).toHaveLength(0);
  });
});

describe('generateBreadcrumbSchema', () => {
  it('generates valid BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Guides', url: `${SITE_URL}/guides/` },
      { name: 'Test', url: `${SITE_URL}/test/` },
    ];

    const result = generateBreadcrumbSchema(items);

    expect(result['@type']).toBe('BreadcrumbList');
    expect(result.itemListElement).toHaveLength(3);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].name).toBe('Home');
    expect(result.itemListElement[2].position).toBe(3);
    expect(result.itemListElement[2].name).toBe('Test');
  });
});

describe('generateHowToSchema', () => {
  it('generates valid HowTo schema with steps', () => {
    const steps = [
      { name: 'Step 1', text: 'Do the first thing' },
      { name: 'Step 2', text: 'Do the second thing' },
    ];

    const result = generateHowToSchema('How to Do Something', 'Step-by-step guide', steps);

    expect(result['@type']).toBe('HowTo');
    expect(result.name).toBe('How to Do Something');
    expect(result.step).toHaveLength(2);
    expect(result.step[0].position).toBe(1);
    expect(result.step[0].name).toBe('Step 1');
  });

  it('includes image when provided', () => {
    const steps = [
      { name: 'Step 1', text: 'Do this', image: 'https://example.com/img.jpg' },
    ];

    const result = generateHowToSchema('Test', 'Test', steps);
    expect(result.step[0].image).toBe('https://example.com/img.jpg');
  });

  it('omits image when not provided', () => {
    const steps = [
      { name: 'Step 1', text: 'Do this' },
    ];

    const result = generateHowToSchema('Test', 'Test', steps);
    expect(result.step[0]).not.toHaveProperty('image');
  });
});

describe('generateProductSchema', () => {
  it('generates valid Product schema without product argument', () => {
    const result = generateProductSchema();

    expect(result['@type']).toBe('Product');
    expect(result.brand['@type']).toBe('Brand');
    expect(result.aggregateRating['@type']).toBe('AggregateRating');
  });

  it('generates valid Product schema with a product argument', () => {
    const product = {
      name: 'Test Filter',
      slug: 'test-filter',
      brand: 'TestBrand',
      asin: 'B000TEST',
      price: '49.99',
      category: 'countertop-filters',
      categoryName: 'Countertop Filters',
      notes: '',
      rating: '4.5',
      reviewCount: '100',
      bestFor: 'Testing',
      pros: ['Good'],
      cons: ['Bad'],
      verdict: 'A test product.',
      specs: {},
      publishDate: '2026-02-11',
    };

    const result = generateProductSchema(product);

    expect(result['@type']).toBe('Product');
    expect(result.name).toBe('Test Filter');
    expect(result.brand.name).toBe('TestBrand');
    expect(result.offers['@type']).toBe('Offer');
    expect(result.offers.price).toBe(49.99);
    expect(result.offers.priceCurrency).toBe('USD');
    expect(result.aggregateRating.ratingValue).toBe(4.5);
    expect(result.aggregateRating.reviewCount).toBe(100);
  });
});

describe('generateItemListSchema', () => {
  it('generates valid ItemList schema', () => {
    const items = [
      { name: 'Item 1', url: `${SITE_URL}/item-1/` },
      { name: 'Item 2', url: `${SITE_URL}/item-2/` },
    ];

    const result = generateItemListSchema(items);

    expect(result['@type']).toBe('ItemList');
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].name).toBe('Item 1');
    expect(result.itemListElement[1].position).toBe(2);
  });
});

describe('generateOrganizationSchema', () => {
  it('generates valid Organization schema', () => {
    const result = generateOrganizationSchema();

    expect(result['@type']).toBe('Organization');
    expect(result.name).toBe(SITE_NAME);
    expect(result.url).toBe(SITE_URL);
  });
});

describe('generateWebSiteSchema', () => {
  it('generates valid WebSite schema without search action', () => {
    const result = generateWebSiteSchema();

    expect(result['@type']).toBe('WebSite');
    expect(result.name).toBe(SITE_NAME);
    expect(result.url).toBe(SITE_URL);
    expect(result).not.toHaveProperty('potentialAction');
  });
});

describe('combineSchemas', () => {
  it('wraps schemas in @graph with @context', () => {
    const schema1 = { '@type': 'Article', headline: 'Test' };
    const schema2 = { '@type': 'FAQPage', mainEntity: [] };

    const result = combineSchemas(schema1, schema2);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@graph']).toHaveLength(2);
    expect(result['@graph'][0]['@type']).toBe('Article');
    expect(result['@graph'][1]['@type']).toBe('FAQPage');
  });
});

describe('createPageSchema', () => {
  it('creates combined schema with article and breadcrumbs', () => {
    const result = createPageSchema({
      title: 'Test Page',
      description: 'Test description',
      url: '/test/',
      breadcrumbs: [
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Test', url: `${SITE_URL}/test/` },
      ],
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@graph'].length).toBeGreaterThanOrEqual(2);

    const types = result['@graph'].map((s: any) => s['@type']);
    expect(types).toContain('Article');
    expect(types).toContain('BreadcrumbList');
  });

  it('includes FAQ schema when faqs provided', () => {
    const result = createPageSchema({
      title: 'Test',
      description: 'Test',
      url: '/test/',
      faqs: [{ question: 'Q?', answer: 'A.' }],
    });

    const types = result['@graph'].map((s: any) => s['@type']);
    expect(types).toContain('FAQPage');
  });

  it('includes Product schema when requested', () => {
    const result = createPageSchema({
      title: 'Test',
      description: 'Test',
      url: '/test/',
      includeProduct: true,
    });

    const types = result['@graph'].map((s: any) => s['@type']);
    expect(types).toContain('Product');
  });

  it('uses SITE_URL for article URL', () => {
    const result = createPageSchema({
      title: 'Test',
      description: 'Test',
      url: '/test/',
    });

    const article = result['@graph'].find((s: any) => s['@type'] === 'Article');
    expect(article.mainEntityOfPage['@id']).toBe(`${SITE_URL}/test/`);
  });
});
