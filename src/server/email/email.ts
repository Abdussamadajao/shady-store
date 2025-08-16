import { SendEmailParams, transporter } from "./nodemailer";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Send email function
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env["SMTP_FROM"] || process.env["SMTP_USER"],
      to: params.to as string,
      subject: params.subject,
      html: params.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  url: string,
  token: any
): Promise<boolean> {
  const html = `
     <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Verify Your Email</h1>
            </div>
            <div class="content">
              <h2>Welcome! Please verify your email address</h2>
              <p>Thank you for signing up! Please click the button below to verify your email address:</p>
              <a href="${process.env["BASE_URL"]}/auth/verification?token=${token}" class="button">Verify Email Address</a>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p style="word-break: break-all; margin-top: 20px; font-size: 14px; color: #666;">
                If the button doesn't work, copy and paste this link:  ${process.env["BASE_URL"]}/auth/verification?token=${token}
              </p>
            </div>
          </div>
        </body>
        </html>
  `;

  return await sendEmail({
    from: process.env["SMTP_FROM"] || process.env["SMTP_USER"] || "",
    to: email,
    subject: "Verify Your Pick Bazar Account",
    html,
  });
}
export const betterAuthEmails = {
  // Send magic link email
  sendMagicLinkEmail: async ({
    email,
    url,
    token,
  }: {
    email: string;
    url: string;
    token: string;
  }) => {
    try {
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Magic Link Login</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Magic Link Login</h1>
            </div>
            <div class="content">
              <h2>Click the link below to sign in</h2>
              <p>You requested a magic link to sign in to your account. Click the button below to continue:</p>
              <a href="${url}" class="button">Sign In with Magic Link</a>
              <p>This link will expire in 60 minutes for security reasons.</p>
              <p>If you didn't request this link, you can safely ignore this email.</p>
              <div class="footer">
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${url}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env["SMTP_FROM"] || process.env["SMTP_USER"],
        to: email,
        subject: "Your Magic Link - Sign In",
        html: emailTemplate,
      });

      console.log(`Magic link sent to ${email}`);
    } catch (error) {
      console.error("Error sending magic link email:", error);
      throw new Error("Failed to send magic link email");
    }
  },

  // Send two-factor authentication email
  sendTwoFactorAuthEmail: async (
    data: {
      user: { name?: string; email: string };
      otp: string;
    },
    request?: Request
  ) => {
    const { user, otp } = data;
    const email = user.email;
    try {
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Two-Factor Authentication Code</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
            .otp-code { font-size: 32px; font-weight: bold; background: white; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; border: 2px dashed #f5576c; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Two-Factor Authentication</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.name || "there"}!</h2>
              <p>Here's your two-factor authentication code:</p>
              <div class="otp-code">${otp}</div>
              <p>Enter this code in your application to complete the sign-in process.</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <p>This code will expire in 10 minutes. If you didn't request this code, please secure your account immediately.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env["SMTP_FROM"] || process.env["SMTP_USER"],
        to: email,
        subject: "Your Two-Factor Authentication Code",
        html: emailTemplate,
      });

      console.log(`2FA code sent to ${email}`);
    } catch (error) {
      console.error("Error sending 2FA email:", error);
      throw new Error("Failed to send 2FA email");
    }
  },

  // Send email verification
  sendEmailVerification: async (
    {
      email,
      token,
    }: {
      email: string;
      url: string;
      token: string;
    },
    _request?: Request
  ) => {
    try {
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Verify Your Email</h1>
            </div>
            <div class="content">
              <h2>Welcome! Please verify your email address</h2>
              <p>Thank you for signing up! Please click the button below to verify your email address:</p>
              <a href="${process.env["BASE_URL"]}/auth/verification?token=${token}" class="button">Verify Email Address</a>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p style="word-break: break-all; margin-top: 20px; font-size: 14px; color: #666;">
                If the button doesn't work, copy and paste this link:  ${process.env["BASE_URL"]}/auth/verification?token=${token}
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env["SMTP_FROM"] || process.env["SMTP_USER"],
        to: email,
        subject: "Please verify your email address",
        html: emailTemplate,
      });

      console.log(`Email verification sent to ${email}`);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  },
};
