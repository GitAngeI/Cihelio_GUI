import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Truck } from 'lucide-react';
import { 
  clientes, 
  productos, 
  pedidos, 
  compras, 
  pagos,
  detallesPedido,
  getProductoById,
  getClienteById,
  getNombreCompleto
} from '../../data/mockData';

export default function AdminHome() {
  // Calcular estadísticas reales
  const totalClientes = clientes.length;
  const totalProductos = productos.length;
  const totalPedidos = pedidos.length;
  const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);

  const stats = [
    { label: 'Total Clientes', value: totalClientes.toString(), icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Productos', value: totalProductos.toString(), icon: ShoppingBag, color: 'bg-green-500', trend: '+5%' },
    { label: 'Pedidos', value: totalPedidos.toString(), icon: Package, color: 'bg-purple-500', trend: '+23%' },
    { label: 'Ventas Totales', value: `$${totalVentas.toFixed(2)}`, icon: DollarSign, color: 'bg-yellow-500', trend: '+18%' },
  ];

  // Productos más vendidos
  const productSales: { [key: number]: { cantidad: number; total: number } } = {};
  detallesPedido.forEach(detalle => {
    if (!productSales[detalle.productoID]) {
      productSales[detalle.productoID] = { cantidad: 0, total: 0 };
    }
    productSales[detalle.productoID].cantidad += detalle.cantidad;
    productSales[detalle.productoID].total += detalle.subtotal;
  });

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => {
      const producto = getProductoById(Number(id));
      return {
        name: producto?.nombre || 'Desconocido',
        sales: data.cantidad,
        revenue: `$${data.total.toFixed(2)}`
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4);

  // Pedidos recientes
  const pedidosRecientes = [...pedidos]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Productos Más Vendidos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} unidades vendidas</p>
                  </div>
                  <p className="font-bold text-green-600">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pedidosRecientes.map((pedido) => {
                const cliente = getClienteById(pedido.clienteID);
                return (
                  <div key={pedido.pedidoID} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      pedido.estado === 'Completado' ? 'bg-green-100' :
                      pedido.estado === 'En Proceso' ? 'bg-blue-100' :
                      'bg-yellow-100'
                    }`}>
                      <Package className={`w-5 h-5 ${
                        pedido.estado === 'Completado' ? 'text-green-600' :
                        pedido.estado === 'En Proceso' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Pedido #{pedido.pedidoID}</p>
                      <p className="text-sm text-gray-600">
                        {cliente ? getNombreCompleto(cliente.nombre) : 'Cliente desconocido'} - ${pedido.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{pedido.estado}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}