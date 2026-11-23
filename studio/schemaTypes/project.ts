import { defineType, defineField, defineArrayMember } from 'sanity';
import { image, orderRank } from './fields';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Category label', type: 'string', description: 'Shown on the project card, e.g. Crawl space' }),
    defineField({ name: 'services', title: 'Services', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }], description: 'The project appears on these service pages.' }),
    defineField({ name: 'summary', title: 'One-line summary', type: 'text', rows: 2 }),
    { ...image('cover', 'Card photo'), validation: (r: any) => r.required() },
    { ...image('before', 'Before photo'), validation: undefined },
    { ...image('after', 'After photo'), validation: undefined },
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'disciplines', title: 'Disciplines', type: 'string', description: 'e.g. Structural · Outdoor living' }),
    defineField({ name: 'scope', title: 'Scope', type: 'text', rows: 2 }),
    defineField({ name: 'partners', title: 'Partners', type: 'string' }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    defineField({
      name: 'story', title: 'Story', type: 'array',
      of: [defineArrayMember({ type: 'block', styles: [{ title: 'Paragraph', value: 'normal' }, { title: 'Heading', value: 'h3' }], lists: [], marks: { decorators: [], annotations: [] } })],
    }),
    defineField({
      name: 'gallery', title: 'More photos', type: 'array',
      of: [defineArrayMember({ type: 'object', fields: [image(), defineField({ name: 'caption', title: 'Caption', type: 'string' })], preview: { select: { title: 'caption', media: 'image' } } })],
    }),
    orderRank(),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
});
