const REVEAL_CLASS = 'is-revealed';

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyRevealDelay(el: Element): void {
	if (!(el instanceof HTMLElement)) return;
	const delay = el.dataset.revealDelay;
	if (!delay) return;
	el.style.transitionDelay = delay.includes('ms') || delay.includes('s') ? delay : `${delay}ms`;
}

export function initReveal(): void {
	const elements = document.querySelectorAll('[data-reveal]');
	if (!elements.length) return;

	if (prefersReducedMotion()) {
		elements.forEach((el) => el.classList.add(REVEAL_CLASS));
		return;
	}

	elements.forEach(applyRevealDelay);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add(REVEAL_CLASS);
				observer.unobserve(entry.target);
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
	);

	elements.forEach((el) => observer.observe(el));
}
