import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class ProvisionEmailService {
  private readonly logger = new Logger(ProvisionEmailService.name);

  constructor(private config: ConfigService) {}

  async sendWelcomeEmail(
    admin: { firstName: string; lastName: string; email: string },
    orgName: string,
    temporaryPassword: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER', ''),
        pass: this.config.get<string>('SMTP_PASS', ''),
      },
    });

    const appUrl = this.config.get<string>('APP_URL', 'https://backroom.app');
    const fullName = `${admin.firstName} ${admin.lastName}`;

    try {
      await transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', 'Backroom <noreply@backroom.app>'),
        to: admin.email,
        subject: `Welcome to Backroom — Your ${orgName} Admin Account`,
        html: this.buildHtml(fullName, orgName, admin.email, temporaryPassword, appUrl),
      });
      this.logger.log(`Welcome email sent to ${admin.email} for org ${orgName}`);
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${admin.email}: ${err.message}`);
      throw err;
    }
  }

  private buildHtml(
    fullName: string,
    orgName: string,
    email: string,
    password: string,
    appUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Backroom</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
    .wrapper { max-width: 600px; margin: 32px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #4f46e5; padding: 32px; color: white; text-align: center; }
    .header h1 { margin: 0 0 6px; font-size: 26px; letter-spacing: -0.5px; }
    .header p { margin: 0; opacity: 0.85; font-size: 14px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .org-tag { display: inline-block; background: #eef2ff; color: #4f46e5; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-bottom: 20px; }
    .creds-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 24px; margin: 20px 0; }
    .creds-box h3 { margin: 0 0 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; }
    .cred-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { font-size: 12px; color: #94a3b8; font-weight: 600; }
    .cred-value { font-size: 14px; font-weight: 600; color: #1e293b; font-family: 'Courier New', monospace; }
    .cred-value.password { background: #fef9c3; padding: 2px 8px; border-radius: 4px; color: #92400e; }
    .warning { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #92400e; }
    .warning strong { display: block; margin-bottom: 4px; }
    .btn { display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 8px 0; }
    .footer { background: #f1f5f9; padding: 16px 32px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Backroom</h1>
    <p>Academy Management Platform</p>
  </div>
  <div class="body">
    <p class="greeting">Hi ${fullName},</p>
    <p>Your administrator account has been created for:</p>
    <span class="org-tag">${orgName}</span>

    <p style="font-size:14px;color:#475569;">You can now log in to Backroom using the credentials below. We recommend changing your password immediately after your first login.</p>

    <div class="creds-box">
      <h3>Your Login Credentials</h3>
      <div class="cred-row">
        <span class="cred-label">Login URL</span>
        <span class="cred-value">${appUrl}</span>
      </div>
      <div class="cred-row">
        <span class="cred-label">Email</span>
        <span class="cred-value">${email}</span>
      </div>
      <div class="cred-row">
        <span class="cred-label">Temporary Password</span>
        <span class="cred-value password">${password}</span>
      </div>
    </div>

    <div class="warning">
      <strong>Important — change your password</strong>
      This is a temporary password generated on account creation. Please change it after logging in for the first time.
    </div>

    <a href="${appUrl}/login" class="btn">Log in to Backroom</a>
  </div>
  <div class="footer">
    Backroom Academy Management &nbsp;·&nbsp; This email contains confidential credentials
  </div>
</div>
</body>
</html>`;
  }
}
