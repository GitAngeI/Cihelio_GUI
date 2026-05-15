import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { clientes, getNombreCompleto, getDireccionCompleta } from '../../data/mockData';
import { Cliente } from '../../types';

export default function AdminClients() {
  const [clientsList] = useState<Cliente[]>(clientes);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">CLIENTES</h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dirección</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientsList.map((client) => (
              <tr key={client.clienteID} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{client.clienteID}</td>
                <td className="px-6 py-4 text-gray-600">{getNombreCompleto(client.nombre)}</td>
                <td className="px-6 py-4 text-gray-600">{client.telefono}</td>
                <td className="px-6 py-4 text-gray-600">{client.correo}</td>
                <td className="px-6 py-4 text-gray-600">{getDireccionCompleta(client.direccion)}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}