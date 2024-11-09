import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import HealthCheckController from "./modules/health-check/health-check.controller";
import verifyEnvs from "./utils/verify-envs.util";
import { cors } from "@elysiajs/cors";
import EmailController from "./modules/emails/email.controller";

verifyEnvs();

export const app = new Elysia()
	.use(cors())
	.use(
		swagger({
			documentation: {
				info: {
					title: "Galhardo Newsletter API Documentation",
					version: "3.0.0",
				},
			},
		}),
	)
	.onError((context) => {
		return {
			success: false,
			error: context.error.toString(),
			context: context,
		};
	})
	.get("/", () => ({ success: true, message: "API is on, lets gooo!" }))
	.get("/health-check", HealthCheckController.index)
	.post("/email", EmailController.create)
	.get("/confirm-email/:email/:confirm_email_token", EmailController.verifyConfirmEmailToken)
	.post("/resend-confirm-email-link", EmailController.resendConfirmEmailLink)
	.listen(Bun.env.SERVER_PORT ?? 3000);

export const serverDNS = `${app.server?.hostname}:${app.server?.port}`;

console.log(`\n\n...🦊 api.newsletter.alexgalhardo.com Server is running at: http://${serverDNS}`);

console.log(`\n\n...🦊 api.newsletter.alexgalhardo.com environment: ${Bun.env.NODE_ENV}`);

export type App = typeof app;
