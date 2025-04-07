export type SenderType = "SYSTEM" | "USER" | "BAKERY" | "ADMIN";
export type NotificationType =
  | "NEW_ORDER"
  | "ORDER_CONFIRMATION"
  | "ORDER_CANCELLATION"
  | "PAYMENT_CONFIRMATION"
  | "DELIVERY_STATUS";
export type BakeryStatus = "PENDING" | "CONFIRMED" | "BANNED";

export interface IShopImageFile {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IBakery {
  bakery_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  bank_account: string | null;
  owner_name: string;
  avatar_file_id: string;
  avatar_file: any | null;
  identity_card_number: string;
  front_card_file_id: string;
  front_card_file: any | null;
  back_card_file_id: string;
  back_card_file: any | null;
  tax_code: string;
  status: BakeryStatus;
  confirmed_at: string;
  banned_at: string | null;
  shop_image_files: IShopImageFile[];
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface ICustomer {
  id: string;
  // Add customer properties when available
}

export interface INotification {
  title: string;
  content: string;
  sender_type: SenderType;
  type: NotificationType;
  is_read: boolean;
  target_entity_id: string;
  bakery_id: string;
  bakery: IBakery | null;
  customer_id: string | null;
  customer: ICustomer | null;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}
