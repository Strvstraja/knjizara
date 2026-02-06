import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getBooks, deleteListing } from 'wasp/client/operations';
import { Trash2, Eye, Pause, Play } from 'lucide-react';

export default function BooksAdminTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { data, isLoading, refetch } = useQuery(getBooks, {
    page,
    limit: 50,
    status: statusFilter,
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Da li ste sigurni da želite da obrišete "${title}"?`)) {
      return;
    }
    try {
      await deleteListing({ id });
      refetch();
    } catch (err: any) {
      console.error('Error deleting book:', err);
      const errorMessage = err?.message || 'Greška pri brisanju knjige';
      alert(errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      SOLD: 'bg-blue-100 text-blue-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-8">Učitavanje...</div>;
  }

  const books = data?.books || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black">
          Sve knjige ({data?.total || 0})
        </h4>
        
        {/* Status Filters */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-3 py-1 rounded text-sm ${
              !statusFilter ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Sve
          </button>
          {['ACTIVE', 'PAUSED', 'SOLD'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded text-sm ${
                statusFilter === status ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              {status === 'ACTIVE' ? 'Aktivno' : status === 'PAUSED' ? 'Pauzirano' : 'Prodato'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black xl:pl-11">
                Naslov
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black">
                Autor
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                Cena
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                Stanje
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                Status
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black">
                Prodavac
              </th>
              <th className="px-4 py-4 font-medium text-black">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: any) => (
              <tr key={book.id} className="border-b border-stroke">
                <td className="px-4 py-5 pl-9 xl:pl-11">
                  <p className="text-black font-medium">{book.title}</p>
                </td>
                <td className="px-4 py-5">
                  <p className="text-black">{book.author}</p>
                </td>
                <td className="px-4 py-5">
                  <p className="text-black">{book.price} RSD</p>
                </td>
                <td className="px-4 py-5">
                  <p className="text-sm text-black">{book.condition || 'N/A'}</p>
                </td>
                <td className="px-4 py-5">
                  <span className={`inline-flex rounded px-3 py-1 text-sm font-medium ${getStatusBadge(book.status)}`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <p className="text-sm text-black">
                    {(book as any).seller?.displayName || 'N/A'}
                  </p>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center space-x-3.5">
                    <a
                      href={`/books/${book.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                      title="Pogledaj"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="hover:text-danger"
                      title="Obriši"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 px-4 py-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prethodna
          </button>
          <span className="px-4 py-2">
            Strana {page} od {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
}
