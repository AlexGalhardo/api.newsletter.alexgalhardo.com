import express from "express";
import cors from "cors";
import HealthCheckController from "./modules/health-check/health-check.controller";
import verifyEnvs from "./utils/verify-envs.util";
import EmailController from "./modules/emails/email.controller";
import { sendEmails } from "./utils/send-emails.util";

verifyEnvs();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json({ success: true, message: "API is on, let's gooo!" });
});

app.get("/health-check", HealthCheckController.index);
app.post("/email", EmailController.create);
app.get("/confirm-email/:email/:confirm_email_token", EmailController.verifyConfirmEmailToken);
app.post("/resend-confirm-email-link", EmailController.resendConfirmEmailLink);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		error: err.toString(),
		context: {
			path: req.path,
			method: req.method,
			body: req.body,
		},
	});
});

const PORT = process.env.SERVER_PORT ?? 3000;

if (process.env.NODE_ENV === "production") {
	console.log("...Verificando se é para enviar email... -> ", new Date());
	setInterval(async () => {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const hours = now.getHours();
		const minutes = now.getMinutes();

		if (dayOfWeek >= 0 && dayOfWeek <= 6 && hours === 22 && minutes === 0) {
			await sendEmails();
		}

		if (dayOfWeek >= 0 && dayOfWeek <= 6 && hours === 20 && minutes === 30) {
			await sendEmails();
		}

		if (dayOfWeek >= 0 && dayOfWeek <= 6 && hours === 21 && minutes === 0) {
			await sendEmails();
		}
	}, 60 * 1000);
}

if (process.env.NODE_ENV !== "production") {
	// setInterval(async () => {
	// 	await sendEmails();
	// }, 10 * 1000);
}

app.listen(PORT, () => {
	console.log(`\n\n...🦊 api.newsletter.alexgalhardo.com Server is running at: http://localhost:${PORT}`);
	console.log(`\n\n...🦊 api.newsletter.alexgalhardo.com environment: ${process.env.NODE_ENV}`);
});
