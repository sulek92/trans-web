import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface OrderConfirmationData {
  orderNumber: string;
  status: string;
  priceBrutto: string | number;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;
  private resend: Resend | null = null;
  private fromEmail = process.env.EMAIL_FROM || (process.env.RESEND_API_KEY ? 'onboarding@resend.dev' : 'PaletBroker <no-reply@paletbroker.pl>');

  constructor() {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.logger.log('Resend Notifications configured');
    } else {
      const host = process.env.SMTP_HOST;
      const port = parseInt(process.env.SMTP_PORT || '587');
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;

      if (host && user && pass) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.logger.log(`SMTP Notifications configured: ${host}`);
      } else {
        this.transporter = nodemailer.createTransport({
          jsonTransport: true,
        });
        this.logger.warn(
          'EMAIL SERVICE NOT CONFIGURED. Emails will be logged to console.',
        );
      }
    }
  }

  async sendMail(options: { to: string; subject: string; html: string; text?: string }) {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        return true;
      } catch (error) {
        this.logger.error(`Resend failed to send to ${options.to}:`, error);
        return false;
      }
    }

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        return true;
      } catch (error) {
        this.logger.error(`SMTP failed to send to ${options.to}:`, error);
        return false;
      }
    }

    return false;
  }

  private getEmailTemplate(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; mx-auto; padding: 40px; border: 1px solid #eee; border-radius: 24px; margin: 20px auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #123456; letter-spacing: -1px; }
            .content { margin-bottom: 40px; }
            .footer { font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #123456; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">PALETBROKER</div>
            </div>
            <div class="content">
              <h2>${title}</h2>
              ${content}
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PaletBroker.pl - Wszystkie prawa zastrzeżone.<br>
              Wiadomość wygenerowana automatycznie. Prosimy na nią nie odpowiadać.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendOrderConfirmation(to: string, orderData: OrderConfirmationData) {
    const title = 'Potwierdzenie zamówienia';
    const content = `
      <p>Witaj!</p>
      <p>Twoje zamówienie <strong>${orderData.orderNumber}</strong> zostało zarejestrowane w naszym systemie.</p>
      <p>Status: <strong>${orderData.status}</strong></p>
      <p>Kwota do zapłaty: <strong>${orderData.priceBrutto} PLN</strong></p>
      <p>Możesz śledzić swoje zamówienie w panelu klienta lub na stronie śledzenia.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/panel/orders" class="button">Zobacz szczegóły</a>
    `;

    await this.sendMail({
      to,
      subject: `PaletBroker: Potwierdzenie zamówienia ${orderData.orderNumber}`,
      html: this.getEmailTemplate(title, content),
    });
    this.logger.log(`Order confirmation email sent to ${to}`);
  }

  async sendStatusUpdate(to: string, orderNumber: string, newStatus: string) {
    const title = 'Aktualizacja statusu zamówienia';
    const content = `
      <p>Twoje zamówienie <strong>${orderNumber}</strong> zmieniło status na:</p>
      <h3 style="color: #123456; text-transform: uppercase;">${newStatus}</h3>
      <p>Zaloguj się do panelu, aby zobaczyć szczegóły lub pobrać etykietę transportową.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/panel/orders" class="button">Przejdź do panelu</a>
    `;

    await this.sendMail({
      to,
      subject: `PaletBroker: Status zamówienia ${orderNumber} - ${newStatus}`,
      html: this.getEmailTemplate(title, content),
    });
    this.logger.log(
      `Status update email sent to ${to} for order ${orderNumber}`,
    );
  }

  async sendPaymentConfirmation(
    to: string,
    orderNumber: string,
    amount: string,
  ) {
    const title = 'Płatność otrzymana';
    const content = `
      <p>Otrzymaliśmy płatność za zamówienie <strong>${orderNumber}</strong>.</p>
      <p>Kwota: <strong>${amount} PLN</strong></p>
      <p>Twoje zlecenie zostało przekazane do realizacji przez przewoźnika. O kolejnych zmianach będziemy informować w osobnych wiadomościach.</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/panel/orders" class="button">Pobierz potwierdzenie</a>
    `;

    await this.sendMail({
      to,
      subject: `PaletBroker: Płatność za zamówienie ${orderNumber} została zaksięgowana`,
      html: this.getEmailTemplate(title, content),
    });
    this.logger.log(
      `Payment confirmation email sent to ${to} for order ${orderNumber}`,
    );
  }
}
