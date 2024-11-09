import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	errorFormat: "minimal",
	log: process.env.LOG_PRISMA_QUERIES === "true" ? ["query", "info"] : [],
});

export default prisma;
