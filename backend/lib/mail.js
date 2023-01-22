const { SMTPClient } = require('emailjs');
const ejs = require('ejs');

const smtp = {
	host: process.env.SMTP_HOST || "",
	port: Number(process.env.SMTP_PORT) || 25,
	user: process.env.SMTP_USER || "",
	password: process.env.SMTP_PASSWORD || "",
	ssl: process.env.SMTP_SSL ? true : false,
	tls: process.env.SMTP_TLS ? true : false,
}
const client = new SMTPClient(smtp);

export class MailService {
	static get client() {
		return client
	}

	static async SendMail(content, email, { text = "", subject = "" }) {
		const message = {
			text: text,
			from: smtp.user,
			to: email,
			subject: subject || "No Subject",
			attachment: { data: content, alternative: true },
		}
		client.send(message, (error) => {
			if (error)
				return logger.error(error)
			logger.log(`[${email}]:${message.subject}`)
		})
		if (process.env.DEV_MODE)
			this.SaveMail(message)
	}
	static async SendMailTemplate(templatePath, email, data, { text = "", subject = "" }) {
		const content = await ejs.renderFile(templatePath, { ...data })
		await this.SendMail(content, email, { text, subject })
	}

	static async SendUserMessage(user, message) {
		await this.SendMailTemplate('./assets/mail/user_message_mail.html', user.email, { user, message }, {})
	}
}