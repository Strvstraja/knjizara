import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getBooks, getCategories } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'title'>('newest');

  const { data: booksData, isLoading: booksLoading } = useQuery(getBooks, {
    page,
    limit: 20,
    search: search || undefined,
    categoryId,
    sortBy,
  });

  const { data: categories } = useQuery(getCategories);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Knjige</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Pretraži po naslovu, autoru, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pretraži
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4">
            <select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value || undefined);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sve kategorije</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Najnovije</option>
              <option value="price_asc">Cena: rastuće</option>
              <option value="price_desc">Cena: opadajuće</option>
              <option value="title">Naslov</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {booksLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Učitavanje...</p>
          </div>
        ) : booksData?.books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nema pronađenih knjiga.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {booksData?.books.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}` as any}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="aspect-[2/3] bg-gray-200 relative overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {book.discountPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-2">
                      {book.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {book.discountPrice.toFixed(2)} RSD
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {book.price.toFixed(2)} RSD
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {book.price.toFixed(2)} RSD
                        </span>
                      )}
                    </div>
                    {book.stock === 0 && (
                      <p className="text-sm text-red-600 mt-2">Nema na stanju</p>
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
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Prethodna
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Strana {page} od {booksData.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(booksData.totalPages, p + 1))}
                  disabled={page === booksData.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sledeća
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
