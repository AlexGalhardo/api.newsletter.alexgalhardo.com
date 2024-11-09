import { z } from "zod";

export const envsProductionValidator = z.object({
	NODE_ENV: z.enum(["production"]),
	SERVER_PORT: z.number().default(3000),
	USE_TELEGRAM_LOG: z.enum(["true", "false"]),
	LOG_PRISMA_QUERIES: z.enum(["true", "false"]),
	DATABASE_URL: z.string(),
	TELEGRAM_BOT_HTTP_TOKEN: z.string(),
	TELEGRAM_BOT_CHANNEL_ID: z.string(),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string(),
	SMTP_PASSWORD: z.string(),
	SMTP_EMAIL_FROM: z.string(),
});
