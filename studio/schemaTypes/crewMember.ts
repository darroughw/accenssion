import { defineType, defineField } from 'sanity';
import { image, orderRank } from './fields';

export const crewMember = defineType({
  name: 'crewMember',
  title: 'Crew member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    { ...image('photo', 'Photo'), validation: undefined },
    orderRank(),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
