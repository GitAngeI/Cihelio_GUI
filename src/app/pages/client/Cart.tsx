import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle, X } from 'lucide-react';

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

  // Variable para controlar la ventana de éxito al finalizar compra
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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

  const handleFinishPurchase = () => {
    setIsSuccessModalOpen(true);
    // En una fase futura, aquí se limpiaría el carrito en la base de datos
  };

  return (
    <div className="relative">
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
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
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
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
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
              <span className="text-xl font-semibold text-gray-700">Total acumulado:</span>
              <span className="text-3xl font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleFinishPurchase}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md active:transform active:scale-[0.98]"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}

      {/* VENTANA EMERGENTE: ÉXITO DE COMPRA */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido Realizado!</h2>
              <p className="text-gray-600 mb-6">
                Tu pedido se ha registrado correctamente. Gracias por confiar en nosotros para decorar tus momentos especiales.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-blue-800 font-medium">Próximos pasos:</p>
                <ul className="text-xs text-blue-700 mt-2 list-disc list-inside space-y-1">
                  <li>Tu pedido pasará a estado "En preparación".</li>
                  <li>Puedes consultar el historial en la sección "Mis pedidos".</li>
                </ul>
              </div>
              <button 
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setItems([]); // Vaciamos el carrito visualmente
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}