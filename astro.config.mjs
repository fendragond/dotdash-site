// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// ---------------------------------------------------------------------------
// KNOWN WORKAROUND — build-time image compile path remap
// Context: adapter uses imageService: 'compile' (static WebP at build time,
// required because static hosting on Workers Static Assets has no /_image runtime).
// Bug: with preserveBuildClientDir, Vite emits source assets to
// dist/client/_astro/ but Astro's compile step reads/writes dist/_astro/,
// causing ENOENT on dist/_astro/*.jpg and failing the build.
// This fs patch remaps those paths so compiled WebP lands in dist/client/_astro/.
// Revisit when upgrading @astrojs/cloudflare or astro — may become unnecessary
// or break. Tracked as technical debt.
// ---------------------------------------------------------------------------

const OUT_ASTRO = path.join('dist', '_astro');
const CLIENT_ASTRO = path.join('dist', 'client', '_astro');

/** @param {string | import('node:url').URL | import('node:buffer').Buffer} filePath */
function toFsPath(filePath) {
	if (filePath instanceof URL) return fileURLToPath(filePath);
	return String(filePath);
}

/** @param {string} normalizedPath */
function remapOutAstroToClient(normalizedPath) {
	const outAstroRoot = path.normalize(path.resolve(OUT_ASTRO));
	if (!normalizedPath.startsWith(outAstroRoot + path.sep)) return normalizedPath;
	return path.join(
		path.resolve(CLIENT_ASTRO),
		path.relative(outAstroRoot, normalizedPath),
	);
}

/** @param {string | import('node:url').URL | import('node:buffer').Buffer} filePath */
function resolveCompileReadPath(filePath) {
	const normalized = path.normalize(toFsPath(filePath));
	const clientPath = remapOutAstroToClient(normalized);
	if (clientPath !== normalized && fs.existsSync(clientPath)) return clientPath;
	return normalized;
}

/** @param {string | import('node:url').URL | import('node:buffer').Buffer} filePath */
function resolveCompileWritePath(filePath) {
	const normalized = path.normalize(toFsPath(filePath));
	return remapOutAstroToClient(normalized);
}

function patchFsPromisesMethod(methodName, resolvePath) {
	const original = fs.promises[methodName].bind(fs.promises);
	fs.promises[methodName] = async (filePath, ...args) =>
		original(resolvePath(filePath), ...args);
}

const originalCopyFile = fs.promises.copyFile.bind(fs.promises);
patchFsPromisesMethod('readFile', resolveCompileReadPath);
patchFsPromisesMethod('writeFile', resolveCompileWritePath);
patchFsPromisesMethod('mkdir', resolveCompileWritePath);
patchFsPromisesMethod('unlink', resolveCompileWritePath);
fs.promises.copyFile = async (source, dest, ...args) =>
	originalCopyFile(
		resolveCompileReadPath(source),
		resolveCompileWritePath(dest),
		...args,
	);

const SITEMAP_EXCLUDED_PATHS = new Set(['/mentions-legales', '/confidentialite']);

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL ?? 'https://example.com',
	output: 'server',
	adapter: cloudflare({ imageService: 'compile' }),
	trailingSlash: 'never',
	i18n: {
		locales: ['fr', 'en'],
		defaultLocale: 'fr',
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sitemap({
			filter: (page) => {
				const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
				return !SITEMAP_EXCLUDED_PATHS.has(pathname);
			},
		}),
	],
});
