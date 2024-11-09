import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const seedDatabase = async () => {
	await prisma.email.deleteMany({});

	await prisma.email.createMany({
		data: [
			{
				email: "aleexgvieira@gmail.com"
			},
		],
		skipDuplicates: true,
	});
};

seedDatabase();
