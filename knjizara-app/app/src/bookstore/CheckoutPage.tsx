import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useAction } from 'wasp/client/operations';
import { getUserAddresses, createAddress, createOrder } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useCart } from '../client/contexts/CartContext';
import { Check, ChevronRight, MapPin, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import AddressForm from '../client/components/AddressForm';

type DeliveryMethod = 'standard' | 'express';
type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { items, getSubtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Address
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Step 2: Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  
  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  
  const { data: addresses, refetch: refetchAddresses } = useQuery(getUserAddresses);
  const createAddressFn = useAction(createAddress);
  const createOrderFn = useAction(createOrder);

  const FREE_SHIPPING_THRESHOLD = 3000;
  const STANDARD_SHIPPING = 350;
  const EXPRESS_SHIPPING = 590;
  
  const subtotal = getSubtotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD 
    ? 0 
    : deliveryMethod === 'express' 
      ? EXPRESS_SHIPPING 
      : STANDARD_SHIPPING;
  const total = subtotal + shippingCost;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vaša korpa je prazna</h1>
          <button
            onClick={() => navigate('/books')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Pregledaj knjige
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prijavite se da nastavite</h1>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Prijavi se
          </button>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = async (addressData: any) => {
    try {
      const newAddress = await createAddressFn(addressData);
      await refetchAddresses();
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Failed to create address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;

    try {
      await createOrderFn({
        addressId: selectedAddressId,
        items: items.map(item => ({
          bookId: item.book.id,
          quantity: item.quantity,
        })),
        paymentMethod,
      });

      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const canProceedToStep2 = selectedAddressId !== null;
  const canProceedToStep3 = canProceedToStep2 && deliveryMethod !== null;
  const canPlaceOrder = canProceedToStep3 && paymentMethod !== null;

  const steps = [
    { number: 1, title: 'Adresa dostave', icon: MapPin },
    { number: 2, title: 'Način dostave', icon: Truck },
    { number: 3, title: 'Plaćanje', icon: CreditCard },
    { number: 4, title: 'Pregled', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Plaćanje</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-gray-400 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Izaberite adresu dostave</h2>
                
                {addresses && addresses.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{address.fullName}</p>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.postalCode} {address.city}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Podrazumevano
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 mb-4">Nemate sačuvanih adresa.</p>
                )}

                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Dodaj novu adresu
                  </button>
                ) : (
                  <div className="mt-4">
                    <AddressForm
                      onSubmit={handleAddressSubmit}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Nastavi
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Izaberite način dostave</h2>
                
                <div className="space-y-3">
                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Standardna dostava</p>
                        <p className="text-sm text-gray-600">Isporuka za 3-5 radnih dana</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? 'Besplatno' : '350 RSD'}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      deliveryMethod === 'express'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Ekspresna dostava</p>
                        <p className="text-sm text-gray-600">Isporuka za 1-2 radna dana</p>
                      </div>
                      <p className="font-bold text-gray-900">590 RSD</p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Nastavi
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Izaberite način plaćanja</h2>
                
                <div className="space-y-3">
                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Plaćanje pouzećem</p>
                      <p className="text-sm text-gray-600">Platite kuriru prilikom preuzimanja</p>
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Preporučeno
                      </span>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'CARD'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Platna kartica</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Maestro</p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Nastavi
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pregled porudžbine</h2>
                
                {/* Address Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Adresa dostave</h3>
                  {addresses && addresses.find(a => a.id === selectedAddressId) && (
                    <div className="text-sm text-gray-600">
                      <p>{addresses.find(a => a.id === selectedAddressId)!.fullName}</p>
                      <p>{addresses.find(a => a.id === selectedAddressId)!.street}</p>
                      <p>{addresses.find(a => a.id === selectedAddressId)!.postalCode} {addresses.find(a => a.id === selectedAddressId)!.city}</p>
                      <p>{addresses.find(a => a.id === selectedAddressId)!.phone}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Način dostave</h3>
                  <p className="text-sm text-gray-600">
                    {deliveryMethod === 'standard' ? 'Standardna dostava (3-5 dana)' : 'Ekspresna dostava (1-2 dana)'}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Način plaćanja</h3>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === 'CASH_ON_DELIVERY' ? 'Plaćanje pouzećem' : 'Platna kartica'}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Stavke ({items.length})</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.book.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.book.title} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {((item.book.discountPrice || item.book.price) * item.quantity).toFixed(2)} RSD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Potvrdi porudžbinu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vaša porudžbina</h2>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.book.id} className="flex gap-3">
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.book.title}
                      </p>
                      <p className="text-xs text-gray-600">Količina: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {((item.book.discountPrice || item.book.price) * item.quantity).toFixed(2)} RSD
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Međuzbir:</span>
                  <span className="font-medium">{subtotal.toFixed(2)} RSD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dostava:</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Besplatno</span>
                    ) : (
                      `${shippingCost.toFixed(2)} RSD`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Ukupno:</span>
                  <span>{total.toFixed(2)} RSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
