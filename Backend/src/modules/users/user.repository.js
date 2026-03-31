// src/modules/users/user.repository.js
import { prisma } from "../../config/prisma.js";

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firebaseUid: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Get user by Firebase UID
 */
export const getUserByFirebaseUid = async (firebaseUid) => {
  return prisma.user.findUnique({
    where: { firebaseUid },
  });
};

export default {
  getUserById,
  getUserByFirebaseUid,
};
