import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { productos, getCategoriaById } from '../../data/mockData';
import { Producto } from '../../types';

export default function EmployeeProducts() {
  const [productsList] = useState<Producto[]>(productos);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">PRODUCTOS</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productsList.map((product) => {
              const categoria = getCategoriaById(product.categoriaID);
              
              return (
                <tr key={product.productoID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{product.productoID}</td>
                  <td className="px-6 py-4 text-gray-600">{product.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{product.tipo}</td>
                  <td className="px-6 py-4 text-gray-600">{categoria?.nombre || '-'}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${product.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 100 ? 'bg-green-100 text-green-800' :
                      product.stock > 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}