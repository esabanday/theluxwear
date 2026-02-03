import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string | undefined;

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { email?: string };
    email = body.email;
  } else {
    const formData = await request.formData();
    email = formData.get('email')?.toString();
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;

  if (!webhook) {
    return NextResponse.json({ error: 'Newsletter webhook not configured' }, { status: 501 });
  }

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'luxwear-site' })
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
