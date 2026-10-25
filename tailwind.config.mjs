/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// NEUTRAL DEFAULTS — override per project via DESIGN.md.
				// Names are the constant ATLASEO convention; values are placeholders.
				primary: '#3F3F46',
				'primary-deep': '#27272A',
				secondary: '#52525B',
				ink: '#18181B',
				'ink-variant': '#52525B',
				surface: '#FFFFFF',
				'surface-alt': '#F4F4F5',
				'border-light': '#E4E4E7',
				outline: '#71717A',
				'outline-variant': '#D4D4D8',
				error: '#BA1A1A',
			},
			fontFamily: {
				// NEUTRAL DEFAULTS — override per project via DESIGN.md.
				display: ['system-ui', 'sans-serif'],
				body: ['system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'monospace'],
			},
			fontSize: {
				display: ['72px', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '800' }],
				'headline-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
				'headline-lg-m': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
				'headline-md': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
				'body-lg': ['18px', { lineHeight: '1.6' }],
				'body-md': ['16px', { lineHeight: '1.5' }],
				eyebrow: ['12px', { lineHeight: '1.0', letterSpacing: '0.15em', fontWeight: '500' }],
				label: ['14px', { lineHeight: '1.0', fontWeight: '600' }],
			},
			spacing: {
				'section-y': '160px',
				'section-y-m': '80px',
				gutter: '32px',
				'stack-sm': '8px',
				'stack-md': '24px',
				'stack-lg': '48px',
			},
			maxWidth: {
				container: '1280px',
			},
			borderRadius: {
				// NEUTRAL DEFAULT — projects may override (e.g. 0px for a rigid look,
				// or a larger radius for a softer brand). No hardcoded design decision here.
				DEFAULT: '4px',
			},
		},
	},
};
