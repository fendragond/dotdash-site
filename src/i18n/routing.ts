import { DEFAULT_LOCALE, LOCALES, type Locale } from './ui';
import { ROUTES, type RouteKey } from './routes';

function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}

/** Builds `/${locale}` or `/${locale}/${cleanPath}` with no double or trailing slashes. */
export function localizedPath(locale: Locale, path: string): string {
	const clean = path.replace(/^\/+|\/+$/g, '');
	if (!clean) return `/${locale}`;
	return `/${locale}/${clean}`;
}

/** Canonical internal link for a known route key (translated slug per locale). */
export function routePath(locale: Locale, key: RouteKey): string {
	const slug = ROUTES[key][locale];
	if (!slug) return `/${locale}`;
	return `/${locale}/${slug}`;
}

/** Reverse lookup: `/en/about` → `'about'`. Null if the path is not a known route. */
export function routeKeyFromPath(pathname: string): RouteKey | null {
	const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
	if (segments.length === 0 || !isLocale(segments[0])) return null;

	const locale = segments[0];
	const slug = segments.slice(1).join('/');

	for (const key of Object.keys(ROUTES) as RouteKey[]) {
		if (ROUTES[key][locale] === slug) return key;
	}
	return null;
}

/**
 * Switches locale. Known routes translate their slug via the registry
 * (`/fr/a-propos` → `/en/about`); unknown paths fall back to segment swap.
 */
export function switchLocalePath(currentPath: string, target: Locale): string {
	const key = routeKeyFromPath(currentPath);
	if (key) return routePath(target, key);

	const segments = currentPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
	if (segments.length > 0 && isLocale(segments[0])) {
		segments[0] = target;
	} else {
		segments.unshift(target);
	}
	return `/${segments.join('/')}`;
}

/** Locale from the first path segment, or DEFAULT_LOCALE if none matches. */
export function getLocaleFromPath(pathname: string): Locale {
	const first = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)[0];
	if (first && isLocale(first)) return first;
	return DEFAULT_LOCALE;
}
