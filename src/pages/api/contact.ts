import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

function json(body: Record<string, unknown>, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const POST: APIRoute = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'Invalid JSON body' }, 400);
	}

	if (!body || typeof body !== 'object') {
		return json({ ok: false, error: 'Invalid request body' }, 400);
	}

	const { name, email, message, company } = body as Record<string, unknown>;

	// Honeypot: silently accept bots without sending
	if (typeof company === 'string' && company.trim() !== '') {
		return json({ ok: true }, 200);
	}

	if (typeof name !== 'string' || name.trim() === '') {
		return json({ ok: false, error: 'Name is required' }, 400);
	}
	if (typeof email !== 'string' || email.trim() === '') {
		return json({ ok: false, error: 'Email is required' }, 400);
	}
	if (!EMAIL_RE.test(email.trim())) {
		return json({ ok: false, error: 'Invalid email address' }, 400);
	}
	if (typeof message !== 'string' || message.trim() === '') {
		return json({ ok: false, error: 'Message is required' }, 400);
	}
	if (message.length > MAX_MESSAGE_LENGTH) {
		return json({ ok: false, error: 'Message is too long' }, 400);
	}

	const apiKey = env.RESEND_API_KEY;
	const to = env.CONTACT_EMAIL;
	const from = env.CONTACT_FROM;

	if (!apiKey || !to || !from) {
		console.error('Contact API: missing RESEND_API_KEY, CONTACT_EMAIL, or CONTACT_FROM');
		return json({ ok: false, error: 'Server configuration error' }, 500);
	}

	const resend = new Resend(apiKey);
	const trimmedName = name.trim();
	const trimmedEmail = email.trim();
	const trimmedMessage = message.trim();

	try {
		const result = await resend.emails.send({
			from,
			to,
			replyTo: trimmedEmail,
			subject: `Contact form: ${trimmedName}`,
			text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
		});

		if (result.error) {
			console.error('Resend error:', result.error);
			return json({ ok: false, error: 'Failed to send message' }, 500);
		}

		return json({ ok: true }, 200);
	} catch (err) {
		console.error('Contact API send failed:', err);
		return json({ ok: false, error: 'Failed to send message' }, 500);
	}
};
