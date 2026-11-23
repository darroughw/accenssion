import { defineType, defineField } from 'sanity';
import { orderRank } from './fields';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'home', title: 'Show on the homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'service', title: 'Service', type: 'reference', to: [{ type: 'service' }], description: 'Optional. Shows the question on that service page too.' }),
    orderRank(),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: {
    select: { title: 'question', home: 'home', service: 'service.name' },
    prepare: ({ title, home, service }) => ({ title, subtitle: [home && 'Homepage', service].filter(Boolean).join(' · ') || 'General' }),
  },
});
