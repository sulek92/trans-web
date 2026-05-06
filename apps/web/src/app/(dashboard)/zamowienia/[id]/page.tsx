import { OrderDetailClient } from './order-detail-client';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailClient orderId={params.id} />;
}
