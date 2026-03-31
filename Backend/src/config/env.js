import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};


if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is missing in .env");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env");
}
