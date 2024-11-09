import { z } from "zod";

export const envsLocalValidator = z.object({
	NODE_ENV: z.enum(["local"]),
	SERVER_PORT: z.number().default(3000),
	USE_TELEGRAM_LOG: z.enum(["true", "false"]),
	LOG_PRISMA_QUERIES: z.enum(["true", "false"]),
	DATABASE_URL: z.string().default("postgres://postgres:postgres@localhost:5432/postgres?schema=public"),
	TELEGRAM_BOT_HTTP_TOKEN: z.string(),
	TELEGRAM_BOT_CHANNEL_ID: z.string(),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string().optional(),
	SMTP_PASSWORD: z.string().optional(),
	SMTP_EMAIL_FROM: z.string(),
});
