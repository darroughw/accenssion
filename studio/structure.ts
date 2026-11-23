import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Pages').child(
        S.list().title('Pages').items([
          singleton(S, 'homepage', 'Homepage'),
          singleton(S, 'aboutPage', 'About'),
          singleton(S, 'workPage', 'Our work'),
          singleton(S, 'faqPage', 'Questions'),
          singleton(S, 'contactPage', 'Contact'),
        ])
      ),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Projects'),
      S.divider(),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('review').title('Reviews'),
      S.documentTypeListItem('crewMember').title('Crew'),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings'),
    ]);
