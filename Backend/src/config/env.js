import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  isDevelopment: nodeEnv === "development",
};

// Validate required env vars
const requiredVars = [
  "DATABASE_URL",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    if (config.isDevelopment) {
      console.warn(`Warning: Missing environment variable: ${varName}`);
    } else {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
});
