import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getBooks, getCategories, getUserWishlist, addToWishlist, removeFromWishlist } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import { useTranslation } from 'react-i18next';
import { useCart } from '../client/contexts/CartContext';
import { ShoppingCart, Check, Heart, Filter, X } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';
import FilterSidebar from './components/FilterSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../client/components/ui/sheet';

export default function BooksPage() {
  const { t, i18n } = useTranslation();
  const { data: user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'title'>('newest');
  const [condition, setCondition] = useState<string | undefined>();
  const [sellerType, setSellerType] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [addedBookId, setAddedBookId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { addToCart } = useCart();
  const { data: wishlistItems, refetch: refetchWishlist } = useQuery(getUserWishlist, undefined, { enabled: !!user });

  const { data: booksData, isLoading: booksLoading } = useQuery(getBooks, {
    page,
    limit: 20,
    search: search || undefined,
    categoryId,
    sortBy,
    condition,
    sellerType,
    minPrice,
    maxPrice,
  });

  const { data: categories } = useQuery(getCategories);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleQuickAdd = (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    setAddedBookId(book.id);
    setTimeout(() => setAddedBookId(null), 1500);
  };

  const isInWishlist = (bookId: string) => {
    if (!wishlistItems) return false;
    return wishlistItems.some((item: any) => item.bookId === bookId);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    setWishlistLoading(bookId);
    try {
      if (isInWishlist(bookId)) {
        await removeFromWishlist({ bookId });
      } else {
        await addToWishlist({ bookId });
      }
      await refetchWishlist();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(null);
    }
  };

  const handleClearFilters = () => {
    setCategoryId(undefined);
    setCondition(undefined);
    setSellerType(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  const getActiveFilters = () => {
    const filters: Array<{ label: string; onRemove: () => void }> = [];
    const isCyrillic = i18n.language === 'sr-Cyrl';
    
    if (categoryId) {
      const category = categories?.find(c => c.id === categoryId);
      if (category) {
        filters.push({
          label: isCyrillic ? category.nameCyrillic : category.name,
          onRemove: () => setCategoryId(undefined)
        });
      }
    }
    
    if (condition) {
      const conditionLabels: Record<string, string> = {
        'NEW': t('books.conditionNew'),
        'LIKE_NEW': t('books.conditionLikeNew'),
        'VERY_GOOD': t('books.conditionVeryGood'),
        'GOOD': t('books.conditionGood'),
        'ACCEPTABLE': t('books.conditionAcceptable')
      };
      filters.push({
        label: conditionLabels[condition],
        onRemove: () => setCondition(undefined)
      });
    }
    
    if (sellerType) {
      filters.push({
        label: sellerType === 'PRIVATE' ? t('books.sellerPrivate') : t('books.sellerBusiness'),
        onRemove: () => setSellerType(undefined)
      });
    }
    
    if (minPrice || maxPrice) {
      filters.push({
        label: `${minPrice || 0} - ${maxPrice || '∞'} RSD`,
        onRemove: () => {
          setMinPrice(undefined);
          setMaxPrice(undefined);
        }
      });
    }
    
    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">{t('books.title')}</h1>

        {/* Search bar - full width */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t('books.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('books.searchButton')}
            </button>
          </div>
        </form>

        {/* Mobile filter button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden flex items-center gap-2 border border-input rounded-lg px-4 py-2 mb-4 bg-card text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              {t('books.filters')}
              {activeFilters.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('books.filters')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSidebar
                sortBy={sortBy}
                setSortBy={setSortBy}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                condition={condition}
                setCondition={setCondition}
                sellerType={sellerType}
                setSellerType={setSellerType}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                categories={categories}
                onClearFilters={handleClearFilters}
                setPage={setPage}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content: sidebar + grid */}
        <div className="flex gap-8">

          {/* Left Sidebar - Desktop only */}
          <div className="hidden md:block">
            <FilterSidebar
              sortBy={sortBy}
              setSortBy={setSortBy}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              condition={condition}
              setCondition={setCondition}
              sellerType={sellerType}
              setSellerType={setSellerType}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              categories={categories}
              onClearFilters={handleClearFilters}
              setPage={setPage}
            />
          </div>

          {/* Book Grid */}
          <main className="flex-1">
            {/* Results count and active filters */}
            {booksData && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <p className="text-sm text-muted-foreground">
                  {t('books.showing')} <span className="font-medium text-foreground">{booksData.books.length}</span> {t('books.of')}{' '}
                  <span className="font-medium text-foreground">{booksData.total}</span> {t('books.booksCount')}
                </p>
                
                {/* Active filter pills */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-muted text-foreground text-sm px-3 py-1 rounded-full"
                      >
                        {filter.label}
                        <button
                          onClick={filter.onRemove}
                          className="hover:text-primary transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Books Grid */}
            {booksLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
            ) : booksData?.books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t('books.noBooks')}</p>
              </div>
            ) : (
              <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {booksData?.books.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}` as any}
                  className="bg-card rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {book.discountPrice && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                        </span>
                      </div>
                    )}
                    {user && (
                      <button
                        onClick={(e) => handleToggleWishlist(e, book.id)}
                        disabled={wishlistLoading === book.id}
                        className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-200 ${
                          isInWishlist(book.id)
                            ? 'bg-red-100 text-red-600 opacity-100'
                            : 'bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100'
                        } hover:scale-110 disabled:opacity-50`}
                        title={isInWishlist(book.id) ? t('wishlist.removedFromWishlist') : t('wishlist.addedToWishlist')}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
                      </button>
                    )}
                    {book.stock > 0 && (
                      <button
                        onClick={(e) => handleQuickAdd(e, book)}
                        className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700"
                        title={t('books.addToCart')}
                      >
                        {addedBookId === book.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors h-12">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 h-10 line-clamp-2">{book.author}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      {book.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {book.discountPrice.toFixed(2)} {t('common.rsd')}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {book.price.toFixed(2)} {t('common.rsd')}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {book.price.toFixed(2)} {t('common.rsd')}
                        </span>
                      )}
                    </div>
                    {book.stock === 0 && (
                      <p className="text-sm text-red-600 mt-2">{t('books.outOfStock')}</p>
                    )}
                  </div>
                </Link>
              ))}
              </div>

              {/* Pagination */}
              {booksData && booksData.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-input rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-foreground"
                  >
                    {t('books.previous')}
                  </button>
                  <span className="px-4 py-2 text-foreground">
                    {t('books.page')} {page} {t('books.of')} {booksData.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(booksData.totalPages, p + 1))}
                    disabled={page === booksData.totalPages}
                    className="px-4 py-2 border border-input rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-foreground"
                  >
                    {t('books.next')}
                  </button>
                </div>
              )}
            </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
