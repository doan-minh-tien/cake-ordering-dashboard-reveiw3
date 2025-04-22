export interface ICake {
  id: string;
  available_cake_price: number;
  available_cake_name: string;
  available_cake_description: string;
  available_cake_type: string;
  available_cake_quantity: number;
  available_main_image_id: string;
  available_cake_main_image: string | null;
  available_cake_image_files: ICakeImageFile[];
  bakery_id: string;
  available_cake_size: string | null;
  available_cake_serving_size: string | null;
  has_low_shipping_fee: boolean;
  is_quality_guaranteed: boolean;
  bakery: IBakery | null;
  cake_reviews: any | null;
  metric: any | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface ICakeImageFile {
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
  avatar_file: string | null;
  identity_card_number: string;
  front_card_file_id: string;
  front_card_file: string | null;
  back_card_file_id: string;
  back_card_file: string | null;
  tax_code: string;
  status: string;
  confirmed_at: string | null;
  banned_at: string | null;
  shop_image_files: IShopImageFile[];
  metric: any | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

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
