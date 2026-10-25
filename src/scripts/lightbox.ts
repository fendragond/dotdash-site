/*
 * CORE LESSON — Astro scoped <style> NEVER reaches DOM created at runtime in JS.
 * This lightbox builds a <dialog> (and its children) dynamically, so styles are
 * injected once via a global <style id="atlaseo-lightbox-styles">. Same pattern
 * as toast.ts. Encode this whenever a utility creates its own DOM.
 */

export interface LightboxLabels {
	dialogLabel: string;
	closeLabel: string;
}

const STYLE_ID = 'atlaseo-lightbox-styles';
const DIALOG_ID = 'atlaseo-lightbox';
const READY_KEY = '__atlaseoLightboxReady';
const OPEN_CLASS = 'atlaseo-lightbox-open';
const MOTION = '200ms ease';

const DEFAULT_LABELS: LightboxLabels = {
	dialogLabel: 'Enlarged image',
	closeLabel: 'Close',
};

let lastTrigger: HTMLElement | null = null;

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureStyles(): void {
	if (document.getElementById(STYLE_ID)) return;

	const style = document.createElement('style');
	style.id = STYLE_ID;
	/*
	 * Backdrop scrim — functional overlay, NOT a brand color (same rationale as
	 * toast status colors). Radius 4px is the documented system-layer exception
	 * to any project's radius scale.
	 */
	style.textContent = `
html.${OPEN_CLASS},
html.${OPEN_CLASS} body {
	overflow: hidden;
}
#${DIALOG_ID} {
	padding: 0;
	border: 0;
	background: transparent;
	max-inline-size: 90vw;
	max-block-size: 85vh;
}
#${DIALOG_ID}::backdrop {
	background: rgba(0, 0, 0, 0.9);
	opacity: 0;
	transition: opacity ${MOTION};
}
#${DIALOG_ID}[open].is-open::backdrop {
	opacity: 1;
}
#${DIALOG_ID} .atlaseo-lightbox__panel {
	position: relative;
	margin-inline: auto;
	max-inline-size: 90vw;
	max-block-size: 85vh;
	border-radius: 4px;
	overflow: hidden;
	background: transparent;
	opacity: 0;
	transform: scale(0.98);
	transition: opacity ${MOTION}, transform ${MOTION};
}
#${DIALOG_ID}[open].is-open:not(.is-closing) .atlaseo-lightbox__panel {
	opacity: 1;
	transform: none;
}
#${DIALOG_ID}.is-closing .atlaseo-lightbox__panel {
	opacity: 0;
	transform: scale(0.98);
}
#${DIALOG_ID} .atlaseo-lightbox__image {
	display: block;
	max-inline-size: 90vw;
	max-block-size: 85vh;
	inline-size: auto;
	block-size: auto;
	object-fit: contain;
}
#${DIALOG_ID} .atlaseo-lightbox__close {
	position: absolute;
	inset-block-start: 0.5rem;
	inset-inline-end: 0.5rem;
	z-index: 1;
	inline-size: 2.5rem;
	block-size: 2.5rem;
	padding: 0;
	border: 0;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.55);
	color: rgb(255 255 255);
	font-size: 1.5rem;
	line-height: 1;
	cursor: pointer;
}
#${DIALOG_ID} .atlaseo-lightbox__close:focus-visible {
	outline: 2px solid rgb(255 255 255);
	outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
	#${DIALOG_ID}::backdrop,
	#${DIALOG_ID} .atlaseo-lightbox__panel {
		transition: none;
	}
	#${DIALOG_ID} .atlaseo-lightbox__panel {
		transform: none;
	}
}
`;
	document.head.appendChild(style);
}

function applyLabels(dialog: HTMLDialogElement, labels: LightboxLabels): void {
	dialog.setAttribute('aria-label', labels.dialogLabel);
	const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]');
	if (closeBtn) closeBtn.setAttribute('aria-label', labels.closeLabel);
}

function setScrollLock(locked: boolean): void {
	document.documentElement.classList.toggle(OPEN_CLASS, locked);
}

function closeLightbox(dialog: HTMLDialogElement): void {
	if (!dialog.open || dialog.classList.contains('is-closing')) return;

	const finish = () => {
		dialog.close();
	};

	if (prefersReducedMotion()) {
		finish();
		return;
	}

	dialog.classList.remove('is-open');
	dialog.classList.add('is-closing');

	const panel = dialog.querySelector('.atlaseo-lightbox__panel');
	let done = false;
	const onEnd = (event: Event) => {
		if (event.target !== panel) return;
		if (done) return;
		done = true;
		panel?.removeEventListener('transitionend', onEnd);
		finish();
	};
	panel?.addEventListener('transitionend', onEnd);
	window.setTimeout(() => {
		if (done) return;
		done = true;
		panel?.removeEventListener('transitionend', onEnd);
		finish();
	}, 280);
}

function openLightbox(dialog: HTMLDialogElement, src: string, alt: string, trigger: HTMLElement): void {
	const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
	if (!image || !src) return;

	lastTrigger = trigger;
	image.src = src;
	image.alt = alt;

	if (!dialog.open) {
		dialog.classList.remove('is-closing', 'is-open');
		dialog.showModal();
		setScrollLock(true);

		if (prefersReducedMotion()) {
			dialog.classList.add('is-open');
		} else {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					dialog.classList.add('is-open');
				});
			});
		}
	}
}

function ensureDialog(labels: LightboxLabels): HTMLDialogElement {
	let dialog = document.getElementById(DIALOG_ID) as HTMLDialogElement | null;

	if (!dialog) {
		dialog = document.createElement('dialog');
		dialog.id = DIALOG_ID;
		dialog.innerHTML = `
			<div class="atlaseo-lightbox__panel">
				<button type="button" class="atlaseo-lightbox__close" data-lightbox-close aria-label="">
					<span aria-hidden="true">&times;</span>
				</button>
				<img class="atlaseo-lightbox__image" data-lightbox-image alt="" />
			</div>
		`;
		document.body.appendChild(dialog);
	}

	applyLabels(dialog, labels);
	return dialog;
}

export function initLightbox(labels?: Partial<LightboxLabels>): void {
	const resolved: LightboxLabels = {
		dialogLabel: labels?.dialogLabel ?? DEFAULT_LABELS.dialogLabel,
		closeLabel: labels?.closeLabel ?? DEFAULT_LABELS.closeLabel,
	};

	ensureStyles();
	const dialog = ensureDialog(resolved);

	const w = window as Window & { [READY_KEY]?: boolean };
	if (w[READY_KEY]) return;
	w[READY_KEY] = true;

	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) closeLightbox(dialog);
	});

	dialog.addEventListener('cancel', (event) => {
		event.preventDefault();
		closeLightbox(dialog);
	});

	dialog.addEventListener('close', () => {
		dialog.classList.remove('is-open', 'is-closing');
		setScrollLock(false);
		const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
		if (image) {
			image.removeAttribute('src');
			image.alt = '';
		}
		const trigger = lastTrigger;
		lastTrigger = null;
		trigger?.focus();
	});

	dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')?.addEventListener('click', () => {
		closeLightbox(dialog);
	});

	document.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const trigger = target.closest<HTMLElement>('[data-lightbox-trigger]');
		if (!trigger) return;
		const src = trigger.dataset.lightboxSrc;
		if (!src) return;
		event.preventDefault();
		openLightbox(dialog, src, trigger.dataset.lightboxAlt ?? '', trigger);
	});
}

// Usage (in a page/component script):
//   import { initLightbox } from '../scripts/lightbox';
//   initLightbox({ dialogLabel: t(locale,'lightbox.dialog'), closeLabel: t(locale,'lightbox.close') });
// Trigger markup:
//   <button data-lightbox-trigger data-lightbox-src="/img/x.jpg" data-lightbox-alt="...">...</button>
