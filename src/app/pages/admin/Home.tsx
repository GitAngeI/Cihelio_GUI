import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalPedidos: 0,
    totalVentas: 0,
    topProducts: [] as any[],
    pedidosRecientes: [] as any[]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Hacemos todas las peticiones a la vez para que cargue rápido
      const [clientesReq, productosReq, pedidosReq, detallesReq] = await Promise.all([
        supabase.from('cliente').select('*', { count: 'exact', head: true }), // Solo cuenta
        supabase.from('producto').select('*', { count: 'exact', head: true }), // Solo cuenta
        supabase.from('pedido').select('pedidoid, total, estado, fecha, cliente(nombre)').order('fecha', { ascending: false }),
        supabase.from('detalle_pedido').select('cantidad, subtotal, productoid, producto(nombre)')
      ]);

      const pedidos = pedidosReq.data || [];
      const detalles = detallesReq.data || [];

      // Sumar ventas
      const ventasTotales = pedidos.reduce((sum, p) => sum + Number(p.total), 0);

      // Calcular productos más vendidos
      const productSales: Record<number, { nombre: string; cantidad: number; total: number }> = {};
      detalles.forEach(d => {
        if (!productSales[d.productoid]) {
          productSales[d.productoid] = { nombre: d.producto?.nombre || 'Desconocido', cantidad: 0, total: 0 };
        }
        productSales[d.productoid].cantidad += d.cantidad;
        productSales[d.productoid].total += Number(d.subtotal);
      });

      // Ordenar para sacar el top 4
      const top = Object.values(productSales)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 4);

      setStats({
        totalClientes: clientesReq.count || 0,
        totalProductos: productosReq.count || 0,
        totalPedidos: pedidos.length,
        totalVentas: ventasTotales,
        topProducts: top,
        pedidosRecientes: pedidos.slice(0, 4) // Los 4 más recientes
      });
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { label: 'Total Clientes', value: stats.totalClientes, icon: Users, color: 'bg-blue-500', trend: 'Actualizado' },
    { label: 'Productos', value: stats.totalProductos, icon: ShoppingBag, color: 'bg-green-500', trend: 'Actualizado' },
    { label: 'Pedidos', value: stats.totalPedidos, icon: Package, color: 'bg-purple-500', trend: 'Actualizado' },
    { label: 'Ventas Totales', value: `$${stats.totalVentas.toFixed(2)}`, icon: DollarSign, color: 'bg-yellow-500', trend: 'Histórico' },
  ];

return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="w-6 h-6 text-white" /></div>
              <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold">
                <TrendingUp className="w-4 h-4" /> {stat.trend}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-800">Productos Más Vendidos</h2></div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800">{product.nombre}</p>
                    <p className="text-sm text-gray-600">{product.cantidad} unidades vendidas</p>
                  </div>
                  <p className="font-bold text-green-600">${product.total.toFixed(2)}</p>
                </div>
              ))}
              {stats.topProducts.length === 0 && <p className="text-gray-500">No hay ventas registradas por mostrar.</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h2></div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.pedidosRecientes.map((pedido) => (
                <div key={pedido.pedidoid} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    pedido.estado === 'Completado' ? 'bg-green-100' :
                    pedido.estado === 'En Proceso' ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      pedido.estado === 'Completado' ? 'text-green-600' :
                      pedido.estado === 'En Proceso' ? 'text-blue-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Pedido #{pedido.pedidoid}</p>
                    <p className="text-sm text-gray-600">
                      {pedido.cliente?.nombre || 'Cliente desconocido'} - ${Number(pedido.total).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">{pedido.estado}</p>
                  </div>
                </div>
              ))}
              {stats.pedidosRecientes.length === 0 && <p className="text-gray-500">No hay pedidos recientes.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}