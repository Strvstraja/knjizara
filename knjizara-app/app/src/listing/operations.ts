import type { Book } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { autoTransliterate } from '../server/transliteration';

// Get my listings
type GetMyListingsInput = {
  status?: 'ACTIVE' | 'PAUSED' | 'SOLD' | 'EXPIRED';
  page?: number;
  limit?: number;
};

export const getMyListings = async (args: GetMyListingsInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    return {
      books: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }

  const { status, page = 1, limit = 20 } = args;
  const skip = (page - 1) * limit;

  const where: any = { sellerId: sellerProfile.id };
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

// Create listing
type CreateListingInput = {
  title: string;
  author: string;
  price: number;
  condition: 'NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
  categoryIds: string[];
  coverImage: string;
  description?: string;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  pageCount?: number;
  binding?: 'HARDCOVER' | 'SOFTCOVER';
  language?: string;
  isNegotiable?: boolean;
  stock?: number;
  images?: string[];
};

export const createListing = async (
  args: CreateListingInput,
  context: any
): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  console.log('DEBUG: context keys:', Object.keys(context));
  console.log('DEBUG: context.entities:', context.entities);
  console.log('DEBUG: context.user:', context.user);

  // Ensure user has seller profile (auto-create if needed)
  let sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    // Auto-create seller profile on first listing
    const user = await context.entities.User.findUnique({
      where: { id: context.user.id },
      select: { email: true, username: true }
    });

    sellerProfile = await context.entities.SellerProfile.create({
      data: {
        userId: context.user.id,
        type: 'PRIVATE',
        displayName: user?.username || user?.email?.split('@')[0] || 'Korisnik',
        phone: '',
        city: '',
        isVerified: false,
      }
    });
  }

  // Auto-transliterate title, author, and description
  const titleTranslit = autoTransliterate(args.title);
  const authorTranslit = autoTransliterate(args.author);
  const descriptionTranslit = autoTransliterate(args.description || '');

  // Create the book listing
  const book = await context.entities.Book.create({
    data: {
      title: titleTranslit.latin,
      titleCyrillic: titleTranslit.cyrillic,
      author: authorTranslit.latin,
      authorCyrillic: authorTranslit.cyrillic,
      price: args.price,
      condition: args.condition,
      coverImage: args.coverImage,
      description: descriptionTranslit.latin || '',
      descriptionCyrillic: descriptionTranslit.cyrillic || '',
      isbn: args.isbn || `USER-${Date.now()}`, // Generate unique ISBN for user listings
      publisher: args.publisher || 'N/A',
      publishYear: args.publishYear || new Date().getFullYear(),
      pageCount: args.pageCount || 0,
      binding: args.binding || 'SOFTCOVER',
      language: args.language || 'Srpski',
      stock: args.stock || 1,
      isNegotiable: args.isNegotiable || false,
      images: args.images || [args.coverImage],
      status: 'ACTIVE',
      sellerId: sellerProfile.id,
      featured: false,
      categories: {
        connect: args.categoryIds.map(id => ({ id }))
      }
    },
    include: {
      categories: true,
      seller: true
    }
  });

  return book;
};

// Update listing
type UpdateListingInput = {
  id: string;
  title?: string;
  author?: string;
  price?: number;
  condition?: 'NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
  categoryIds?: string[];
  coverImage?: string;
  description?: string;
  publisher?: string;
  publishYear?: number;
  pageCount?: number;
  binding?: 'HARDCOVER' | 'SOFTCOVER';
  language?: string;
  isNegotiable?: boolean;
  stock?: number;
  images?: string[];
};

export const updateListing = async (
  args: UpdateListingInput,
  context: any
): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(403, 'You are not a seller');
  }

  const book = await context.entities.Book.findUnique({
    where: { id: args.id }
  });

  if (!book) {
    throw new HttpError(404, 'Listing not found');
  }

  if (book.sellerId !== sellerProfile.id) {
    throw new HttpError(403, 'You can only edit your own listings');
  }

  const { id, categoryIds, title, author, description, stock, ...updateData } = args;

  // Auto-transliterate if title, author, or description are being updated
  const titleTranslit = title ? autoTransliterate(title) : undefined;
  const authorTranslit = author ? autoTransliterate(author) : undefined;
  const descriptionTranslit = description ? autoTransliterate(description) : undefined;

  // If adding stock to a SOLD book, automatically change status to ACTIVE
  const shouldReactivate = book.status === 'SOLD' && stock !== undefined && stock > 0;

  const updated = await context.entities.Book.update({
    where: { id },
    data: {
      ...updateData,
      ...(stock !== undefined && { stock }),
      ...(shouldReactivate && { status: 'ACTIVE' }),
      ...(titleTranslit && {
        title: titleTranslit.latin,
        titleCyrillic: titleTranslit.cyrillic,
      }),
      ...(authorTranslit && {
        author: authorTranslit.latin,
        authorCyrillic: authorTranslit.cyrillic,
      }),
      ...(descriptionTranslit && {
        description: descriptionTranslit.latin,
        descriptionCyrillic: descriptionTranslit.cyrillic,
      }),
      ...(categoryIds && {
        categories: {
          set: categoryIds.map(id => ({ id }))
        }
      })
    },
    include: {
      categories: true,
      seller: true
    }
  });

  return updated;
};

// Delete listing
type DeleteListingInput = {
  id: string;
};

export const deleteListing = async (
  args: DeleteListingInput,
  context: any
): Promise<{ success: boolean }> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const book = await context.entities.Book.findUnique({
    where: { id: args.id },
    include: {
      orderItems: true,
      wishlistItems: true,
      conversations: true,
    }
  });

  if (!book) {
    throw new HttpError(404, 'Listing not found');
  }

  // Check if book has been ordered
  if (book.orderItems && book.orderItems.length > 0) {
    throw new HttpError(400, 'Cannot delete book that has been ordered. Consider marking it as SOLD instead.');
  }

  // Allow admins to delete any book
  if (context.user.isAdmin) {
    // Delete related data first
    if (book.wishlistItems && book.wishlistItems.length > 0) {
      await context.entities.WishlistItem.deleteMany({
        where: { bookId: args.id }
      });
    }
    if (book.conversations && book.conversations.length > 0) {
      // Delete messages in conversations first
      await context.entities.Message.deleteMany({
        where: { 
          conversationId: { 
            in: book.conversations.map((c: any) => c.id) 
          } 
        }
      });
      // Then delete conversations
      await context.entities.Conversation.deleteMany({
        where: { bookId: args.id }
      });
    }
    
    await context.entities.Book.delete({
      where: { id: args.id }
    });
    return { success: true };
  }

  // For non-admins, check seller ownership
  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(403, 'You are not a seller');
  }

  if (book.sellerId !== sellerProfile.id) {
    throw new HttpError(403, 'You can only delete your own listings');
  }

  // Delete related data first
  if (book.wishlistItems && book.wishlistItems.length > 0) {
    await context.entities.WishlistItem.deleteMany({
      where: { bookId: args.id }
    });
  }
  if (book.conversations && book.conversations.length > 0) {
    // Delete messages in conversations first
    await context.entities.Message.deleteMany({
      where: { 
        conversationId: { 
          in: book.conversations.map((c: any) => c.id) 
        } 
      }
    });
    // Then delete conversations
    await context.entities.Conversation.deleteMany({
      where: { bookId: args.id }
    });
  }

  await context.entities.Book.delete({
    where: { id: args.id }
  });

  return { success: true };
};

// Pause/Unpause listing
type ToggleListingStatusInput = {
  id: string;
  status: 'ACTIVE' | 'PAUSED';
};

export const toggleListingStatus = async (
  args: ToggleListingStatusInput,
  context: any
): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(403, 'You are not a seller');
  }

  const book = await context.entities.Book.findUnique({
    where: { id: args.id }
  });

  if (!book) {
    throw new HttpError(404, 'Listing not found');
  }

  if (book.sellerId !== sellerProfile.id) {
    throw new HttpError(403, 'You can only modify your own listings');
  }

  const updated = await context.entities.Book.update({
    where: { id: args.id },
    data: { status: args.status },
    include: {
      categories: true,
      seller: true
    }
  });

  return updated;
};

// Mark as sold
type MarkAsSoldInput = {
  id: string;
};

export const markAsSold = async (
  args: MarkAsSoldInput,
  context: any
): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  const sellerProfile = await context.entities.SellerProfile.findUnique({
    where: { userId: context.user.id }
  });

  if (!sellerProfile) {
    throw new HttpError(403, 'You are not a seller');
  }

  const book = await context.entities.Book.findUnique({
    where: { id: args.id }
  });

  if (!book) {
    throw new HttpError(404, 'Listing not found');
  }

  if (book.sellerId !== sellerProfile.id) {
    throw new HttpError(403, 'You can only modify your own listings');
  }

  const updated = await context.entities.Book.update({
    where: { id: args.id },
    data: { 
      status: 'SOLD',
      stock: 0
    },
    include: {
      categories: true,
      seller: true
    }
  });

  return updated;
};

// Toggle featured (izdvajamo)
type ToggleFeaturedInput = {
  id: string;
  featured: boolean;
};

export const toggleFeatured = async (
  args: ToggleFeaturedInput,
  context: any
): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Only admins can mark books as featured');
  }

  const book = await context.entities.Book.findUnique({
    where: { id: args.id }
  });

  if (!book) {
    throw new HttpError(404, 'Book not found');
  }

  const updated = await context.entities.Book.update({
    where: { id: args.id },
    data: { featured: args.featured },
    include: {
      categories: true,
      seller: true
    }
  });

  return updated;
};
