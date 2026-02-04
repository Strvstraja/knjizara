import { useQuery } from 'wasp/client/operations';
import { getUserOrders } from 'wasp/client/operations';
import { useTranslation } from 'react-i18next';
import { Link } from 'wasp/client/router';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function MyOrdersPage() {
  const { t } = useTranslation();
  const { data: orders, isLoading, error } = useQuery(getUserOrders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">{t('orders.errorLoading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('orders.title')}</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('orders.noOrders')}</h2>
            <p className="text-gray-600 mb-6">{t('orders.noOrdersMessage')}</p>
            <Link
              to="/books"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('orders.startShopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('orders.orderNumber')}: #{order.id.slice(0, 8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {t(`orders.status.${order.status.toLowerCase()}`)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t('orders.placedOn')}: {new Date(order.createdAt).toLocaleDateString('sr-RS', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t('orders.total')}:</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {order.total.toFixed(2)} {t('common.rsd')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">{t('orders.items')}:</h4>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/books/${item.book.id}` as any}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.book.title}
                          </Link>
                          <p className="text-sm text-gray-600">{item.book.author}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-600">
                              {t('orders.quantity')}: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.price.toFixed(2)} {t('common.rsd')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('orders.shippingAddress')}:</h4>
                        <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.postalCode} {order.shippingAddress.city}
                        </p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-gray-600">{t('cart.subtotal')}:</span>
                            <span className="text-sm font-medium">{order.subtotal.toFixed(2)} {t('common.rsd')}</span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-gray-600">{t('cart.shipping')}:</span>
                            <span className="text-sm font-medium">
                              {order.shippingCost === 0 ? t('cart.free') : `${order.shippingCost.toFixed(2)} ${t('common.rsd')}`}
                            </span>
                          </div>
                          <div className="flex justify-between gap-8 pt-2 border-t">
                            <span className="font-semibold text-gray-900">{t('cart.total')}:</span>
                            <span className="font-bold text-gray-900">{order.total.toFixed(2)} {t('common.rsd')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
