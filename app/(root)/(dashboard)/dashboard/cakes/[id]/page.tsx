import React from 'react'

import { getCake } from '@/features/cakes/actions/cake-action'
import CakeDetailForm from '@/features/cakes/components/cake-form/cake-detail-form'

const CakeDetailPage = async ({params}: {params: {id: string}}) => {
//   const bakery = await getBakery(params.id);

    const [cakeResponse] = await Promise.all([getCake(params.id)])

  return (
    <div>
        <CakeDetailForm initialData={cakeResponse?.data} />
    </div>
  )
}

export default CakeDetailPage