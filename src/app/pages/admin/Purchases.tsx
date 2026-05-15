import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { compras, getProveedorById, getUsuarioById, getNombreCompleto } from '../../data/mockData';
import { Compra } from '../../types';

export default function AdminPurchases() {
  const [purchasesList] = useState<Compra[]>(compras);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Recibida': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">COMPRAS</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proveedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchasesList.map((purchase) => {
              const proveedor = getProveedorById(purchase.proveedorID);
              const usuario = getUsuarioById(purchase.usuarioID);
              
              return (
                <tr key={purchase.compraID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-800">{purchase.compraID}</td>
                  <td className="px-6 py-4 text-gray-600">{proveedor?.empresa}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(purchase.fecha).toLocaleDateString('es-MX')}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {usuario ? getNombreCompleto(usuario.nombre) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    ${purchase.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(purchase.estado)}`}>
                      {purchase.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
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