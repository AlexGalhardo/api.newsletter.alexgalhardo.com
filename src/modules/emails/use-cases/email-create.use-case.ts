import TelegramLog from "src/config/telegram-logger.config";
import EmailsRepository, { EmailsRepositoryPort } from "../../../repositories/emails.repository";
import { EmailValidator } from "src/validators/email.validator";
import resend from "src/config/resend.config";
import { FRONT_END_DNS } from "src/utils/constants.util";
import fs from "fs";

interface EmailCreateUseCaseResponse {
	success: boolean;
	email_already_registered?: boolean;
	confirmed_email?: boolean;
	data?: any;
}

export interface EmailCreateUseCaseDTO {
	email: string;
}

export interface EmailCreateUseCasePort {
	execute(emailCreatePayload: EmailCreateUseCaseDTO): Promise<EmailCreateUseCaseResponse>;
}

export default class EmailCreateUseCase implements EmailCreateUseCasePort {
	constructor(private readonly emailsRepository: EmailsRepositoryPort = new EmailsRepository()) {}

	async execute(emailCreatePayload: EmailCreateUseCaseDTO): Promise<EmailCreateUseCaseResponse> {
		try {
			EmailValidator.parse(emailCreatePayload);

			const emailAlreadyRegistered = await this.emailsRepository.findEmail(emailCreatePayload.email);

			if (!emailAlreadyRegistered || emailAlreadyRegistered?.deleted_at) {
				const emailCreated = await this.emailsRepository.create({
					...emailCreatePayload,
				});

				if (emailCreated) {
					if (process.env.USE_TELEGRAM_LOG === "true")
						TelegramLog.info(`\n Email registered\n\n ${JSON.stringify(emailCreated)}\n`);

					try {
						const confirm_email_link = `${FRONT_END_DNS}/confirm-email/${emailCreated.email}/${emailCreated.confirm_email_token}`;

						const htmlTemplate = fs.readFileSync("./src/emails/confirm_email.html", "utf-8");

						const dynamicHtml = htmlTemplate
							.replace("{{confirm_email_link}}", confirm_email_link)
							.replace("{{confirm_email_link}}", confirm_email_link);

						await resend.emails.send({
							from: `hello@${String(process.env.RESEND_EMAIL_FROM_DOMAIN)}`,
							to: emailCreated.email,
							subject: "Galhardo Newsletter: Por favor, confirme seu email",
							html: dynamicHtml,
						});
					} catch (error: any) {
						throw new Error("Error sending email: ", error.message);
					}

					return { success: true, data: emailCreated };
				}
			}

			if (emailAlreadyRegistered?.confirmed_email_at)
				return { success: true, email_already_registered: true, confirmed_email: true };

			return { success: true, email_already_registered: true, confirmed_email: false };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
