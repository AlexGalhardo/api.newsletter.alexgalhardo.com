import type { Email } from "@prisma/client";
import prisma from "../config/prisma.config";
import GenerateRandomToken from "src/utils/generate-random-token.util";

export interface EmailsRepositoryPort {
	findEmail(email: string): Promise<Email | null>;
	create(dto: { email: string }): Promise<Email | null>;
	updateConfirmEmailToken({ email }: { email: string }): Promise<Email | any>;
	verifyConfirmEmailToken({
		email,
		confirm_email_token,
	}: { email: string; confirm_email_token: string }): Promise<Email | null>;
}

export default class EmailsRepository implements EmailsRepositoryPort {
	private readonly oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

	public async findEmail(email: string): Promise<Email | null> {
		try {
			const userFound = await prisma.email.findUnique({
				where: {
					email,
				},
			});

			if (userFound) return userFound;

			return null;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	public async create({ email }: { email: string }): Promise<Email | null> {
		try {
			return await prisma.email.create({
				data: {
					email,
					confirm_email_token: GenerateRandomToken(),
					confirm_email_token_expires_at: this.oneHourFromNow,
				},
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	public async updateConfirmEmailToken({ email }: { email: string }): Promise<Email | any> {
		try {
			const emailFound = await prisma.email.findUnique({
				where: {
					email,
				},
			});

			if (!emailFound) return { email_not_registered: true };

			if (emailFound?.confirmed_email_at) return { email_already_confirmed: true };

			return await prisma.email.update({
				where: {
					email,
				},
				data: {
					confirm_email_token: GenerateRandomToken(),
					confirm_email_token_expires_at: this.oneHourFromNow,
				},
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	public async verifyConfirmEmailToken({
		email,
		confirm_email_token,
	}: { email: string; confirm_email_token: string }): Promise<Email | null> {
		try {
			const emailFound = await prisma.email.findUnique({
				where: {
					email,
				},
			});

			if (emailFound?.confirmed_email_at) return emailFound;

			if (
				!emailFound?.confirmed_email_at &&
				emailFound?.confirm_email_token === confirm_email_token &&
				emailFound.confirm_email_token_expires_at &&
				emailFound.confirm_email_token_expires_at > new Date()
			) {
				return await prisma.email.update({
					where: {
						email,
					},
					data: {
						confirmed_email_at: new Date(),
					},
				});
			}

			return null;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
