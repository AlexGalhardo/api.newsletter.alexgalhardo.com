import EmailsRepository, { EmailsRepositoryPort } from "../../../repositories/emails.repository";

interface EmailCreateUseCaseResponse {
	success: boolean;
	total_subscribers?: number;
}

export interface EmailCreateUseCasePort {
	execute(): Promise<EmailCreateUseCaseResponse>;
}

export default class EmailGetTotalSubscribersUseCase implements EmailCreateUseCasePort {
	constructor(private readonly emailsRepository: EmailsRepositoryPort = new EmailsRepository()) {}

	async execute(): Promise<EmailCreateUseCaseResponse> {
		try {
			const total_subscribers = await this.emailsRepository.totalSubscribers();

			console.log("total_subscribers -> ", total_subscribers);

			if (total_subscribers) return { success: true, total_subscribers };

			return { success: false };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
