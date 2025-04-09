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
  updated_at: string | null;
  updated_by: string | null;
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
  updated_at: string | null;
  updated_by: string | null;
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
  canceled_reason: string | null;
  phone_number: string;
  shipping_address: string;
  latitude: string;
  longitude: string;
  order_status: string;
  cancel_by: string | null;
  order_code: string;
  paid_at: string;
  order_details: string | null;
  order_supports: string | null;
  customer_id: string;
  customer: ICustomer;
  bakery_id: string;
  bakery: IBakery;
  transaction: any | null;
  voucher_id: string;
  voucher: any | null;
  customer_voucher_id: string | null;
  customer_voucher: any | null;
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
  updated_at: string | null;
  updated_by: string | null;
  is_deleted: boolean;
}

// Các enum cho bad report
export enum BadReportStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum BadReportPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum BadReportType {
  ORDER_REPORT = "ORDER_REPORT",
  PAYMENT_ISSUE = "PAYMENT_ISSUE",
  DELIVERY_ISSUE = "DELIVERY_ISSUE",
  PRODUCT_ISSUE = "PRODUCT_ISSUE",
  OTHER = "OTHER",
}

// Interface cho response của bad report
export interface IBadReportResponse {
  id: string;
  report_id: string;
  content: string;
  response_by_role: "customer" | "bakery" | "admin";
  response_files?: IReportFile[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

// Thống kê cho admin
export interface IBadReportStatistics {
  total: number;
  by_status: Record<BadReportStatus, number>;
  by_priority: Record<BadReportPriority, number>;
  by_type: Record<BadReportType, number>;
  average_response_time: number; // tính bằng giờ
  average_resolution_time: number; // tính bằng giờ
}

// Response từ API Admin
export interface IAdminBadReportsResponse {
  reports: IBadReport[];
  statistics: IBadReportStatistics;
  available_staff?: IStaffMember[];
  total: number;
  page: number;
  limit: number;
}

// Định nghĩa nhân viên xử lý ticket
export interface IStaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active_reports_count: number;
}

// Params cho các API calls
export interface IGetBadReportsParams {
  page?: number;
  limit?: number;
  status?: BadReportStatus;
  priority?: BadReportPriority;
  type?: BadReportType;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface IUpdateBadReportStatusParams {
  report_id: string;
  status: BadReportStatus;
}

export interface IRespondToBadReportParams {
  report_id: string;
  content: string;
  files?: File[];
}

export interface IAssignBadReportParams {
  report_id: string;
  staff_id: string;
}

export interface IUpdateBadReportPriorityParams {
  report_id: string;
  priority: BadReportPriority;
}
