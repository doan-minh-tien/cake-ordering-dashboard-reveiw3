

export interface IPromotion {
    id: string;
    code: string;
    discount_percentage: number;
    min_order_amount: number;
    max_discount_amount: number;
    expiration_date: string;
    quantity: number;
    usage_count: number;
    description: string;
    voucher_type: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}
