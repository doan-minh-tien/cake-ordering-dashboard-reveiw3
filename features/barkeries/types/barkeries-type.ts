import { create } from "zustand";

interface IBakeryFile {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export type IBarkery = {
  id: string;
  bakery_name: string;
  cake_description: string | null;
  price_description: string | null;
  bakery_description: string | null;
  email: string;
  password: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  bank_account: string | null;
  owner_name: string;
  avatar_file_id: string;
  avatar_file: IBakeryFile;
  identity_card_number: string;
  front_card_file_id: string;
  front_card_file: IBakeryFile;
  back_card_file_id: string;
  back_card_file: IBakeryFile;
  tax_code: string;
  status: string;
  confirmed_at: string | null;
  banned_at: string | null;
  shop_image_files: IBakeryFile[];

  metric: IBakeryMetric;
  reviews: any | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
};

export type IAvatar = {
  fileName: string;
  fileUrl: string;
  id: string;
};

export type IShopImage = {
  fileName: string;
  fileUrl: string;
  id: string;
};

export type IBakeryMetric = {
  bakery_id: string;
  bakery: null;
  total_revenue: number;
  app_revenue: number;
  orders_count: number;
  rating_average: number;
  customers_count: number;
  average_order_value: number;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
};

export type IFile = {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
};
