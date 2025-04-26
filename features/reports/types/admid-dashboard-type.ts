



export interface ITopBakeriesType {
    bakery_id: string;  
    bakery: {
        bakery_name: string;
        bakery_image: string;
        bakery_address: string;
        bakery_phone: string;
        bakery_email: string;
        bakery_description: string;
    }
    total_revenue: number;
    app_revenue: number;
    orders_count: number;
    rating_average: number;
    customers_count: number;
    average_order_value: number;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    is_deleted: boolean;
    id: string;
}

