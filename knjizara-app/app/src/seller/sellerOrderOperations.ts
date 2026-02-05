import { HttpError } from 'wasp/server';
import type { Order, OrderItem, Book, User, Address } from 'wasp/entities';

type GetSellerOrdersInput = {
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  page?: number;
  limit?: number;
};

type GetSellerOrdersOutput = {
  orders: any[];
  total: number;
  page: number;
  totalPages: number;
};

export const getSellerOrders = async (
  args: GetSellerOrdersInput,
  context: any
): Promise<GetSellerOrdersOutput> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(404, 'Seller profile not found. You must be a seller to view orders.');
  }

  const { status, page = 1, limit = 20 } = args;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    items: {
      some: {
        book: {
          sellerId: sellerProfile.id
        }
      }
    }
  };

  if (status) {
    where.status = status;
  }

  // Fetch orders and total count
  const [orders, total] = await Promise.all([
    context.entities.Order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            username: true
          }
        },
        shippingAddress: true,
        items: {
          where: {
            book: {
              sellerId: sellerProfile.id
            }
          },
          include: {
            book: true
          }
        }
      }
    }),
    context.entities.Order.count({ where })
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};
