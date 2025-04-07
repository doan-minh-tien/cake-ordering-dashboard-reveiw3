export interface ICustomCake {
  id: string;
  total_price: number;
  custom_cake_name: string;
  custom_cake_description: string | null;
  recipe: string | null;
  customer_id: string;
  customer: ICustomer;
  bakery_id: string;
  bakery: IBakery;
  message_selection_id: string;
  message_selection: IMessageSelection;
  part_selections: IPartSelection[];
  extra_selections: IExtraSelection[];
  decoration_selections: IDecorationSelection[];
  order_details: any | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface ICustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  email: string;
  password: string;
  account_type: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface IBakery {
  id: string;
  bakery_name: string;
  email: string;
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
  status: string;
  confirmed_at: string;
  banned_at: string | null;
  shop_image_files: IBakeryImage[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface IBakeryImage {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IMessageSelection {
  id: string;
  text: string | null;
  message: string;
  image_id: string | null;
  image: any | null;
  message_options: IMessageOption[];
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IMessageOption {
  id: string;
  type: string;
  name: string;
  color: string;
  bakery_id: string;
  bakery: any | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface IPartSelection {
  id: string;
  part_type: string;
  custom_cake_id: string;
  custom_cake: ICustomCake | null;
  part_option_id: string;
  part_option: IPartOption | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IPartOption {
  id: string;
  name: string;
  price: number;
  created_at: string;
  created_by: string;
}

export interface IExtraSelection {
  id: string;
  extra_type: string;
  custom_cake_id: string;
  custom_cake: ICustomCake | null;
  extra_option_id: string;
  extra_option: IExtraOption | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IExtraOption {
  name: string;
  price: number;
  id: string;
  created_at: string;
  created_by: string;
}

export interface IDecorationSelection {
  id: string;
  decoration_type: string;
  custom_cake_id: string;
  custom_cake: ICustomCake | null;
  decoration_option_id: string;
  decoration_option: IDecorationOption | null;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

export interface IDecorationOption {
  name: string;
  price: number;
  id: string;
  created_at: string;
  created_by: string;
}
