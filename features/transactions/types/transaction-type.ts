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
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_deleted: boolean;
}
