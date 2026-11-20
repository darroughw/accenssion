import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'homepage', 'Homepage'),
      singleton(S, 'siteSettings', 'Site settings'),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('review').title('Reviews'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('crewMember').title('Crew'),
      S.documentTypeListItem('service').title('Services'),
    ]);
