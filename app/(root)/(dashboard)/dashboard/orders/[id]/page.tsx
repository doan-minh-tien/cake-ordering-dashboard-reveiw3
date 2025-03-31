import React from 'react'

import { getOrder } from '@/features/orders/actions/order-action'
import OrderDetailComponent from '@/features/orders/components/order-detail/order-detail-component'

const OrderDetailPage = async ({params}: {params: {id: string}}) => {
//   const bakery = await getBakery(params.id);

    const [orderResponse] = await Promise.all([getOrder(params.id)])

  return (
    <div>
        <OrderDetailComponent order={orderResponse?.data} />
    </div>
  )
}

export default OrderDetailPage