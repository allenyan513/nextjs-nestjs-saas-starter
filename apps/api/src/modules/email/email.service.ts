import { Injectable, Logger } from '@nestjs/common';
import { CreateEmailOptions, Resend } from 'resend';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');
  private resend: Resend | null = null;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    if (!process.env.RESEND_API_KEY) {
      this.logger.warn('RESEND_API_KEY is not set in environment variables');
    } else {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  async send(createEmailOption: CreateEmailOptions) {
    try {
      if (!this.resend) {
        this.logger.warn('Resend client is not initialized');
        return;
      }
      return await this.resend.emails.send(createEmailOption);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
