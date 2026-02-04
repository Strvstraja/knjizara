import { Link } from 'wasp/client/router';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('orderSuccess.title')}</h1>
          <p className="text-gray-600">
            {t('orderSuccess.message')}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                {t('orderSuccess.whatNext')}
              </p>
              <p className="text-sm text-blue-800">
                {t('orderSuccess.emailConfirmation')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('orderSuccess.viewOrders')}
          </Link>
          <Link
            to="/books"
            className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {t('orderSuccess.continueShopping')}
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500">
            {t('orderSuccess.questions')}{' '}
            <a href="mailto:podrska@knjizara.rs" className="text-blue-600 hover:underline">
              podrska@knjizara.rs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
