import { defineField } from 'sanity';

// Shared field helpers so every section edits the same way.

export const eyebrow = () =>
  defineField({ name: 'eyebrow', title: 'Small label', type: 'string', description: 'The small uppercase line above a heading.' });

export const heading = (description = 'Line 1 of the heading.') =>
  defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2, description, validation: (r) => r.required() });

export const headingAccent = () =>
  defineField({ name: 'headingAccent', title: 'Heading, italic line', type: 'string', description: 'Shown in italic after the heading.' });

/** A text field plus an optional shorter version shown on phones. */
export const withShort = (name: string, title: string, rows = 3) => [
  defineField({ name, title, type: rows > 1 ? 'text' : 'string', rows: rows > 1 ? rows : undefined } as any),
  defineField({
    name: `${name}Short`,
    title: `${title} (phone version)`,
    type: rows > 1 ? 'text' : 'string',
    rows: rows > 1 ? rows : undefined,
    description: 'Optional. A shorter version for small screens. Leave blank to use the main text.',
  } as any),
];

export const image = (name = 'image', title = 'Photo') =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the photo for people using screen readers, and for Google.',
        validation: (r) => r.required(),
      }),
    ],
  });

export const orderRank = () =>
  defineField({ name: 'orderRank', title: 'Order', type: 'number', description: 'Lower numbers show first.' });
