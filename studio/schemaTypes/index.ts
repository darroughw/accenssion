import { siteSettings } from './siteSettings';
import { homepage } from './homepage';
import { aboutPage, contactPage, faqPage, workPage } from './pages';
import { service } from './service';
import { project } from './project';
import { crewMember } from './crewMember';
import { review } from './review';
import { faq } from './faq';

export const schemaTypes = [homepage, aboutPage, workPage, faqPage, contactPage, siteSettings, service, project, crewMember, review, faq];
export const singletonTypes = new Set(['homepage', 'aboutPage', 'workPage', 'faqPage', 'contactPage', 'siteSettings']);
