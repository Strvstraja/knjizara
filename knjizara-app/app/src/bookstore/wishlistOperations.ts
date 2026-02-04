import { HttpError } from 'wasp/server';
import type { WishlistItem } from 'wasp/entities';

export const getUserWishlist = async (_args: void, context: any): Promise<WishlistItem[]> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const wishlistItems = await context.entities.WishlistItem.findMany({
    where: {
      userId: context.user.id,
    },
    include: {
      book: {
        include: {
          categories: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return wishlistItems;
};

export const addToWishlist = async ({ bookId }: { bookId: string }, context: any): Promise<WishlistItem> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  // Check if book exists
  const book = await context.entities.Book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new HttpError(404, 'Book not found');
  }

  // Check if already in wishlist
  const existing = await context.entities.WishlistItem.findUnique({
    where: {
      userId_bookId: {
        userId: context.user.id,
        bookId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  // Add to wishlist
  const wishlistItem = await context.entities.WishlistItem.create({
    data: {
      userId: context.user.id,
      bookId,
    },
    include: {
      book: {
        include: {
          categories: true,
        },
      },
    },
  });

  return wishlistItem;
};

export const removeFromWishlist = async ({ bookId }: { bookId: string }, context: any): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const wishlistItem = await context.entities.WishlistItem.findUnique({
    where: {
      userId_bookId: {
        userId: context.user.id,
        bookId,
      },
    },
  });

  if (!wishlistItem) {
    throw new HttpError(404, 'Item not in wishlist');
  }

  await context.entities.WishlistItem.delete({
    where: {
      id: wishlistItem.id,
    },
  });
};

export const isInWishlist = async ({ bookId }: { bookId: string }, context: any): Promise<boolean> => {
  if (!context.user) {
    return false;
  }

  const wishlistItem = await context.entities.WishlistItem.findUnique({
    where: {
      userId_bookId: {
        userId: context.user.id,
        bookId,
      },
    },
  });

  return !!wishlistItem;
};
