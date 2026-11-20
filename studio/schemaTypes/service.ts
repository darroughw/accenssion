import { defineType, defineField } from 'sanity';
import { orderRank } from './fields';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  description: 'The four disciplines shown in the menu and footer.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'items', title: 'Services offered', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'link', title: 'Link', type: 'string', description: 'Where the menu item goes, e.g. #fix or /structural.' }),
    orderRank(),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
});
