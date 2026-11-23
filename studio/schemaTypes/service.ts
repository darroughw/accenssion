import { defineType, defineField, defineArrayMember } from 'sanity';
import { image, orderRank } from './fields';

const listSection = (name: string, title: string, tocDefault: string) =>
  defineField({
    name, title, type: 'object', options: { collapsible: true },
    fields: [
      defineField({ name: 'toc', title: 'Label in "On this page"', type: 'string', initialValue: tocDefault }),
      defineField({ name: 'heading', title: 'Heading', type: 'string' }),
      defineField({ name: 'headingAccent', title: 'Heading, italic part', type: 'string' }),
      defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
      defineField({ name: 'items', title: 'List', type: 'array', of: [{ type: 'string' }] }),
    ],
  });

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  description: 'One of the four disciplines. Each gets its own page and appears in the menu and footer.',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'page', title: 'Page sections' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'basics', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL', type: 'slug', group: 'basics', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'kicker', title: 'Small label', type: 'string', group: 'basics', description: 'e.g. Under the house' }),
    defineField({ name: 'items', title: 'Services offered (menu and footer)', type: 'array', group: 'basics', of: [{ type: 'string' }] }),
    orderRank(),
    defineField({ name: 'title', title: 'Page heading', type: 'string', group: 'page' }),
    defineField({ name: 'titleAccent', title: 'Page heading, italic part', type: 'string', group: 'page' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'page' }),
    { ...image('cover', 'Cover photo'), group: 'page' },
    defineField({ name: 'coverCaption', title: 'Cover caption', type: 'string', group: 'page' }),
    defineField({ name: 'seoDescription', title: 'Description (Google)', type: 'text', rows: 2, group: 'page' }),
    { ...listSection('signs', 'First list (e.g. Signs it’s time)', 'Signs it’s time'), group: 'page' },
    { ...listSection('work', 'What we do', 'What we repair'), group: 'page' },
    defineField({
      name: 'process', title: 'How it runs', type: 'object', group: 'page', options: { collapsible: true },
      fields: [
        defineField({ name: 'toc', title: 'Label in "On this page"', type: 'string', initialValue: 'How it runs' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'headingAccent', title: 'Heading, italic part', type: 'string' }),
        defineField({ name: 'body', title: 'Paragraph', type: 'text', rows: 5 }),
      ],
    }),
    defineField({
      name: 'details', title: 'Detail photos', type: 'object', group: 'page', options: { collapsible: true },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'headingAccent', title: 'Heading, italic part', type: 'string' }),
        defineField({
          name: 'figures', title: 'Photos', type: 'array',
          of: [defineArrayMember({
            type: 'object',
            fields: [
              { ...image(), validation: undefined },
              defineField({ name: 'caption', title: 'Caption', type: 'string' }),
              defineField({ name: 'placeholder', title: 'Placeholder text (shown if no photo)', type: 'string' }),
            ],
            preview: { select: { title: 'caption', subtitle: 'placeholder', media: 'image' } },
          })],
        }),
      ],
    }),
    defineField({ name: 'projectsHeading', title: 'Projects heading', type: 'string', group: 'page', description: 'Projects tagged with this service appear automatically.' }),
    defineField({ name: 'projectsHeadingAccent', title: 'Projects heading, italic part', type: 'string', group: 'page' }),
    defineField({ name: 'faqHeadingAccent', title: 'Questions heading, italic part', type: 'string', group: 'page', description: 'Shown as "About …". FAQs tagged with this service appear automatically.' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'kicker', media: 'cover' } },
});
