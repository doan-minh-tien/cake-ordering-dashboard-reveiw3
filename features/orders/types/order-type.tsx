export interface IOrder {
  id: string;
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
  created_at: string;
  order_details: IOrderDetail[];
  order_supports: IOrderSupport[];
  customer_id: string;
  customer: ICustomerType;
  bakery_id: string;
  voucher_id: string;
  customer_voucher_id: string;
  transaction: null;
  voucher: null;
  bakery: IBakeryType;
}

export interface ICustomerType {
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
}

export interface IOrderDetail {
  order_id: string;
  order: null;
  available_cake_id: null;
  available_cake: null;
  cake_note: string;
  sub_total_price: number;
  quantity: number;
  cake_review_id: null;
  cake_review: null;
  custom_cake_id: string;
  custom_cake: null;
  id: string;
}

export interface IOrderSupport {
  content: string;
  file_id: string;
  file: null;
  bakery_id: string;
  bakery: null;
  customer_id: string;
  customer: null;
  order_id: string;
  order: null;
  id: string;
  created_at: string;
  created_by: string;
  updated_at: null;
  updated_by: null;
}

export interface IBakeryType {
  bakery_name: string;
  cake_description: string;
  price_description: string;
  bakery_description: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  bank_account: string;
  owner_name: string;
  avatar_file_id: string;
  avatar_file: string;
  identity_card_number: string;
  front_card_file_id: string;
  front_card_file: string;
  back_card_file_id: string;
  back_card_file: string;
  food_safety_certificate_file_id: string;
  food_safety_certificate_file: string;
  business_license_file_id: string;
  business_license_file: string;
  tax_code: string;
  status: string;
  confirmed_at: string;
  banned_at: string;
  open_time: string;
  close_time: string;
  shop_image_files: IShopImageFile[];
  metric: null;
  reviews: null;
  distance_to_user: null;
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
