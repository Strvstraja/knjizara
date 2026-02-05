import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { Eye } from 'lucide-react';

export default function SellersAdminTable() {
  const [page, setPage] = useState(1);
  
  // We'll need to create a query to get all sellers
  // For now, using a placeholder structure
  const sellers: any[] = [];
  const isLoading = false;
  const totalPages = 1;

  if (isLoading) {
    return <div className="text-center py-8">Učitavanje...</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black">
          Svi prodavci ({sellers.length})
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Pregled svih registrovanih prodavaca
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black xl:pl-11">
                Ime
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                Tip
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black">
                Grad
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black">
                Email
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                Broj oglasa
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black">
                Datum registracije
              </th>
              <th className="px-4 py-4 font-medium text-black">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Nema registrovanih prodavaca
                </td>
              </tr>
            ) : (
              sellers.map((seller: any) => (
                <tr key={seller.id} className="border-b border-stroke">
                  <td className="px-4 py-5 pl-9 xl:pl-11">
                    <p className="text-black font-medium">{seller.displayName}</p>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex rounded px-3 py-1 text-sm font-medium ${
                      seller.type === 'BUSINESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {seller.type === 'BUSINESS' ? 'Firma' : 'Privatni'}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-black">{seller.city || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-black">{seller.user?.email || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-black">{seller._count?.books || 0}</p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-sm text-black">
                      {new Date(seller.createdAt).toLocaleDateString('sr-RS')}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center space-x-3.5">
                      <a
                        href={`/all-sellers?seller=${seller.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                        title="Pogledaj oglase"
                      >
                        <Eye className="h-5 w-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
