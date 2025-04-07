import { INotification } from "../types/notification-type";

/**
 * Fetch all notifications
 */
export async function fetchNotifications(): Promise<INotification[]> {
  try {
    const response = await fetch("/api/notifications");

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

/**
 * Fetch unread notifications count
 */
export async function fetchUnreadNotificationsCount(): Promise<number> {
  try {
    const response = await fetch("/api/notifications/unread");

    if (!response.ok) {
      throw new Error("Failed to fetch unread notifications count");
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return 0;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/read-all", {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}
