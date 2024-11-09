import { envsLocalValidator } from "src/validators/envs-local.validator";
import { envsProductionValidator } from "src/validators/envs-production.validator";

export default function verifyEnvs() {
	if (process.env.NODE_ENV === "local") {
		const envLocalVariables = {
			NODE_ENV: process.env.NODE_ENV,
			SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
			USE_TELEGRAM_LOG: process.env.USE_TELEGRAM_LOG,
			LOG_PRISMA_QUERIES: process.env.LOG_PRISMA_QUERIES,
			DATABASE_URL: process.env.DATABASE_URL,
			TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: process.env.SMTP_HOST,
			SMTP_PORT: process.env.SMTP_PORT,
			SMTP_USER: process.env.SMTP_USER,
			SMTP_PASSWORD: process.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
		};

		const validationResult = envsLocalValidator.safeParse(envLocalVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente LOCAL esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	} else if (process.env.NODE_ENV === "production") {
		const envProductionVariables = {
			NODE_ENV: process.env.NODE_ENV,
			SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
			USE_TELEGRAM_LOG: process.env.USE_TELEGRAM_LOG,
			LOG_PRISMA_QUERIES: process.env.LOG_PRISMA_QUERIES,
			DATABASE_URL: process.env.DATABASE_URL,
			TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: process.env.SMTP_HOST,
			SMTP_PORT: process.env.SMTP_PORT,
			SMTP_USER: process.env.SMTP_USER,
			SMTP_PASSWORD: process.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
		};

		const validationResult = envsProductionValidator.safeParse(envProductionVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente PRODUCTION esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	}
}
