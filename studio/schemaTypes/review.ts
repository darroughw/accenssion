import { defineType, defineField } from 'sanity';
import { orderRank } from './fields';

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Name', type: 'string', description: 'First name and last initial, e.g. Betsy N.' }),
    defineField({ name: 'service', title: 'Service', type: 'string' }),
    defineField({ name: 'rating', title: 'Stars', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'source', title: 'Source', type: 'string', initialValue: 'Google' }),
    orderRank(),
  ],
  description: 'The first review (by order) is featured on the homepage and About page.',
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: { select: { title: 'author', subtitle: 'quote' } },
});
