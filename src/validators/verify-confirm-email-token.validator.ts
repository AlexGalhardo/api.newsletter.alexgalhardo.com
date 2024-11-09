import { z } from "zod";

export const VerifyConfirmEmailTokenValidator = z.object({
	email: z.string().email(),
	confirm_email_token: z.string().min(48).max(48),
});
