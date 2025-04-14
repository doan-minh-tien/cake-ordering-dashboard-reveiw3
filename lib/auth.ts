import { auth } from "@/lib/next-auth/auth";
import { UserRole } from "@/lib/enums/user-role-enum";

export async function getCurrentUser() {
  try {
    const session = await auth();

    // Return null if no session or user
    if (!session || !session.user) {
      return null;
    }

    // Get bakeryId from entity for BAKERY role
    let bakeryId = null;
    if (session.user.role === "BAKERY" && session.user.entity) {
      bakeryId = session.user.entity.id;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      bakeryId,
      avatarUrl: session.user.avatarUrl || null,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
