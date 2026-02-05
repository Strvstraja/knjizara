import type { SellerProfile } from 'wasp/entities';
import { HttpError } from 'wasp/server';

// Get current user's seller profile
export const getSellerProfile = async (_args: any, context: any): Promise<SellerProfile | null> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id },
    include: {
      user: {
        select: {
          email: true,
          username: true,
        }
      }
    }
  });

  return sellerProfile;
};

// Get public seller profile
type GetPublicSellerProfileInput = {
  sellerId: string;
};

export const getPublicSellerProfile = async (
  args: GetPublicSellerProfileInput,
  context: any
): Promise<SellerProfile> => {
  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { id: args.sellerId },
    include: {
      _count: {
        select: {
          listings: {
            where: { status: 'ACTIVE' }
          }
        }
      }
    }
  });

  if (!sellerProfile) {
    throw new HttpError(404, 'Seller not found');
  }

  return sellerProfile;
};

// Get seller's listings
type GetSellerListingsInput = {
  sellerId: string;
  status?: 'ACTIVE' | 'PAUSED' | 'SOLD' | 'EXPIRED';
  page?: number;
  limit?: number;
};

export const getSellerListings = async (
  args: GetSellerListingsInput,
  context: any
) => {
  const { sellerId, status, page = 1, limit = 20 } = args;
  const skip = (page - 1) * limit;

  const where: any = { sellerId };
  if (status) {
    where.status = status;
  }

  const [books, total] = await Promise.all([
    context.entities.Book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
      }
    }),
    context.entities.Book.count({ where })
  ]);

  return {
    books,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Register as seller
type RegisterAsSellerInput = {
  type: 'PRIVATE' | 'BUSINESS';
  displayName: string;
  phone: string;
  city: string;
  companyName?: string;
  pib?: string;
  address?: string;
  contactEmail?: string;
  website?: string;
};

export const registerAsSeller = async (
  args: RegisterAsSellerInput,
  context: any
): Promise<SellerProfile> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  // Check if user is already a seller
  const existingSeller = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (existingSeller) {
    throw new HttpError(400, 'You are already registered as a seller');
  }

  const sellerProfile = await context.entities.SellerProfile.create({
    data: {
      userId: context.user.id,
      type: args.type,
      displayName: args.displayName,
      phone: args.phone,
      city: args.city,
      companyName: args.companyName,
      pib: args.pib,
      address: args.address,
      contactEmail: args.contactEmail,
      website: args.website,
      isVerified: false, // Manual verification or auto for MVP
    }
  });

  return sellerProfile;
};

// Update seller profile
type UpdateSellerProfileInput = {
  displayName?: string;
  phone?: string;
  city?: string;
  companyName?: string;
  pib?: string;
  address?: string;
  contactEmail?: string;
  website?: string;
  logo?: string;
};

export const updateSellerProfile = async (
  args: UpdateSellerProfileInput,
  context: any
): Promise<SellerProfile> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(404, 'Seller profile not found');
  }

  const updated = await context.entities.SellerProfile.update({
    where: { id: sellerProfile.id },
    data: args
  });

  return updated;
};

// Get seller stats
export const getSellerStats = async (_args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(404, 'Seller profile not found');
  }

  const [totalListings, activeListings, soldListings] = await Promise.all([
    context.entities.Book.count({
      where: { sellerId: sellerProfile.id }
    }),
    context.entities.Book.count({
      where: { sellerId: sellerProfile.id, status: 'ACTIVE' }
    }),
    context.entities.Book.count({
      where: { sellerId: sellerProfile.id, status: 'SOLD' }
    })
  ]);

  return {
    totalListings,
    activeListings,
    soldListings,
    pausedListings: totalListings - activeListings - soldListings,
  };
};
