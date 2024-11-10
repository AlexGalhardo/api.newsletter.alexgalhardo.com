import type { Email } from "@prisma/client";
import prisma from "../config/prisma.config";
import GenerateRandomToken from "src/utils/generate-random-token.util";

export interface EmailsRepositoryPort {
	totalSubscribers(): Promise<number | null>;
	findEmail(email: string): Promise<Email | null>;
	create(payload: { email: string }): Promise<Email | null>;
	updateConfirmEmailToken({ email }: { email: string }): Promise<Email | any>;
	verifyConfirmEmailToken({
		email,
		confirm_email_token,
	}: { email: string; confirm_email_token: string }): Promise<Email | null>;
	unsubscribe({ email, unsubscribe_token }: { email: string; unsubscribe_token: string }): Promise<Email | null>;
}

export default class EmailsRepository implements EmailsRepositoryPort {
	private readonly oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

	public async totalSubscribers(): Promise<number | null> {
		try {
			return await prisma.email.count({
				where: {
					confirmed_email_at: {
						not: null,
					},
					deleted_at: null,
				},
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

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
			const emailDeleted = await prisma.email.findUnique({
				where: {
					email,
					deleted_at: {
						not: null,
					},
				},
			});

			if (emailDeleted) {
				return await prisma.email.update({
					where: {
						email,
					},
					data: {
						confirm_email_token: GenerateRandomToken(),
						confirm_email_token_expires_at: this.oneHourFromNow,
						unsubscribe_token: GenerateRandomToken(),
						confirmed_email_at: null,
						deleted_at: null,
					},
				});
			}

			return await prisma.email.create({
				data: {
					email,
					confirm_email_token: GenerateRandomToken(),
					confirm_email_token_expires_at: this.oneHourFromNow,
					unsubscribe_token: GenerateRandomToken(),
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

			if (emailFound?.deleted_at) return { email_deleted: true };

			if (emailFound?.confirmed_email_at && !emailFound?.deleted_at) return { email_already_confirmed: true };

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

	public async unsubscribe({
		email,
		unsubscribe_token,
	}: { email: string; unsubscribe_token: string }): Promise<Email | null> {
		try {
			return await prisma.email.update({
				where: {
					email,
					unsubscribe_token,
				},
				data: {
					deleted_at: new Date(),
				},
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
