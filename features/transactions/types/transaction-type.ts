export interface TransactionType {
  wallet_id: string;
  auth: {
    balance: number;
    id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    is_deleted: boolean;
  };
  content: string;
  amount: number;
  transaction_type: string;
  id: string;
  order_target_id: string;
  order_target_code: string;
  target_user_id: string;
  target_user_type: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}

