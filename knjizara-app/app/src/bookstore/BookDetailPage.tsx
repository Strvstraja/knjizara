import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getBook, isInWishlist, addToWishlist, removeFromWishlist } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useTranslation } from 'react-i18next';
import { useCart } from '../client/contexts/CartContext';
import { useState } from 'react';
import { Check, Heart, MapPin, Phone, Store, User } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';

export default function BookDetailPage() {
  const { t } = useTranslation();
  const { data: user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useQuery(getBook, { id: id! });
  const { data: inWishlist, refetch: refetchWishlist } = useQuery(isInWishlist, { bookId: id! }, { enabled: !!user && !!id });
  const { addToCart, isInCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'NEW': return 'bg-green-100 text-green-800';
      case 'LIKE_NEW': return 'bg-teal-100 text-teal-800';
      case 'VERY_GOOD': return 'bg-blue-100 text-blue-800';
      case 'GOOD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'NEW': return t('listing.conditionNew');
      case 'LIKE_NEW': return t('listing.conditionLikeNew');
      case 'VERY_GOOD': return t('listing.conditionVeryGood');
      case 'GOOD': return t('listing.conditionGood');
      default: return t('listing.conditionAcceptable');
    }
  };

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user || !book) return;
    
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist({ bookId: book.id });
      } else {
        await addToWishlist({ bookId: book.id });
      }
      await refetchWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('bookDetail.notFound')}</h1>
          <Link to="/books" className="text-blue-600 hover:underline">
            {t('bookDetail.backToCatalog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/books" className="text-blue-600 hover:underline mb-6 inline-block">
          ← {t('bookDetail.backToCatalog')}
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Book Cover */}
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Book Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{book.author}</p>

              {/* Condition Badge */}
              {book.condition && (
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getConditionStyle(book.condition)}`}>
                    {getConditionLabel(book.condition)}
                  </span>
                  {book.isNegotiable && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({t('listing.negotiable')})
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {book.discountPrice ? (
                  <>
                    {(() => {
                      const discountPercent = Math.round(((book.price - book.discountPrice) / book.price) * 100);
                      return (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-red-600">
                            {book.discountPrice.toFixed(2)} {t('common.rsd')}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            {book.price.toFixed(2)} {t('common.rsd')}
                          </span>
                          <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                            -{discountPercent}%
                          </span>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {book.price.toFixed(2)} {t('common.rsd')}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {book.stock > 0 ? (
                  <p className="text-green-600 font-semibold">✓ {t('bookDetail.inStock', { count: book.stock })}</p>
                ) : (
                  <p className="text-red-600 font-semibold">{t('books.outOfStock')}</p>
                )}
              </div>

              {/* Add to Cart and Wishlist Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {showAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      {t('bookDetail.addedToCart')}
                    </>
                  ) : (
                    book.stock > 0 ? t('books.addToCart') : t('books.outOfStock')
                  )}
                </button>
                {user && (
                  <button
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    className={`p-3 rounded-lg font-semibold transition-colors ${
                      inWishlist
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50`}
                    title={inWishlist ? t('wishlist.removedFromWishlist') : t('wishlist.addedToWishlist')}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              {isInCart(book.id) && !showAdded && (
                <p className="text-sm text-green-600 text-center mb-4">
                  ✓ {t('bookDetail.alreadyInCart')}
                </p>
              )}

              {/* Specifications */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('bookDetail.specifications')}</h2>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.isbn')}:</dt>
                    <dd className="text-gray-900 font-medium">{book.isbn}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.pageCount')}:</dt>
                    <dd className="text-gray-900 font-medium">{book.pageCount}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.binding')}:</dt>
                    <dd className="text-gray-900 font-medium">
                      {book.binding === 'HARDCOVER' ? t('bookDetail.hardcover') : t('bookDetail.softcover')}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.publisher')}:</dt>
                    <dd className="text-gray-900 font-medium">{book.publisher}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.year')}:</dt>
                    <dd className="text-gray-900 font-medium">{book.publishYear}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">{t('bookDetail.language')}:</dt>
                    <dd className="text-gray-900 font-medium">{book.language}</dd>
                  </div>
                </dl>
              </div>

              {/* Categories */}
              {(book as any).categories && (book as any).categories.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('bookDetail.categories')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {(book as any).categories.map((category: any) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Info Card */}
              {(book as any).seller && (book as any).seller.displayName && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Prodavac</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {(book as any).seller.type === 'BUSINESS' ? (
                        <Store className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="font-semibold text-gray-900">
                        {(book as any).seller.displayName}
                      </span>
                    </div>
                    
                    {(book as any).seller.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{(book as any).seller.city}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <a
                        href={`/all-sellers?seller=${(book as any).seller.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Pogledaj sve oglase prodavca →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('bookDetail.description')}</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
