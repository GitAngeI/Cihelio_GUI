import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

export default function CreateOrder() {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [total] = useState(30.00);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">CREAR PEDIDO</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Crear Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Producto</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Producto</option>
              <option value="globos-fiesta">Globos de Fiesta</option>
              <option value="globos-cumpleanos">Globos de Cumpleaños</option>
              <option value="globos-helio">Globos de Helio</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cantidad</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Precio</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Total</label>
            <input
              type="text"
              value={`${total.toFixed(2)}`}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <div className="text-xl font-semibold text-gray-700">
            Total: <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Total: ${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold">
            Registrar Pago
          </button>
        </div>
      </div>
    </div>
  );
}
