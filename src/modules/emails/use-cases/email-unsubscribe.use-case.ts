import { UnsubscribeEmailValidator } from "src/validators/unsubscribe-email.validator";
import EmailsRepository, { EmailsRepositoryPort } from "../../../repositories/emails.repository";

interface EmailUnsubscribeUseCaseResponse {
	success: boolean;
}

export interface EmailUnsubscribeUseCaseDTO {
	email: string;
	unsubscribe_token: string;
}

export interface EmailVerifyConfirmEmailTokenUseCasePort {
	execute(payload: EmailUnsubscribeUseCaseDTO): Promise<EmailUnsubscribeUseCaseResponse>;
}

export default class EmailUnsubscribeUseCase implements EmailVerifyConfirmEmailTokenUseCasePort {
	constructor(private readonly emailsRepository: EmailsRepositoryPort = new EmailsRepository()) {}

	async execute(payload: EmailUnsubscribeUseCaseDTO): Promise<EmailUnsubscribeUseCaseResponse> {
		try {
			UnsubscribeEmailValidator.parse(payload);

			const unsubscribed = await this.emailsRepository.unsubscribe({
				...payload,
			});

			if (unsubscribed) return { success: true };

			return { success: false };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
