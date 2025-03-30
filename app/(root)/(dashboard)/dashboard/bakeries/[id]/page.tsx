import React from 'react'

import { getBakery } from '@/features/barkeries/actions/barkeries-action'
import BakeryDetail from '@/features/barkeries/components/bakery-detail/bakery-detail'

const BakeryDetailPage = async ({params}: {params: {id: string}}) => {
//   const bakery = await getBakery(params.id);

    const [bakeryResponse] = await Promise.all([getBakery(params.id)])

  return (
    <div>
        <BakeryDetail bakery={bakeryResponse?.data} />
    </div>
  )
}

export default BakeryDetailPage