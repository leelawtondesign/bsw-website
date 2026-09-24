import type { APIRoute } from 'astro';
import sgMail from '@sendgrid/mail';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? import.meta.env.SENDGRID_API_KEY;
	const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? import.meta.env.CONTACT_EMAIL ?? 'enquiries@bsw-heating.com';
	const RECAPTCHA_API_KEY = process.env.RECAPTCHA_API_KEY ?? import.meta.env.RECAPTCHA_API_KEY;
	const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID ?? import.meta.env.RECAPTCHA_PROJECT_ID;
	const RECAPTCHA_SITE_KEY = process.env.PUBLIC_RECAPTCHA_SITE_KEY ?? import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;

	if (!SENDGRID_API_KEY) {
		console.error('[send-email] SENDGRID_API_KEY not set');
		return new Response(JSON.stringify({ error: 'Email is not configured' }), { status: 500 });
	}

	sgMail.setApiKey(SENDGRID_API_KEY);

	try {
		const data = await request.formData();

		const recaptchaToken = data.get('recaptcha_token') as string | null;

		if (RECAPTCHA_API_KEY) {
			if (!recaptchaToken) {
				console.warn('[send-email] rejected: recaptcha_token missing from form data');
				return new Response(JSON.stringify({ error: 'reCAPTCHA token missing' }), { status: 400 });
			}

			const verifyRes = await fetch(
				`https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_API_KEY}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						event: {
							token: recaptchaToken,
							expectedAction: 'contact_form',
							siteKey: RECAPTCHA_SITE_KEY,
						},
					}),
				},
			);

			const verification = await verifyRes.json();
			const score: number = verification?.riskAnalysis?.score ?? 0;

			if (!verification?.tokenProperties?.valid || score < 0.5) {
				console.warn('[send-email] rejected: recaptcha verification failed', verification?.error ?? '');
				return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 400 });
			}
		} else {
			console.log('[send-email] RECAPTCHA_API_KEY not set — skipping recaptcha verification');
		}

		const fields = {
			first_name: String(data.get('first_name') ?? ''),
			surname: String(data.get('surname') ?? ''),
			email: String(data.get('email') ?? ''),
			phone: String(data.get('phone') ?? ''),
			message: String(data.get('message') ?? ''),
		};

		const msg = {
			to: CONTACT_EMAIL,
			from: CONTACT_EMAIL,
			replyTo: fields.email || undefined,
			subject: `Website enquiry from ${fields.first_name} ${fields.surname}`.trim(),
			text: [
				`Name: ${fields.first_name} ${fields.surname}`,
				`Email: ${fields.email}`,
				`Contact number: ${fields.phone}`,
				'',
				fields.message,
			].join('\n'),
		};

		const [sgRes] = await sgMail.send(msg);
		console.log('[send-email] sendgrid response:', sgRes.statusCode, sgRes.headers['x-message-id']);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error: any) {
		console.error('[send-email] failed:', error.response?.body || error);
		return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
	}
};
