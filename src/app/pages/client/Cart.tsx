import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, name: 'Globos de Fiesta', price: 150.00, quantity: 2 },
    { id: 2, name: 'Globos de Cumpleaños', price: 200.00, quantity: 1 },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-700">Total:</span>
              <span className="text-3xl font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
