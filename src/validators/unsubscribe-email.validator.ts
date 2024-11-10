import { z } from "zod";

export const UnsubscribeEmailValidator = z.object({
	email: z.string().email(),
	unsubscribe_token: z.string().min(48).max(48),
});
