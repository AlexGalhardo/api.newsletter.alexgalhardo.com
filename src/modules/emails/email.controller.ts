import EmailCreateUseCase from "./use-cases/email-create.use-case";
import EmailResendConfirmEmailLinkUseCase from "./use-cases/email-resend-confirm-email-link.use-case";
import EmailVerifyConfirmEmailTokenUseCase from "./use-cases/email-verify-confirm-email-token.use-case";

export default class EmailController {
	static async create({ body, set }) {
		try {
			const { success, ...rest } = await new EmailCreateUseCase().execute({ email: body.email });
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async verifyConfirmEmailToken({ params, set }) {
		try {
			const { success, ...rest } = await new EmailVerifyConfirmEmailTokenUseCase().execute({
				email: params.email,
				confirm_email_token: params.confirm_email_token,
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async resendConfirmEmailLink({ body, set }) {
		try {
			const { success, ...response } = await new EmailResendConfirmEmailLinkUseCase().execute({
				email: body.email,
			});
			return { success, ...response };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}
}
