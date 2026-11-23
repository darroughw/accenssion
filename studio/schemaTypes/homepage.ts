import { defineType, defineField, defineArrayMember } from 'sanity';
import { eyebrow, heading, headingAccent, withShort, image } from './fields';

const section = (name: string, title: string, fields: any[]) =>
  defineField({ name, title, type: 'object', options: { collapsible: true, collapsed: false }, fields });

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'fix', title: 'Fix a problem' },
    { name: 'work', title: 'Featured project' },
    { name: 'plan', title: 'Plan a project' },
    { name: 'more', title: 'Crew, FAQ, CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'Page title (browser tab and Google)', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'Description (Google)', type: 'text', rows: 3, group: 'seo' }),

    { ...section('hero', 'Hero', [
      defineField({ name: 'rail', title: 'Vertical side label', type: 'string' }),
      ...withShort('eyebrow', 'Small label', 1),
      heading('Line breaks are kept. The italic word follows on the last line.'),
      headingAccent(),
      ...withShort('lede', 'Intro paragraph'),
      defineField({ name: 'primaryLabel', title: 'Main button', type: 'string' }),
      defineField({ name: 'secondaryLabel', title: 'Second button', type: 'string' }),
      image(),
      defineField({ name: 'caption', title: 'Photo caption', type: 'string' }),
      defineField({
        name: 'paths', title: 'Two paths', type: 'array', validation: (r) => r.length(2),
        of: [defineArrayMember({ type: 'object', fields: [
          defineField({ name: 'eyebrow', title: 'Small label', type: 'string' }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'meta', title: 'Services line', type: 'string' }),
          defineField({ name: 'link', title: 'Link', type: 'string' }),
        ] })],
      }),
    ]), group: 'hero' },

    { ...section('fix', '01 · Fix a problem', [
      eyebrow(), heading(), headingAccent(),
      ...withShort('intro', 'Intro paragraph'),
      defineField({
        name: 'problems', title: 'Problems', type: 'array',
        of: [defineArrayMember({ type: 'object', fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          ...withShort('body', 'Description'),
          ...withShort('linkLabel', 'Link label', 1),
          { ...image(), validation: undefined },
          defineField({ name: 'service', title: 'Links to service', type: 'reference', to: [{ type: 'service' }] }),
          defineField({ name: 'placeholder', title: 'Placeholder text (shown if no photo)', type: 'string' }),
        ], preview: { select: { title: 'title', media: 'image' } } })],
      }),
      section('inspection', 'Free inspection box', [
        eyebrow(), heading(), headingAccent(),
        defineField({ name: 'body', title: 'Paragraph', type: 'text', rows: 3 }),
        defineField({ name: 'buttonLabel', title: 'Button', type: 'string' }),
        defineField({
          name: 'steps', title: 'Steps', type: 'array',
          of: [defineArrayMember({ type: 'object', fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            ...withShort('body', 'Description'),
          ] })],
        }),
      ]),
    ]), group: 'fix' },

    { ...section('featured', 'Featured project', [
      eyebrow(), heading('Line breaks are kept.'),
      defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
      ...withShort('linkLabel', 'Link label', 1),
      defineField({ name: 'project', title: 'Project', type: 'reference', to: [{ type: 'project' }], validation: (r) => r.required() }),
    ]), group: 'work' },

    { ...section('plan', '02 · Plan a project', [
      eyebrow(), heading(), headingAccent(),
      defineField({
        name: 'pillars', title: 'Pillars', type: 'array',
        of: [defineArrayMember({ type: 'object', fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'body', title: 'Description', type: 'text', rows: 3 }),
          defineField({ name: 'service', title: 'Service', type: 'reference', to: [{ type: 'service' }] }),
        ] })],
      }),
      defineField({
        name: 'figures', title: 'Detail photos', type: 'array', description: 'Shown as arches. Numbered Fig. 2, 3, ... automatically.',
        of: [defineArrayMember({ type: 'object', fields: [image(), defineField({ name: 'caption', title: 'Caption', type: 'string' })],
          preview: { select: { title: 'caption', media: 'image' } } })],
      }),
    ]), group: 'plan' },

    { ...section('crew', 'The crew', [
      eyebrow(), heading(), headingAccent(),
      defineField({ name: 'body', title: 'Paragraph', type: 'text', rows: 4 }),
      { ...image('photo', 'Crew photo'), validation: undefined },
      defineField({ name: 'placeholder', title: 'Placeholder text (shown if no photo)', type: 'string' }),
      defineField({ name: 'buttonLabel', title: 'Button', type: 'string' }),
    ]), group: 'more' },

    { ...section('faq', 'Questions', [
      eyebrow(), heading(), headingAccent(),
      defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
    ]), group: 'more' },

    { ...section('cta', 'Closing call to action', [
      eyebrow(), heading(), headingAccent(),
      defineField({ name: 'body', title: 'Paragraph', type: 'text', rows: 3 }),
      defineField({ name: 'primaryLabel', title: 'Main button', type: 'string' }),
      defineField({ name: 'secondaryLabel', title: 'Second button', type: 'string' }),
    ]), group: 'more' },
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});
