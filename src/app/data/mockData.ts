// ============================================================================
// DATOS DE PRUEBA - Sistema de Gestión de Tienda de Globos
// ============================================================================

import {
  Usuario,
  Administrador,
  Cliente,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  Pago,
  Proveedor,
  Compra,
  DetalleCompra,
} from '../types';

// ============================================================================
// USUARIOS
// ============================================================================

export const usuarios: Usuario[] = [
  {
    usuarioID: 1,
    nombre: {
      nombre: 'Juan',
      apellido_paterno: 'Pérez',
      apellido_materno: 'García'
    },
    correo: 'juan.perez@example.com',
    contraseña: 'password123'
  },
  {
    usuarioID: 2,
    nombre: {
      nombre: 'María',
      apellido_paterno: 'González',
      apellido_materno: 'López'
    },
    correo: 'maria.gonzalez@example.com',
    contraseña: 'password123'
  },
  {
    usuarioID: 3,
    nombre: {
      nombre: 'Carlos',
      apellido_paterno: 'Rodríguez',
      apellido_materno: 'Martínez'
    },
    correo: 'carlos.rodriguez@example.com',
    contraseña: 'password123'
  }
];

export const administradores: Administrador[] = [
  {
    ...usuarios[0],
    nivel_acceso: 'Total'
  }
];

export const clientes: Cliente[] = [
  {
    clienteID: 1,
    nombre: {
      nombre: 'Ana',
      apellido_paterno: 'Martínez',
      apellido_materno: 'Hernández'
    },
    correo: 'ana.martinez@example.com',
    telefono: '555-0101',
    direccion: {
      calle: 'Av. Principal',
      numero: '123',
      ciudad: 'Ciudad de México'
    }
  },
  {
    clienteID: 2,
    nombre: {
      nombre: 'Luis',
      apellido_paterno: 'Fernández',
      apellido_materno: 'Sánchez'
    },
    correo: 'luis.fernandez@example.com',
    telefono: '555-0102',
    direccion: {
      calle: 'Calle Secundaria',
      numero: '456',
      ciudad: 'Guadalajara'
    }
  },
  {
    clienteID: 3,
    nombre: {
      nombre: 'Carmen',
      apellido_paterno: 'López',
      apellido_materno: 'Torres'
    },
    correo: 'carmen.lopez@example.com',
    telefono: '555-0103',
    direccion: {
      calle: 'Blvd. Norte',
      numero: '789',
      ciudad: 'Monterrey'
    }
  },
  {
    clienteID: 4,
    nombre: {
      nombre: 'Roberto',
      apellido_paterno: 'Ramírez',
      apellido_materno: 'Cruz'
    },
    correo: 'roberto.ramirez@example.com',
    telefono: '555-0104',
    direccion: {
      calle: 'Calle Centro',
      numero: '321',
      ciudad: 'Puebla'
    }
  },
  {
    clienteID: 5,
    nombre: {
      nombre: 'Patricia',
      apellido_paterno: 'Morales',
      apellido_materno: 'Vega'
    },
    correo: 'patricia.morales@example.com',
    telefono: '555-0105',
    direccion: {
      calle: 'Av. Reforma',
      numero: '654',
      ciudad: 'Querétaro'
    }
  }
];

// ============================================================================
// CATEGORÍAS Y PRODUCTOS
// ============================================================================

export const categorias: Categoria[] = [
  { categoriaID: 1, nombre: 'Látex' },
  { categoriaID: 2, nombre: 'Metalizados' },
  { categoriaID: 3, nombre: 'Número' },
  { categoriaID: 4, nombre: 'Personajes' },
  { categoriaID: 5, nombre: 'Temáticos' }
];

export const productos: Producto[] = [
  {
    productoID: 1,
    nombre: 'Globo Látex Rojo',
    precio: 15.00,
    stock: 500,
    tipo: 'Látex',
    categoriaID: 1
  },
  {
    productoID: 2,
    nombre: 'Globo Látex Azul',
    precio: 15.00,
    stock: 450,
    tipo: 'Látex',
    categoriaID: 1
  },
  {
    productoID: 3,
    nombre: 'Globo Látex Rosa',
    precio: 15.00,
    stock: 400,
    tipo: 'Látex',
    categoriaID: 1
  },
  {
    productoID: 4,
    nombre: 'Globo Metalizado Corazón',
    precio: 45.00,
    stock: 200,
    tipo: 'Metalizado',
    categoriaID: 2
  },
  {
    productoID: 5,
    nombre: 'Globo Metalizado Estrella',
    precio: 40.00,
    stock: 180,
    tipo: 'Metalizado',
    categoriaID: 2
  },
  {
    productoID: 6,
    nombre: 'Globo Número 0',
    precio: 80.00,
    stock: 50,
    tipo: 'Número',
    categoriaID: 3
  },
  {
    productoID: 7,
    nombre: 'Globo Número 1',
    precio: 80.00,
    stock: 50,
    tipo: 'Número',
    categoriaID: 3
  },
  {
    productoID: 8,
    nombre: 'Globo Spider-Man',
    precio: 60.00,
    stock: 75,
    tipo: 'Personaje',
    categoriaID: 4
  },
  {
    productoID: 9,
    nombre: 'Globo Princesa Elsa',
    precio: 60.00,
    stock: 80,
    tipo: 'Personaje',
    categoriaID: 4
  },
  {
    productoID: 10,
    nombre: 'Globo Baby Shower',
    precio: 55.00,
    stock: 100,
    tipo: 'Temático',
    categoriaID: 5
  },
  {
    productoID: 11,
    nombre: 'Globo Cumpleaños',
    precio: 50.00,
    stock: 150,
    tipo: 'Temático',
    categoriaID: 5
  },
  {
    productoID: 12,
    nombre: 'Globo Boda',
    precio: 65.00,
    stock: 90,
    tipo: 'Temático',
    categoriaID: 5
  }
];

// ============================================================================
// PROVEEDORES
// ============================================================================

export const proveedores: Proveedor[] = [
  {
    proveedorID: 1,
    empresa: 'Distribuidora de Globos SA',
    telefono: '555-1001',
    direccion: {
      calle: 'Av. Industrial',
      numero: '100',
      ciudad: 'Ciudad de México'
    }
  },
  {
    proveedorID: 2,
    empresa: 'Globos y Más',
    telefono: '555-1002',
    direccion: {
      calle: 'Calle Comercio',
      numero: '200',
      ciudad: 'Guadalajara'
    }
  },
  {
    proveedorID: 3,
    empresa: 'Party Supplies Inc',
    telefono: '555-1003',
    direccion: {
      calle: 'Blvd. Importadores',
      numero: '300',
      ciudad: 'Monterrey'
    }
  }
];

// ============================================================================
// COMPRAS
// ============================================================================

export const compras: Compra[] = [
  {
    compraID: 1,
    fecha: '2026-03-01',
    estado: 'Recibida',
    total: 15000.00,
    proveedorID: 1,
    usuarioID: 1
  },
  {
    compraID: 2,
    fecha: '2026-03-10',
    estado: 'Recibida',
    total: 8500.00,
    proveedorID: 2,
    usuarioID: 1
  },
  {
    compraID: 3,
    fecha: '2026-03-15',
    estado: 'En Proceso',
    total: 12000.00,
    proveedorID: 3,
    usuarioID: 1
  },
  {
    compraID: 4,
    fecha: '2026-03-20',
    estado: 'Pendiente',
    total: 9500.00,
    proveedorID: 1,
    usuarioID: 2
  }
];

export const detallesCompra: DetalleCompra[] = [
  // Compra 1
  {
    compraID: 1,
    productoID: 1,
    cantidad: 500,
    costo_unitario: 8.00,
    unidad_medida: 'pieza'
  },
  {
    compraID: 1,
    productoID: 2,
    cantidad: 500,
    costo_unitario: 8.00,
    unidad_medida: 'pieza'
  },
  {
    compraID: 1,
    productoID: 3,
    cantidad: 500,
    costo_unitario: 8.00,
    unidad_medida: 'pieza'
  },
  // Compra 2
  {
    compraID: 2,
    productoID: 4,
    cantidad: 200,
    costo_unitario: 25.00,
    unidad_medida: 'pieza'
  },
  {
    compraID: 2,
    productoID: 5,
    cantidad: 200,
    costo_unitario: 22.00,
    unidad_medida: 'pieza'
  },
  // Compra 3
  {
    compraID: 3,
    productoID: 6,
    cantidad: 100,
    costo_unitario: 50.00,
    unidad_medida: 'pieza'
  },
  {
    compraID: 3,
    productoID: 7,
    cantidad: 100,
    costo_unitario: 50.00,
    unidad_medida: 'pieza'
  },
  {
    compraID: 3,
    productoID: 8,
    cantidad: 100,
    costo_unitario: 35.00,
    unidad_medida: 'pieza'
  }
];

// ============================================================================
// PEDIDOS
// ============================================================================

export const pedidos: Pedido[] = [
  {
    pedidoID: 1,
    fecha: '2026-03-18',
    total: 450.00,
    estado: 'Completado',
    clienteID: 1
  },
  {
    pedidoID: 2,
    fecha: '2026-03-19',
    total: 280.00,
    estado: 'En Proceso',
    clienteID: 2
  },
  {
    pedidoID: 3,
    fecha: '2026-03-20',
    total: 625.00,
    estado: 'Pendiente',
    clienteID: 3
  },
  {
    pedidoID: 4,
    fecha: '2026-03-21',
    total: 180.00,
    estado: 'Entregado',
    clienteID: 1
  },
  {
    pedidoID: 5,
    fecha: '2026-03-22',
    total: 890.00,
    estado: 'En Proceso',
    clienteID: 4
  },
  {
    pedidoID: 6,
    fecha: '2026-03-23',
    total: 340.00,
    estado: 'Pendiente',
    clienteID: 5
  }
];

export const detallesPedido: DetallePedido[] = [
  // Pedido 1
  {
    pedidoID: 1,
    productoID: 1,
    cantidad: 10,
    precio_venta: 15.00,
    subtotal: 150.00
  },
  {
    pedidoID: 1,
    productoID: 4,
    cantidad: 5,
    precio_venta: 45.00,
    subtotal: 225.00
  },
  {
    pedidoID: 1,
    productoID: 10,
    cantidad: 1,
    precio_venta: 55.00,
    subtotal: 55.00
  },
  // Pedido 2
  {
    pedidoID: 2,
    productoID: 2,
    cantidad: 8,
    precio_venta: 15.00,
    subtotal: 120.00
  },
  {
    pedidoID: 2,
    productoID: 6,
    cantidad: 2,
    precio_venta: 80.00,
    subtotal: 160.00
  },
  // Pedido 3
  {
    pedidoID: 3,
    productoID: 8,
    cantidad: 3,
    precio_venta: 60.00,
    subtotal: 180.00
  },
  {
    pedidoID: 3,
    productoID: 9,
    cantidad: 2,
    precio_venta: 60.00,
    subtotal: 120.00
  },
  {
    pedidoID: 3,
    productoID: 11,
    cantidad: 5,
    precio_venta: 50.00,
    subtotal: 250.00
  },
  // Pedido 4
  {
    pedidoID: 4,
    productoID: 3,
    cantidad: 12,
    precio_venta: 15.00,
    subtotal: 180.00
  },
  // Pedido 5
  {
    pedidoID: 5,
    productoID: 7,
    cantidad: 3,
    precio_venta: 80.00,
    subtotal: 240.00
  },
  {
    pedidoID: 5,
    productoID: 12,
    cantidad: 10,
    precio_venta: 65.00,
    subtotal: 650.00
  },
  // Pedido 6
  {
    pedidoID: 6,
    productoID: 5,
    cantidad: 5,
    precio_venta: 40.00,
    subtotal: 200.00
  },
  {
    pedidoID: 6,
    productoID: 10,
    cantidad: 2,
    precio_venta: 55.00,
    subtotal: 110.00
  }
];

// ============================================================================
// PAGOS
// ============================================================================

export const pagos: Pago[] = [
  {
    pagoID: 1,
    tipo: 'Tarjeta',
    monto: 450.00,
    fecha: '2026-03-18',
    estado: 'Completado',
    pedidoID: 1
  },
  {
    pagoID: 2,
    tipo: 'Efectivo',
    monto: 280.00,
    fecha: '2026-03-19',
    estado: 'Pendiente',
    pedidoID: 2
  },
  {
    pagoID: 3,
    tipo: 'Transferencia',
    monto: 625.00,
    fecha: '2026-03-20',
    estado: 'Pendiente',
    pedidoID: 3
  },
  {
    pagoID: 4,
    tipo: 'Tarjeta',
    monto: 180.00,
    fecha: '2026-03-21',
    estado: 'Completado',
    pedidoID: 4
  },
  {
    pagoID: 5,
    tipo: 'Transferencia',
    monto: 890.00,
    fecha: '2026-03-22',
    estado: 'Pendiente',
    pedidoID: 5
  },
  {
    pagoID: 6,
    tipo: 'Efectivo',
    monto: 340.00,
    fecha: '2026-03-23',
    estado: 'Pendiente',
    pedidoID: 6
  }
];

// ============================================================================
// FUNCIONES HELPER PARA OBTENER DATOS RELACIONADOS
// ============================================================================

export const getClienteById = (clienteID: number): Cliente | undefined => {
  return clientes.find(c => c.clienteID === clienteID);
};

export const getProductoById = (productoID: number): Producto | undefined => {
  return productos.find(p => p.productoID === productoID);
};

export const getCategoriaById = (categoriaID: number): Categoria | undefined => {
  return categorias.find(c => c.categoriaID === categoriaID);
};

export const getProveedorById = (proveedorID: number): Proveedor | undefined => {
  return proveedores.find(p => p.proveedorID === proveedorID);
};

export const getUsuarioById = (usuarioID: number): Usuario | undefined => {
  return usuarios.find(u => u.usuarioID === usuarioID);
};

export const getDetallesPorPedido = (pedidoID: number): DetallePedido[] => {
  return detallesPedido.filter(d => d.pedidoID === pedidoID);
};

export const getDetallesPorCompra = (compraID: number): DetalleCompra[] => {
  return detallesCompra.filter(d => d.compraID === compraID);
};

export const getPagoPorPedido = (pedidoID: number): Pago | undefined => {
  return pagos.find(p => p.pedidoID === pedidoID);
};

export const getNombreCompleto = (nombre: { nombre: string; apellido_paterno: string; apellido_materno: string }): string => {
  return `${nombre.nombre} ${nombre.apellido_paterno} ${nombre.apellido_materno}`;
};

export const getDireccionCompleta = (direccion: { calle: string; numero: string; ciudad: string }): string => {
  return `${direccion.calle} #${direccion.numero}, ${direccion.ciudad}`;
};
