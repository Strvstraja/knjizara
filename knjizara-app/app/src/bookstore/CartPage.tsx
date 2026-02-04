import { Link } from 'wasp/client/router';
import { useCart } from '../client/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getSubtotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = getSubtotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 350;
  const total = subtotal + shippingCost;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vaša korpa je prazna</h1>
          <p className="text-gray-600 mb-6">Dodajte knjige u korpu da biste nastavili sa kupovinom.</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Pregledaj knjige
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Korpa</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  Dodaj još <span className="font-bold">{amountToFreeShipping.toFixed(2)} RSD</span> za besplatnu dostavu!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-semibold">
                  ✓ Ostvarili ste besplatnu dostavu!
                </p>
              </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-lg shadow">
              {items.map((item, index) => {
                const price = item.book.discountPrice || item.book.price;
                const itemTotal = price * item.quantity;
                
                return (
                  <div
                    key={item.book.id}
                    className={`p-6 flex gap-6 ${index !== items.length - 1 ? 'border-b' : ''}`}
                  >
                    <Link to={`/books/${item.book.id}` as any} className="flex-shrink-0">
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="w-24 h-36 object-cover rounded"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${item.book.id}` as any}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 mb-1">
                          {item.book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                      
                      {item.book.discountPrice && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-red-600">
                            {item.book.discountPrice.toFixed(2)} RSD
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {item.book.price.toFixed(2)} RSD
                          </span>
                        </div>
                      )}
                      {!item.book.discountPrice && (
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          {item.book.price.toFixed(2)} RSD
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-3 border rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                            disabled={item.quantity >= item.book.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.book.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Ukloni
                        </button>
                      </div>

                      {item.quantity >= item.book.stock && (
                        <p className="text-sm text-orange-600 mt-2">
                          Maksimalna dostupna količina
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {itemTotal.toFixed(2)} RSD
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pregled porudžbine</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Međuzbir:</span>
                  <span className="font-medium">{subtotal.toFixed(2)} RSD</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Dostava:</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Besplatno</span>
                    ) : (
                      `${shippingCost.toFixed(2)} RSD`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Ukupno:</span>
                  <span>{total.toFixed(2)} RSD</span>
                </div>
              </div>

              <Link
                to="/placanje"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
              >
                Nastavi na plaćanje
              </Link>

              <Link
                to="/books"
                className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Nastavi sa kupovinom
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
