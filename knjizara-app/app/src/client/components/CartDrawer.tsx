import { useState } from 'react';
import { Link } from 'wasp/client/router';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, getItemCount, getSubtotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = getSubtotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 350;
  const total = subtotal + shippingCost;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Korpa"
      >
        <ShoppingCart className="w-6 h-6" />
        {getItemCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {getItemCount()}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-card shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right"
        >
        <div className="flex flex-col h-full max-h-screen">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">
              {t('cart.title')} ({getItemCount()})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="flex-shrink-0 p-4 bg-blue-50 dark:bg-blue-950 border-b border-border">
              <p className="text-sm text-foreground mb-2">
                {t('cart.freeShippingProgress', { amount: amountToFreeShipping.toFixed(2), currency: t('common.rsd') })}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {items.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD && (
            <div className="flex-shrink-0 p-4 bg-green-50 dark:bg-green-950 border-b border-border">
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                ✓ {t('cart.freeShippingAchieved')}
              </p>
            </div>
          )}

          {/* Cart Items - MAXIMUM SPACE */}
          <div className="flex-1 overflow-y-auto p-4 bg-card min-h-[400px]">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">{t('cart.empty')}</p>
                <Link
                  to="/books"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.book.discountPrice || item.book.price;
                  return (
                    <div key={item.book.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0">
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="w-24 h-32 object-cover rounded shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className="font-semibold text-foreground text-base line-clamp-2 mb-1">
                          {item.book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.book.author}</p>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 bg-accent rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-background rounded transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-semibold w-8 text-center text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-background rounded transition-colors"
                                disabled={item.quantity >= item.book.stock}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.book.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-base font-bold text-foreground">
                            {(price * item.quantity).toFixed(2)} RSD
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="flex-shrink-0 border-t border-border p-4 bg-muted">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}:</span>
                  <span className="font-medium text-foreground">{subtotal.toFixed(2)} {t('common.rsd')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}:</span>
                  <span className="font-medium text-foreground">
                    {shippingCost === 0 ? t('cart.free') : `${shippingCost.toFixed(2)} ${t('common.rsd')}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span className="text-foreground">{t('cart.total')}:</span>
                  <span className="text-foreground">{total.toFixed(2)} {t('common.rsd')}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  to="/placanje"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('cart.goToCheckout')}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {t('cart.viewCart')}
                </Link>
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </>
  );
}
