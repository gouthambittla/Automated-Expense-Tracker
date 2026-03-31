// src/modules/auth/auth.middleware.js
import admin from "firebase-admin";
import { config } from "../../config/env.js";

const hasFirebaseConfig =
  Boolean(config.firebase.projectId) &&
  Boolean(config.firebase.clientEmail) &&
  Boolean(config.firebase.privateKey);

const ensureFirebaseAdmin = () => {
  if (!hasFirebaseConfig) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    );
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
  }
};

/**
 * Middleware to verify Firebase ID token and attach user to request
 * Extracts token from Authorization: Bearer <token> header
 */
export const verifyAuthToken = async (req, res, next) => {
  try {
    ensureFirebaseAdmin();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.slice(7);

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || null,
    };

    next();
  } catch (error) {
    if (error.message.includes("Firebase Admin SDK is not configured")) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

export default verifyAuthToken;
