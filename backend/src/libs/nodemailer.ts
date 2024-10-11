import nodemailer, { Transporter } from 'nodemailer';
import config from "@/configs/env";

class Nodemailer {
  private static instance: Nodemailer;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.pass, // Use app password for Gmail
      },
    });
  }

  public static getInstance(): Nodemailer {
    if (!Nodemailer.instance) {
      Nodemailer.instance = new Nodemailer();
    }
    return Nodemailer.instance;
  }

  public sendMail(to: string, subject: string, html: string, text?: string) {
    const mailOptions = {
      from: config.nodemailer.user,
      to,
      subject,
      text,
      html,
    };
	return this.transporter.sendMail(mailOptions);
  }
}

export default Nodemailer;
