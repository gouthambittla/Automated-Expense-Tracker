// src/modules/auth/auth.service.js
import { prisma } from "../../config/prisma.js";

/**
 * Find or create a user in the database based on Firebase UID
 */
export const findOrCreateUser = async (firebaseUid, email) => {
  let user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid,
        email: email || `user_${firebaseUid}@firebase.local`,
        name: null,
      },
    });

    // Create default system categories for new user
    const defaultCategories = [
      { name: "Food & Dining", icon: "🍽️", color: "#FF6B6B" },
      { name: "Transportation", icon: "🚗", color: "#4ECDC4" },
      { name: "Entertainment", icon: "🎬", color: "#95E1D3" },
      { name: "Utilities", icon: "💡", color: "#F7DC6F" },
      { name: "Shopping", icon: "🛍️", color: "#BB8FCE" },
      { name: "Health & Fitness", icon: "💪", color: "#85C1E2" },
      { name: "Other", icon: "📌", color: "#BDC3C7" },
    ];

    await Promise.all(
      defaultCategories.map((cat) =>
        prisma.category.create({
          data: {
            ...cat,
            userId: user.id,
          },
        }),
      ),
    );
  }

  return user;
};

export default { findOrCreateUser };
