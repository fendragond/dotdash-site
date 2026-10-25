export type ToastKind = 'success' | 'error';

const STYLE_ID = 'atlaseo-toast-styles';
const HOST_ID = 'atlaseo-toast-host';
const DISMISS_MS = 5000;
const MOTION = '360ms cubic-bezier(0.16, 1, 0.3, 1)';

let hideTimer: ReturnType<typeof setTimeout> | undefined;
let onKeydown: ((event: KeyboardEvent) => void) | undefined;

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureStyles(): void {
	if (document.getElementById(STYLE_ID)) return;

	const style = document.createElement('style');
	style.id = STYLE_ID;
	/*
	 * Status colors — semantic, NOT brand tokens. Green/red denote state, never
	 * introduced as brand colors. Radius 4px here is the documented system-layer
	 * exception to any project's radius scale.
	 */
	style.textContent = `
#${HOST_ID} {
	position: fixed;
	inset-block-end: 1.5rem;
	inset-inline: 0;
	margin-inline: auto;
	z-index: 60;
	display: flex;
	justify-content: center;
	pointer-events: none;
	padding-inline: 1rem;
}
#${HOST_ID} .atlaseo-toast {
	pointer-events: auto;
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	max-inline-size: 26rem;
	inline-size: 100%;
	padding-block: 0.875rem;
	padding-inline: 1rem;
	border: 1px solid transparent;
	border-radius: 4px;
	font-family: system-ui, sans-serif;
	font-size: 0.9375rem;
	line-height: 1.45;
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.08);
	opacity: 0;
	transform: translateY(12px);
	transition: opacity ${MOTION}, transform ${MOTION};
}
#${HOST_ID} .atlaseo-toast.is-visible {
	opacity: 1;
	transform: none;
}
#${HOST_ID} .atlaseo-toast[data-kind="success"] {
	background: #ECFDF3;
	border-color: #ABEFC6;
	color: #067647;
}
#${HOST_ID} .atlaseo-toast[data-kind="error"] {
	background: #FEF3F2;
	border-color: #FECDCA;
	color: #B42318;
}
#${HOST_ID} .atlaseo-toast__message {
	flex: 1;
	margin: 0;
}
#${HOST_ID} .atlaseo-toast__close {
	flex-shrink: 0;
	margin: 0;
	padding: 0.125rem;
	border: 0;
	background: transparent;
	color: inherit;
	cursor: pointer;
	font-size: 1.25rem;
	line-height: 1;
	opacity: 0.7;
}
#${HOST_ID} .atlaseo-toast__close:hover,
#${HOST_ID} .atlaseo-toast__close:focus-visible {
	opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
	#${HOST_ID} .atlaseo-toast {
		transition: none;
		transform: none;
	}
}
`;
	document.head.appendChild(style);
}

function ensureHost(): HTMLElement {
	ensureStyles();
	let host = document.getElementById(HOST_ID);
	if (!host) {
		host = document.createElement('div');
		host.id = HOST_ID;
		document.body.appendChild(host);
	}
	return host;
}

function clearHideTimer(): void {
	if (hideTimer !== undefined) {
		clearTimeout(hideTimer);
		hideTimer = undefined;
	}
}

function detachKeydown(): void {
	if (!onKeydown) return;
	document.removeEventListener('keydown', onKeydown);
	onKeydown = undefined;
}

function hideToast(): void {
	clearHideTimer();
	detachKeydown();
	const host = document.getElementById(HOST_ID);
	const toast = host?.querySelector<HTMLElement>('.atlaseo-toast');
	if (!toast) return;

	if (prefersReducedMotion()) {
		toast.remove();
		return;
	}

	toast.classList.remove('is-visible');
	const onEnd = (event: TransitionEvent) => {
		if (event.target !== toast || event.propertyName !== 'opacity') return;
		toast.removeEventListener('transitionend', onEnd);
		toast.remove();
	};
	toast.addEventListener('transitionend', onEnd);
}

export function showToast(
	message: string,
	kind: ToastKind = 'success',
	closeLabel = 'Close',
): void {
	const host = ensureHost();
	clearHideTimer();
	detachKeydown();
	host.replaceChildren();

	const toast = document.createElement('div');
	toast.className = 'atlaseo-toast';
	toast.dataset.kind = kind;
	toast.setAttribute('role', kind === 'error' ? 'alert' : 'status');
	toast.setAttribute('aria-live', kind === 'error' ? 'assertive' : 'polite');

	const text = document.createElement('p');
	text.className = 'atlaseo-toast__message';
	text.textContent = message;

	const close = document.createElement('button');
	close.type = 'button';
	close.className = 'atlaseo-toast__close';
	close.setAttribute('aria-label', closeLabel);
	close.textContent = '×';
	close.addEventListener('click', hideToast);

	toast.append(text, close);
	host.appendChild(toast);

	onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') hideToast();
	};
	document.addEventListener('keydown', onKeydown);

	requestAnimationFrame(() => {
		if (prefersReducedMotion()) {
			toast.classList.add('is-visible');
		} else {
			void toast.offsetHeight;
			toast.classList.add('is-visible');
		}
	});

	hideTimer = setTimeout(hideToast, DISMISS_MS);
}
