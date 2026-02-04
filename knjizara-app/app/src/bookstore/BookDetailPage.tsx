import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getBook } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useQuery(getBook, { id: id! });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Knjiga nije pronađena</h1>
          <Link to="/books" className="text-blue-600 hover:underline">
            Povratak na katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/books" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Povratak na katalog
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
              <p className="text-xl text-gray-600 mb-6">{book.author}</p>

              {/* Price */}
              <div className="mb-6">
                {book.discountPrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-red-600">
                      {book.discountPrice.toFixed(2)} RSD
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {book.price.toFixed(2)} RSD
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                      -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {book.price.toFixed(2)} RSD
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {book.stock > 0 ? (
                  <p className="text-green-600 font-semibold">✓ Na stanju ({book.stock} kom.)</p>
                ) : (
                  <p className="text-red-600 font-semibold">Nema na stanju</p>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={book.stock === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-6"
              >
                {book.stock > 0 ? 'Dodaj u korpu' : 'Nema na stanju'}
              </button>

              {/* Specifications */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifikacije</h2>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-gray-600 w-32">ISBN:</dt>
                    <dd className="text-gray-900 font-medium">{book.isbn}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Broj strana:</dt>
                    <dd className="text-gray-900 font-medium">{book.pageCount}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Povez:</dt>
                    <dd className="text-gray-900 font-medium">
                      {book.binding === 'HARDCOVER' ? 'Tvrdi' : 'Meki'}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Izdavač:</dt>
                    <dd className="text-gray-900 font-medium">{book.publisher}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Godina:</dt>
                    <dd className="text-gray-900 font-medium">{book.publishYear}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-32">Jezik:</dt>
                    <dd className="text-gray-900 font-medium">{book.language}</dd>
                  </div>
                </dl>
              </div>

              {/* Categories */}
              {(book as any).categories && (book as any).categories.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Kategorije</h2>
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
            </div>
          </div>

          {/* Description */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Opis</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
