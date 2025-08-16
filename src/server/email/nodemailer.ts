import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type EmailUser = { name?: string; email: string };

export interface SendEmailParams {
  from: string | EmailUser;
  subject?: string;
  to: string | string[] | EmailUser | EmailUser[];
  reply_to?: string | EmailUser;
  send_at?: number;
  delivery_time?: string;
  tags?: string[];
  html?: string;
}

export interface EmailClientService {
  send(params: SendEmailParams): Promise<void>;
}
export type SendMailOptions = Mail.Options;

const transporter = nodemailer.createTransport({
  host: process.env["SMTP_HOST"],
  port: parseInt(process.env["SMTP_PORT"] || "587"),
  secure: process.env["SMTP_SECURE"] === "true",
  auth: {
    user: process.env["SMTP_USER"], // Your Gmail address
    pass: process.env["SMTP_PASS"], // Your Gmail app password
  },
});

export function nodemailerService(): EmailClientService {
  async function send(params: SendEmailParams): Promise<void> {
    try {
      const to = (Array.isArray(params.to) ? params.to : [params.to]) as
        | string
        | string[];

      const options: SendMailOptions = {
        from: params.from as string,
        to,
        subject: params.subject,
        html: params.html,
        replyTo: params?.reply_to as string,
        date: params?.send_at?.toString(),
      };

      await transporter.sendMail(options);
    } catch (error) {
      console.error(error, "[NodemailerService][Send] - error");
    }
  }

  return { send };
}

export { transporter };
