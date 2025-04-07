import { INotification } from "../types/notification-type";

/**
 * Fetches all notifications for the current user
 */
export async function getNotifications(): Promise<INotification[]> {
  try {
    const response = await fetch("/api/notifications");

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

/**
 * Marks all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const response = await fetch("/api/notifications/read-all", {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

/**
 * Gets unread notification count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await fetch("/api/notifications/unread-count");

    if (!response.ok) {
      throw new Error("Failed to fetch unread notification count");
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error;
  }
}
