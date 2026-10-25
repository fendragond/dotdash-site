/**
 * Non-localized site identity. Translatable copy lives in `src/i18n/ui.ts`.
 * Consumers must skip values that fail `isProvided` (unresolved {{TODO}} markers).
 */
export const SITE = {
	url: import.meta.env.SITE,
	logo: '/{{TODO:logo-file}}',
	email: '{{TODO:email-officiel}}',
	phone: '{{TODO:telephone}}',
	phoneTel: '{{TODO:telephone-tel}}',
	whatsapp: '{{TODO:url-whatsapp}}',
	address: '{{TODO:adresse-siege}}',
	ogImage: '/{{TODO:og-image-default}}',
} as const;

/**
 * Social links — empty by design. Projects populate entries shaped like:
 * `{ key: 'linkedin', href: '{{TODO:url-linkedin}}', labelKey: 'social.linkedin' }`
 * Use `labelKey` (not a hardcoded label) so aria-labels resolve via `t(locale, labelKey)`.
 */
export const SOCIALS = [] as const;

/** True when a value is real content — not empty and not an unresolved {{TODO}} marker. */
export function isProvided(value: string | undefined): boolean {
	return Boolean(value && !value.includes('{{TODO') && value.trim().length > 0);
}
