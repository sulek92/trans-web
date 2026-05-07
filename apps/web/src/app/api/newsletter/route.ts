import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Nieprawidłowy adres e-mail' }, { status: 400 });
    }

    // TODO: Integrate with Mailchimp/MailerLite/Database

    return NextResponse.json({ success: true, message: 'Dziękujemy za zapis do newslettera!' });
  } catch {
    return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
  }
}
