import EmailsRepository, { EmailsRepositoryPort } from "../../../repositories/emails.repository";
import { VerifyConfirmEmailTokenValidator } from "src/validators/verify-confirm-email-token.validator";

interface EmailVerifyConfirmEmailTokenUseCaseResponse {
	success: boolean;
	error?: string;
	data?: any;
}

export interface EmailVerifyConfirmEmailTokenUseCaseDTO {
	email: string;
	confirm_email_token: string;
}

export interface EmailVerifyConfirmEmailTokenUseCasePort {
	execute(
		verifyConfirmEmailTokenPayload: EmailVerifyConfirmEmailTokenUseCaseDTO,
	): Promise<EmailVerifyConfirmEmailTokenUseCaseResponse>;
}

export default class EmailVerifyConfirmEmailTokenUseCase implements EmailVerifyConfirmEmailTokenUseCasePort {
	constructor(private readonly emailsRepository: EmailsRepositoryPort = new EmailsRepository()) {}

	async execute(
		verifyConfirmEmailTokenPayload: EmailVerifyConfirmEmailTokenUseCaseDTO,
	): Promise<EmailVerifyConfirmEmailTokenUseCaseResponse> {
		try {
			VerifyConfirmEmailTokenValidator.parse(verifyConfirmEmailTokenPayload);

			const confirmedEmail = await this.emailsRepository.verifyConfirmEmailToken({
				...verifyConfirmEmailTokenPayload,
			});

			if (confirmedEmail) return { success: true, data: confirmedEmail };

			return { success: false };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
