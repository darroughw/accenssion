import { defineType, defineField } from 'sanity';
import { image } from './fields';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'disciplines', title: 'Disciplines', type: 'string', description: 'e.g. Structural · Outdoor living' }),
    defineField({ name: 'scope', title: 'Scope', type: 'text', rows: 2 }),
    defineField({ name: 'partners', title: 'Partners', type: 'string' }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    image('before', 'Before photo'),
    image('after', 'After photo'),
    defineField({ name: 'story', title: 'Story', type: 'array', of: [{ type: 'block' }], description: 'The full write-up for the project page.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'after' } },
});
