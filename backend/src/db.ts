import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// talk to postgres
const adapter = new PrismaPg({connectionString : process.env.DATABASE_URL});

export const db = new PrismaClient({adapter});