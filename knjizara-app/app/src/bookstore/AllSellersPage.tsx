import { useQuery } from 'wasp/client/operations';
import { getBooks } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../client/contexts/CartContext';

export default function AllSellersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'title'>('newest');
  const [sellerId, setSellerId] = useState<string>('');
  
  // Get seller ID from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sellerParam = params.get('seller');
    if (sellerParam) {
      setSellerId(sellerParam);
    }
  }, []);
  
  const { data, isLoading } = useQuery(getBooks, {
    page,
    limit: 20,
    search: searchQuery,
    categoryId: selectedCategory || undefined,
    sortBy,
    sellerId: sellerId || undefined,
  });

  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  const books = data?.books || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {sellerId ? t('allSellers.sellerListings') : t('allSellers.title')}
        </h1>
        
        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((book: any) => (
            <a
              key={book.id}
              href={`/books/${book.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {book.discountPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                {book.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600">
                      {book.discountPrice.toFixed(2)} {t('common.rsd')}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      {book.price.toFixed(2)} {t('common.rsd')}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-900">
                    {book.price.toFixed(2)} {t('common.rsd')}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prethodna
            </button>
            <span className="px-4 py-2 text-gray-700">
              Strana {page} od {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sledeća
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
