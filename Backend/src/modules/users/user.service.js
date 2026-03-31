// src/modules/users/user.service.js
import { findOrCreateUser } from "../auth/auth.service.js";
import { getUserById } from "./user.repository.js";

/**
 * Get current authenticated user profile
 * Finds or creates user in DB based on Firebase token
 */
export const getCurrentUser = async (firebaseUid, email) => {
  const user = await findOrCreateUser(firebaseUid, email);
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};

/**
 * Get user by ID from database
 */
export const getUserProfileById = async (userId) => {
  return getUserById(userId);
};

export default {
  getCurrentUser,
  getUserProfileById,
};
