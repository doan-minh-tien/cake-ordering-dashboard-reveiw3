export enum NotificationSenderType {
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
  BAKERY = "BAKERY",
  CUSTOMER = "CUSTOMER",
}

export enum NotificationType {
  NEW_REPORT = "NEW_REPORT",
  NEW_BAKERY_REGISTRATION = "NEW_BAKERY_REGISTRATION",
}

export interface AdminNotificationType {
  id: string;
  title: string;
  content: string;
  sender_type: NotificationSenderType;
  type: NotificationType;
  is_read: boolean;
  target_entity_id: string;

  // Relationships
  admin_id: string;
  admin: any | null;
  bakery_id: string | null;
  bakery: any | null;
  customer_id: string | null;
  customer: any | null;

  // Audit fields
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}
