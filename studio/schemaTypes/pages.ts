import { defineType, defineField, defineArrayMember } from 'sanity';
import { image } from './fields';

const seo = [
  defineField({ name: 'seoTitle', title: 'Page title (browser tab and Google)', type: 'string', group: 'seo' }),
  defineField({ name: 'seoDescription', title: 'Description (Google)', type: 'text', rows: 2, group: 'seo' }),
];
const header = [
  defineField({ name: 'eyebrow', title: 'Small label', type: 'string', group: 'content' }),
  defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
  defineField({ name: 'headingAccent', title: 'Heading, italic part', type: 'string', group: 'content' }),
  defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'content' }),
];
const groups = [{ name: 'content', title: 'Content', default: true }, { name: 'seo', title: 'SEO' }];

export const aboutPage = defineType({
  name: 'aboutPage', title: 'About page', type: 'document', groups,
  fields: [
    ...header,
    { ...image('photo', 'Photo'), validation: undefined, group: 'content' },
    defineField({ name: 'placeholder', title: 'Placeholder text (shown if no photo)', type: 'string', group: 'content' }),
    defineField({ name: 'howHeading', title: '"How we work" heading', type: 'string', group: 'content' }),
    defineField({ name: 'howHeadingAccent', title: '"How we work" heading, italic part', type: 'string', group: 'content' }),
    defineField({
      name: 'how', title: 'How we work', type: 'array', group: 'content',
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'body', title: 'Description', type: 'text', rows: 3 }),
      ] })],
    }),
    defineField({ name: 'crewHeading', title: 'Crew heading', type: 'string', group: 'content' }),
    defineField({ name: 'crewHeadingAccent', title: 'Crew heading, italic part', type: 'string', group: 'content' }),
    defineField({ name: 'sisterHeading', title: 'Sister company label', type: 'string', group: 'content' }),
    defineField({ name: 'sisterBody', title: 'Sister company text', type: 'text', rows: 3, group: 'content' }),
    ...seo,
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});

export const contactPage = defineType({
  name: 'contactPage', title: 'Contact page', type: 'document', groups,
  fields: [
    ...header,
    defineField({ name: 'thanksHeading', title: 'Thank-you heading', type: 'string', group: 'content' }),
    defineField({ name: 'thanksHeadingAccent', title: 'Thank-you heading, italic part', type: 'string', group: 'content' }),
    defineField({ name: 'thanksBody', title: 'Thank-you text', type: 'text', rows: 3, group: 'content' }),
    ...seo,
  ],
  preview: { prepare: () => ({ title: 'Contact page' }) },
});

export const faqPage = defineType({
  name: 'faqPage', title: 'Questions page', type: 'document', groups,
  fields: [...header, ...seo],
  preview: { prepare: () => ({ title: 'Questions page' }) },
});

export const workPage = defineType({
  name: 'workPage', title: 'Our work page', type: 'document', groups,
  fields: [...header, ...seo],
  preview: { prepare: () => ({ title: 'Our work page' }) },
});
