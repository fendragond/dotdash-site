import type { Locale } from './ui';

export type RouteKey = 'home' | 'about' | 'contact' | 'legal-notice' | 'privacy';

/**
 * Per-locale URL slugs. Home uses an empty slug (locale root).
 * Adding a page = extend RouteKey + one entry here.
 */
export const ROUTES: Record<RouteKey, Record<Locale, string>> = {
	home: { fr: '', en: '' },
	about: { fr: 'a-propos', en: 'about' },
	contact: { fr: 'contact', en: 'contact' },
	'legal-notice': { fr: 'mentions-legales', en: 'legal-notice' },
	privacy: { fr: 'confidentialite', en: 'privacy' },
};
