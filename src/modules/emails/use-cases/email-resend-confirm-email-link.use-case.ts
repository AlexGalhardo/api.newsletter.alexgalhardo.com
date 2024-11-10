import EmailsRepository, { EmailsRepositoryPort } from "../../../repositories/emails.repository";
import { EmailValidator } from "src/validators/email.validator";
import resend from "src/config/resend.config";
import { FRONT_END_DNS } from "src/utils/constants.util";

interface EmailResendConfirmEmailLinkUseCaseResponse {
	success: boolean;
	email_already_confirmed?: boolean;
	email_not_registered?: boolean;
	email_deleted?: boolean;
}

export interface EmailResendConfirmEmailLinkUseCaseDTO {
	email: string;
}

export interface EmailResendConfirmEmailLinkUseCasePort {
	execute(payload: EmailResendConfirmEmailLinkUseCaseDTO): Promise<EmailResendConfirmEmailLinkUseCaseResponse>;
}

export default class EmailResendConfirmEmailLinkUseCase implements EmailResendConfirmEmailLinkUseCasePort {
	constructor(private readonly emailsRepository: EmailsRepositoryPort = new EmailsRepository()) {}

	async execute(payload: EmailResendConfirmEmailLinkUseCaseDTO): Promise<EmailResendConfirmEmailLinkUseCaseResponse> {
		try {
			EmailValidator.parse(payload);

			const result = await this.emailsRepository.updateConfirmEmailToken({ email: payload.email });

			if (result?.email_deleted) return { success: false, email_deleted: true };

			if (result?.email_already_confirmed) return { success: false, email_already_confirmed: true };

			if (result?.email && result?.confirm_email_token) {
				try {
					await resend.emails.send({
						from: `hello@${String(process.env.RESEND_EMAIL_FROM_DOMAIN)}`,
						to: result.email,
						subject: "Galhardo Newsletter: Por favor, confirme seu email",
						html: `Por favor, confirme seu email para receber as notícias do Galhardo Newsletter clicando nesse link: <br><br>${FRONT_END_DNS}/confirm-email/${result.email}/${result.confirm_email_token} <br><br>Esse link vai expirar em 1 hora.`,
					});
				} catch (error: any) {
					throw new Error("Error sending email: ", error.message);
				}

				return { success: true };
			}

			return { success: false, email_not_registered: true };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
