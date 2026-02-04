import { useQuery } from 'wasp/client/operations';
import { getUserWishlist, removeFromWishlist } from 'wasp/client/operations';
import { useTranslation } from 'react-i18next';
import { Link } from 'wasp/client/router';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../client/contexts/CartContext';
import { useState } from 'react';

export default function WishlistPage() {
  const { t } = useTranslation();
  const { data: wishlistItems, isLoading, refetch } = useQuery(getUserWishlist);
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (bookId: string) => {
    setRemovingId(bookId);
    try {
      await removeFromWishlist({ bookId });
      await refetch();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (book: any) => {
    addToCart(book);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('wishlist.title')}</h1>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('wishlist.empty')}</h2>
            <p className="text-gray-600 mb-6">{t('wishlist.emptyMessage')}</p>
            <Link
              to="/books"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('wishlist.browseBooks')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {wishlistItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group relative">
                <Link to={`/books/${item.book.id}` as any}>
                  <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.book.discountPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{Math.round(((item.book.price - item.book.discountPrice) / item.book.price) * 100)}%
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/books/${item.book.id}` as any}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {item.book.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          {item.book.discountPrice.toFixed(2)} {t('common.rsd')}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.book.price.toFixed(2)} {t('common.rsd')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {item.book.price.toFixed(2)} {t('common.rsd')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {item.book.stock > 0 ? (
                      <button
                        onClick={() => handleAddToCart(item.book)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('wishlist.addToCart')}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-400 text-white px-3 py-2 rounded text-sm font-semibold cursor-not-allowed"
                      >
                        {t('books.outOfStock')}
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.book.id)}
                      disabled={removingId === item.book.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title={t('wishlist.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
