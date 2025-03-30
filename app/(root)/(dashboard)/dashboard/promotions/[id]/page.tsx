import { getPromotion } from '@/features/promotions/action/promotion-action';
import PromotionDetailForm from '@/features/promotions/components/promotion-form/promotion-detail-form';
import React from 'react'


const PromotionDetailPage = async ({params}: {params: {id: string}}) => {

    const [promotionResponse] = await Promise.all([getPromotion(params.id)])

  return (
    <div>
        <PromotionDetailForm initialData={promotionResponse?.data} />
    </div>
  )
}

export default PromotionDetailPage;
