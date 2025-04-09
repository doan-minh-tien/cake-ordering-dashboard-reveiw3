import { ICustomer } from "@/features/notifications/types/notification-type";
// Only import ICustomerType from one location to avoid conflicts
import { ICustomerType } from "@/features/orders/types/order-type";

export interface IBadReport {
  content: string;
  type: string;
  status: string;
  report_files: string[];
  customer_id: string;
  customer: ICustomerType;
  order_id: string | null;
  order: any | null;
  bakery_id: string;
  bakery: IBakeryType;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IBakeryType {
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
  avatar_file: string | null;
  identity_card_number: string;
  front_card_file_id: string;
  front_card_file: string | null;
  back_card_file_id: string;
  back_card_file: string | null;
  tax_code: string;
  status: string;
  confirmed_at: string;
  banned_at: string | null;
  shop_image_files: IBakeryImageFile[];
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IBakeryImageFile {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

// Using the existing ICustomerType from orders/types/order-type.ts
