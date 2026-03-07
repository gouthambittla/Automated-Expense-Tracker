import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  JWT_SECRET: z.string().min(1).default("replace-me"),
  DATABASE_URL: z.string().min(1).default("postgresql://user:password@localhost:5432/expense_tracker")
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsedEnv.NODE_ENV,
  port: parsedEnv.PORT,
  jwtSecret: parsedEnv.JWT_SECRET,
  databaseUrl: parsedEnv.DATABASE_URL
};
