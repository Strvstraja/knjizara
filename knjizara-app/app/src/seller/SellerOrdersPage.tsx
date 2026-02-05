import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getSellerOrders, updateOrderStatus } from 'wasp/client/operations';
import { Package, User, MapPin, Calendar, DollarSign, Truck, Edit2, Check, X } from 'lucide-react';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function SellerOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [page, setPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { data, isLoading, refetch } = useQuery(getSellerOrders, {
    status: statusFilter,
    page,
    limit: 20
  });

  // Fetch all orders for stats (without filter)
  const { data: allOrdersData } = useQuery(getSellerOrders, {
    page: 1,
    limit: 1000 // Large number to get all orders for stats
  });

  const handleEditStatus = (orderId: string, currentStatus: string, currentTracking?: string) => {
    setEditingOrder(orderId);
    setNewStatus(currentStatus as OrderStatus);
    setTrackingNumber(currentTracking || '');
  };

  const handleSaveStatus = async (orderId: string) => {
    setIsSaving(true);
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        trackingNumber: trackingNumber || undefined
      });
      await refetch();
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Greška pri ažuriranju statusa porudžbine');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setNewStatus('PENDING');
    setTrackingNumber('');
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-green-100 text-green-800',
      SHIPPED: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-purple-100 text-purple-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Na čekanju',
      PROCESSING: 'U obradi',
      SHIPPED: 'Poslato',
      DELIVERED: 'Dostavljeno',
      CANCELLED: 'Otkazano',
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Moje prodaje
          </h1>
          <p className="text-muted-foreground">
            Pregled porudžbina koje sadrže vaše knjige
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Ukupno</p>
            <p className="text-2xl font-bold text-foreground">{allOrdersData?.total || 0}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">U obradi</p>
            <p className="text-2xl font-bold text-green-600">
              {allOrdersData?.orders?.filter((o: any) => o.status === 'PROCESSING').length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Poslato</p>
            <p className="text-2xl font-bold text-blue-600">
              {allOrdersData?.orders?.filter((o: any) => o.status === 'SHIPPED').length || 0}
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Na čekanju</p>
            <p className="text-2xl font-bold text-yellow-600">
              {allOrdersData?.orders?.filter((o: any) => o.status === 'PENDING').length || 0}
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !statusFilter
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
          >
            Sve ({allOrdersData?.total || 0})
          </button>
          {(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-accent'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              {statusFilter 
                ? 'Nema porudžbina sa ovim statusom'
                : 'Još nema porudžbina za vaše knjige'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Porudžbina</p>
                        <p className="font-mono text-sm font-medium">#{order.id.slice(0, 8)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingOrder === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSaving}
                          >
                            <option value="PENDING">Na čekanju</option>
                            <option value="PROCESSING">U obradi</option>
                            <option value="SHIPPED">Poslato</option>
                            <option value="DELIVERED">Dostavljeno</option>
                            <option value="CANCELLED">Otkazano</option>
                          </select>
                          <button
                            onClick={() => handleSaveStatus(order.id)}
                            disabled={isSaving}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                            title="Sačuvaj"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                            title="Otkaži"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <button
                            onClick={() => handleEditStatus(order.id, order.status, order.trackingNumber)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Izmeni status"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Buyer Info */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Kupac
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Email:</span> {order.user.email}
                        </p>
                        {order.user.username && (
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">Korisničko ime:</span> {order.user.username}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Adresa dostave
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>Tel: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Books Sold */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Vaše knjige u ovoj porudžbini
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                          <img
                            src={item.book.coverImage}
                            alt={item.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.book.title}</p>
                            <p className="text-sm text-muted-foreground">{item.book.author}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Količina: {item.quantity} × {item.price} RSD
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {(item.quantity * item.price).toFixed(2)} RSD
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total (only for seller's items) */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Ukupno za vaše knjige:
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {order.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0).toFixed(2)} RSD
                      </span>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  {editingOrder === order.id ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Truck className="h-4 w-4 inline mr-1" />
                        Broj za praćenje pošiljke:
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Unesite broj za praćenje"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSaving}
                      />
                    </div>
                  ) : order.trackingNumber ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Broj za praćenje:</span>{' '}
                        <span className="font-mono text-blue-600">{order.trackingNumber}</span>
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-accent"
            >
              Prethodna
            </button>
            <span className="px-4 py-2">
              Strana {page} od {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-accent"
            >
              Sledeća
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
