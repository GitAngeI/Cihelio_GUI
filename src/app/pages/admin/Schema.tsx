import erDiagram from 'figma:asset/57f65bbe75cc5f788dbf6f273408fb535653a7cb.png';
import { Database } from 'lucide-react';

export default function Schema() {
  const entidades = [
    {
      nombre: 'Usuario',
      atributos: [
        'UsuarioID (PK)',
        'Nombre (compuesto: nombre, apellido_paterno, apellido_materno)',
        'Correo',
        'Contraseña'
      ]
    },
    {
      nombre: 'Cliente',
      atributos: [
        'ClienteID (PK)',
        'Nombre (compuesto: nombre, apellido_paterno, apellido_materno)',
        'Correo',
        'Teléfono',
        'Dirección (compuesta: calle, número, ciudad)'
      ]
    },
    {
      nombre: 'Administrador',
      atributos: [
        'UsuarioID (PK, FK)',
        'Nivel_acceso'
      ]
    },
    {
      nombre: 'Producto',
      atributos: [
        'ProductoID (PK)',
        'Nombre',
        'Precio',
        'Stock',
        'Tipo',
        'CategoriaID (FK)'
      ]
    },
    {
      nombre: 'Categoría',
      atributos: [
        'CategoriaID (PK)',
        'Nombre'
      ]
    },
    {
      nombre: 'Pedido',
      atributos: [
        'PedidoID (PK)',
        'Fecha',
        'Total',
        'Estado',
        'ClienteID (FK)'
      ]
    },
    {
      nombre: 'Detalle_Pedido',
      atributos: [
        'PedidoID (PK, FK)',
        'ProductoID (PK, FK)',
        'Cantidad',
        'Precio_venta',
        'Subtotal'
      ]
    },
    {
      nombre: 'Pago',
      atributos: [
        'PagoID (PK)',
        'Tipo',
        'Monto',
        'Fecha',
        'Estado',
        'PedidoID (FK)'
      ]
    },
    {
      nombre: 'Proveedor',
      atributos: [
        'ProveedorID (PK)',
        'Empresa',
        'Teléfono',
        'Dirección (compuesta: calle, número, ciudad)'
      ]
    },
    {
      nombre: 'Compra',
      atributos: [
        'CompraID (PK)',
        'Fecha',
        'Estado',
        'Total',
        'ProveedorID (FK)',
        'UsuarioID (FK)'
      ]
    },
    {
      nombre: 'Detalle_Compra',
      atributos: [
        'CompraID (PK, FK)',
        'ProductoID (PK, FK)',
        'Cantidad',
        'Costo_unitario',
        'Unidad_medida'
      ]
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Esquema de Base de Datos</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Diagrama Entidad-Relación</h2>
        <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
          <img 
            src={erDiagram} 
            alt="Diagrama Entidad-Relación" 
            className="max-w-full h-auto mx-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entidades.map((entidad, index) => (
          <div key={index} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-lg font-bold text-gray-800">{entidad.nombre}</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-2">
                {entidad.atributos.map((atributo, attrIndex) => (
                  <li 
                    key={attrIndex} 
                    className={`text-sm ${
                      atributo.includes('(PK)') 
                        ? 'font-semibold text-blue-600' 
                        : atributo.includes('(FK)')
                        ? 'font-semibold text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {atributo.includes('(PK)') && '🔑 '}
                    {atributo.includes('(FK)') && !atributo.includes('(PK)') && '🔗 '}
                    {atributo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Leyenda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔑</span>
            <span className="text-sm text-gray-700">
              <strong className="text-blue-600">PK</strong> - Llave Primaria
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            <span className="text-sm text-gray-700">
              <strong className="text-green-600">FK</strong> - Llave Foránea
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <span className="text-sm text-gray-700">
              <strong className="text-gray-700">Compuesto</strong> - Atributo compuesto
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
