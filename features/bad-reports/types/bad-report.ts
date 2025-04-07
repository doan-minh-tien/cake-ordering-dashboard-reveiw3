export interface IBadReport {
  content: string;
  type: string;
  status: string;
  report_files: IReportFile[];
  customer_id: string;
  customer: ICustomer;
  id: string;
  order_id: string;
  order: IOrder;
  bakery_id: string;
  bakery: IBakery;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface IReportFile {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface ICustomer {
  name: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  email: string;
  password: string;
  account_type: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

export interface IOrder {
  total_product_price: number;
  total_customer_paid: number;
  shipping_distance: number;
  discount_amount: number;
  shipping_fee: number;
  shipping_time: number;
  shipping_type: string;
  commission_rate: number;
  app_commission_fee: number;
  shop_revenue: number;
  voucher_code: string;
  order_note: string;
  pickup_time: string;
  payment_type: string;
  canceled_reason: string;
  phone_number: string;
  shipping_address: string;
  latitude: string;
  longitude: string;
  order_status: string;
  cancel_by: string;
  order_code: string;
  paid_at: string;
  order_details: string;
  order_supports: string;
  customer_voucher_id: string;
  customer_voucher: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
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
  bank_account: string;
  owner_name: string;
  avatar_file_id: string;
  identity_card_number: string;
  front_card_file_id: string;
  back_card_file_id: string;
  tax_code: string;
  status: string;
  confirmed_at: string;
  banned_at: string;
  shop_image_files: IShopImageFile[];
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}
export interface IShopImageFile {
  file_name: string;
  file_url: string;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}
