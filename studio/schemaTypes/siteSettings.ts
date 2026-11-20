import { defineType, defineField } from 'sanity';
import { image } from './fields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'serviceArea', title: 'Service area', type: 'string' }),
    defineField({ name: 'licenseNumber', title: 'NC General Contractor license #', type: 'string' }),
    defineField({ name: 'sisterCompany', title: 'Sister company', type: 'string' }),
    defineField({ name: 'footerAbout', title: 'Footer description', type: 'text', rows: 3 }),
    defineField({ name: 'headerCtaLabel', title: 'Header button label', type: 'string' }),
    defineField({ name: 'menuCtaLabel', title: 'Menu button label', type: 'string' }),
    image('menuImage', 'Menu photo'),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
