import { Request, Response } from "express";
import EmailCreateUseCase from "./use-cases/email-create.use-case";
import EmailResendConfirmEmailLinkUseCase from "./use-cases/email-resend-confirm-email-link.use-case";
import EmailVerifyConfirmEmailTokenUseCase from "./use-cases/email-verify-confirm-email-token.use-case";

export default class EmailController {
	static async create(req: Request, res: Response) {
		try {
			const { success, ...rest } = await new EmailCreateUseCase().execute({ email: req.body.email });
			return res.status(200).json({ success, ...rest });
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				error: error.issues ?? error.message,
			});
		}
	}

	static async verifyConfirmEmailToken(req: Request, res: Response) {
		try {
			const { success, ...rest } = await new EmailVerifyConfirmEmailTokenUseCase().execute({
				email: req.params.email,
				confirm_email_token: req.params.confirm_email_token,
			});
			return res.status(200).json({ success, ...rest });
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				error: error.issues ?? error.message,
			});
		}
	}

	static async resendConfirmEmailLink(req: Request, res: Response) {
		try {
			const { success, ...rest } = await new EmailResendConfirmEmailLinkUseCase().execute({
				email: req.body.email,
			});
			return res.status(200).json({ success, ...rest });
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				error: error.issues ?? error.message,
			});
		}
	}
}
