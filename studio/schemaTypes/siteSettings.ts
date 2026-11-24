import { defineType, defineField } from 'sanity';
import { image } from './fields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fieldsets: [{ name: 'sections', title: 'Show on the site', options: { columns: 2 } }],
  fields: [
    defineField({
      name: 'showCrew', title: 'Show crew', type: 'boolean', fieldset: 'sections', initialValue: false,
      description: 'Crew section on the homepage, and the crew + sister company section on About. Turn on once crew names, the photo and the sister-company line are in.',
    }),
    defineField({
      name: 'showFaqs', title: 'Show questions & answers', type: 'boolean', fieldset: 'sections', initialValue: false,
      description: 'FAQ sections on the homepage and service pages, the Questions page, and its menu link. Turn on once the answers are written.',
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'serviceArea', title: 'Service area', type: 'string' }),
    defineField({ name: 'serviceAreaLong', title: 'Service area, full sentence', type: 'text', rows: 2, description: 'Shown on service pages and Contact.' }),
    defineField({ name: 'licenseNumber', title: 'NC General Contractor license #', type: 'string' }),
    defineField({ name: 'sisterCompany', title: 'Sister company', type: 'string' }),
    defineField({ name: 'footerAbout', title: 'Footer description', type: 'text', rows: 3 }),
    defineField({ name: 'headerCtaLabel', title: 'Header button label', type: 'string' }),
    defineField({ name: 'menuCtaLabel', title: 'Menu button label', type: 'string' }),
    image('menuImage', 'Menu photo'),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
