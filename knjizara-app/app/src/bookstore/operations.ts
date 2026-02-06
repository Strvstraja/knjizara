import type { Book, Category, Order } from 'wasp/entities';
import { HttpError } from 'wasp/server';

// Book Operations

type GetBooksInput = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  binding?: string;
  featured?: boolean;
  bestseller?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'title';
  sellerId?: string;
  condition?: string;
  sellerType?: string;
  city?: string;
  status?: string;
};

type GetBooksOutput = {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
};

export const getBooks = async (args: GetBooksInput, context: any): Promise<GetBooksOutput> => {
  const {
    page = 1,
    limit = 20,
    search,
    categoryId,
    minPrice,
    maxPrice,
    binding,
    featured,
    bestseller,
    sortBy = 'newest',
    sellerId,
    condition,
    sellerType,
    city,
    status = 'ACTIVE',
  } = args;

  const skip = (page - 1) * limit;

  const where: any = {
    status: status,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { titleCyrillic: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
      { authorCyrillic: { contains: search, mode: 'insensitive' } },
      { isbn: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categories = {
      some: {
        id: categoryId,
      },
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (binding) {
    where.binding = binding;
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (bestseller !== undefined) {
    where.bestseller = bestseller;
  }

  if (sellerId) {
    where.sellerId = sellerId;
  }

  if (condition) {
    where.condition = condition;
  }

  if (sellerType) {
    where.seller = {
      type: sellerType,
    };
  }

  if (city) {
    where.seller = {
      ...where.seller,
      city: { contains: city, mode: 'insensitive' },
    };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'price_asc') orderBy = { price: 'asc' };
  if (sortBy === 'price_desc') orderBy = { price: 'desc' };
  if (sortBy === 'title') orderBy = { title: 'asc' };

  const [books, total] = await Promise.all([
    context.entities.Book.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        categories: true,
        seller: true,
      },
    }),
    context.entities.Book.count({ where }),
  ]);

  return {
    books,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBook = async ({ id }: { id: string }, context: any): Promise<Book> => {
  const book = await context.entities.Book.findUnique({
    where: { id },
    include: {
      categories: true,
      seller: true,
    },
  });

  if (!book) {
    throw new HttpError(404, 'Book not found');
  }

  return book;
};

type CreateBookInput = {
  title: string;
  titleCyrillic?: string;
  author: string;
  authorCyrillic?: string;
  description: string;
  descriptionCyrillic?: string;
  price: number;
  discountPrice?: number;
  coverImage: string;
  isbn: string;
  pageCount: number;
  binding: 'HARDCOVER' | 'SOFTCOVER';
  publisher: string;
  publishYear: number;
  language: string;
  stock: number;
  featured?: boolean;
  categoryIds?: string[];
};

export const createBook = async (args: CreateBookInput, context: any): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Only admins can create books');
  }

  const { categoryIds, ...bookData } = args;

  const book = await context.entities.Book.create({
    data: {
      ...bookData,
      categories: categoryIds
        ? {
            connect: categoryIds.map((id: string) => ({ id })),
          }
        : undefined,
    },
    include: {
      categories: true,
    },
  });

  return book;
};

type UpdateBookInput = {
  id: string;
  title?: string;
  titleCyrillic?: string;
  author?: string;
  authorCyrillic?: string;
  description?: string;
  descriptionCyrillic?: string;
  price?: number;
  discountPrice?: number;
  coverImage?: string;
  pageCount?: number;
  binding?: 'HARDCOVER' | 'SOFTCOVER';
  publisher?: string;
  publishYear?: number;
  language?: string;
  stock?: number;
  featured?: boolean;
  categoryIds?: string[];
};

export const updateBook = async (args: UpdateBookInput, context: any): Promise<Book> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Only admins can update books');
  }

  const { id, categoryIds, ...updateData } = args;

  const book = await context.entities.Book.update({
    where: { id },
    data: {
      ...updateData,
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((id: string) => ({ id })),
        },
      }),
    },
    include: {
      categories: true,
    },
  });

  return book;
};

export const deleteBook = async ({ id }: { id: string }, context: any): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Only admins can delete books');
  }

  await context.entities.Book.delete({
    where: { id },
  });
};

// Category Operations

export const getCategories = async (_args: void, context: any): Promise<Category[]> => {
  const categories = await context.entities.Category.findMany({
    include: {
      parent: true,
      children: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories;
};

// Order Operations

type CreateOrderInput = {
  addressId: string;
  items: Array<{
    bookId: string;
    quantity: number;
  }>;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CARD';
};

export const createOrder = async (args: CreateOrderInput, context: any): Promise<Order> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { addressId, items, paymentMethod } = args;

  // Verify address belongs to user
  const address = await context.entities.Address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== context.user.id) {
    throw new HttpError(403, 'Invalid address');
  }

  // Get books and calculate totals
  const bookIds = items.map((item: any) => item.bookId);
  const books = await context.entities.Book.findMany({
    where: {
      id: { in: bookIds },
    },
  });

  if (books.length !== items.length) {
    throw new HttpError(400, 'Some books not found');
  }

  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const book = books.find((b: any) => b.id === item.bookId);
    if (!book) throw new HttpError(400, 'Book not found');
    
    const price = book.discountPrice || book.price;
    subtotal += price * item.quantity;

    return {
      bookId: item.bookId,
      quantity: item.quantity,
      price,
    };
  });

  // Calculate shipping (from env or default)
  const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '3000');
  const STANDARD_SHIPPING_COST = parseFloat(process.env.STANDARD_SHIPPING_COST || '350');
  
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;

  const order = await context.entities.Order.create({
    data: {
      userId: context.user.id,
      addressId,
      status: 'PENDING',
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING',
      subtotal,
      shippingCost,
      total,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
      shippingAddress: true,
    },
  });

  return order;
};

export const getUserOrders = async (_args: void, context: any): Promise<Order[]> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const orders = await context.entities.Order.findMany({
    where: {
      userId: context.user.id,
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
      shippingAddress: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};
