import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateMailOutput } from './dto/create-mail.input';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    console.log(mailerService);
  }

  async sendMail(email, subject, code, username): Promise<CreateMailOutput> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'noreply@advisotechindia.com',
        subject: subject,
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code,
          username,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
