import { HttpError } from 'wasp/server';

type UpdateOrderStatusInput = {
  orderId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string;
};

export const updateOrderStatus = async (
  args: UpdateOrderStatusInput,
  context: any
): Promise<any> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const { orderId, status, trackingNumber } = args;

  // Get seller profile
  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(404, 'Seller profile not found');
  }

  // Verify that this order contains at least one of the seller's books
  const order = await context.entities.Order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          book: true
        }
      }
    }
  });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Check if seller has any books in this order
  const hasSellerBooks = order.items.some(
    (item: any) => item.book.sellerId === sellerProfile.id
  );

  if (!hasSellerBooks) {
    throw new HttpError(403, 'You can only update orders containing your books');
  }

  // Update order status
  const updateData: any = { status };
  if (trackingNumber !== undefined) {
    updateData.trackingNumber = trackingNumber;
  }

  const updatedOrder = await context.entities.Order.update({
    where: { id: orderId },
    data: updateData
  });

  return updatedOrder;
};
