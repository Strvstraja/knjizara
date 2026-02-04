import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from 'wasp/client/operations';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import AddressForm from '../client/components/AddressForm';

export default function AddressManagementPage() {
  const { t } = useTranslation();
  const { data: addresses, isLoading, refetch } = useQuery(getUserAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleAddAddress = async (addressData: any) => {
    try {
      await createAddress(addressData);
      await refetch();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleUpdateAddress = async (addressData: any) => {
    if (!editingAddress) return;
    
    try {
      await updateAddress({
        id: editingAddress.id,
        ...addressData,
      });
      await refetch();
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(t('addressManagement.confirmDelete'))) return;
    
    try {
      await deleteAddress({ id });
      await refetch();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress({ id });
      await refetch();
    } catch (error) {
      console.error('Error setting default address:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('addressManagement.title')}</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('addressManagement.addNew')}
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('addressManagement.addNewAddress')}</h2>
            <AddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Address Form */}
        {editingAddress && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('addressManagement.editAddress')}</h2>
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleUpdateAddress}
              onCancel={() => setEditingAddress(null)}
            />
          </div>
        )}

        {/* Address List */}
        {!addresses || addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('addressManagement.noAddresses')}</h2>
            <p className="text-gray-600 mb-6">{t('addressManagement.noAddressesMessage')}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('addressManagement.addFirst')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address: any) => (
              <div
                key={address.id}
                className={`bg-white rounded-lg shadow p-6 ${
                  address.isDefault ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{address.fullName}</h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          <Check className="w-3 h-3" />
                          {t('addressManagement.default')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.postalCode} {address.city}
                    </p>
                    <p className="text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {t('addressManagement.setAsDefault')}
                      </button>
                    )}
                    <button
                      onClick={() => setEditingAddress(address)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title={t('addressManagement.edit')}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title={t('addressManagement.delete')}
                    >
                      <Trash2 className="w-5 h-5" />
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
