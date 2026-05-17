// ============================================================================
// TIPOS DE DATOS - Sistema de Gestión de Tienda de Globos
// Basado en el Diagrama Entidad-Relación
// ============================================================================

// Tipos compuestos
export interface Nombre {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export interface Direccion {
  calle: string;
  numero: string;
  ciudad: string;
}

// ============================================================================
// USUARIOS
// ============================================================================

export interface Usuario {
  usuarioid: number;
  nombre: Nombre;
  correo: string;
  contraseña: string;
}

export interface Administrador extends Usuario {
  nivel_acceso?: string;
}

export interface Cliente {
  clienteid: number; // Puede ser FK de Usuario
  nombre: Nombre;
  correo: string;
  telefono: string;
  direccion: Direccion;
}

// ============================================================================
// PRODUCTOS Y CATEGORÍAS
// ============================================================================

export interface Categoria {
  categoriaid: number;
  nombre: string;
}

export interface Producto {
  productoid: number;
  nombre: string;
  precio: number;
  stock: number;
  tipo: string;
  categoriaid: number;
}

// ============================================================================
// PEDIDOS
// ============================================================================

export type EstadoPedido =
  | "Pendiente"
  | "En Proceso"
  | "Completado"
  | "Cancelado"
  | "Entregado";

export interface Pedido {
  pedidoid: number;
  fecha: string;
  total: number;
  estado: EstadoPedido;
  clienteID: number;
}

export interface DetallePedido {
  pedidoid: number;
  productoid: number;
  cantidad: number;
  precio_venta: number;
  subtotal: number;
}

// ============================================================================
// PAGOS
// ============================================================================

export type TipoPago =
  | "Efectivo"
  | "Tarjeta"
  | "Transferencia"
  | "Otro";
export type EstadoPago =
  | "Pendiente"
  | "Completado"
  | "Rechazado"
  | "Reembolsado";

export interface Pago {
  pagoid: number;
  tipo: TipoPago;
  monto: number;
  fecha: string;
  estado: EstadoPago;
  pedidoid: number;
}

// ============================================================================
// PROVEEDORES Y COMPRAS
// ============================================================================

export interface Proveedor {
  proveedorid: number;
  empresa: string;
  telefono: string;
  direccion: Direccion;
}

export type EstadoCompra =
  | "Pendiente"
  | "En Proceso"
  | "Recibida"
  | "Cancelada";

export interface Compra {
  compraid: number;
  fecha: string;
  estado: EstadoCompra;
  total: number;
  proveedorid: number;
  usuarioID: number; // Usuario que realizó la compra
}

export interface DetalleCompra {
  compraid: number;
  productoid: number;
  cantidad: number;
  costo_unitario: number;
  unidad_medida: string;
}

// ============================================================================
// TIPOS EXTENDIDOS CON RELACIONES (Para las vistas)
// ============================================================================

export interface PedidoConDetalles extends Pedido {
  cliente?: Cliente;
  detalles?: (DetallePedido & { producto?: Producto })[];
  pago?: Pago;
}

export interface CompraConDetalles extends Compra {
  proveedor?: Proveedor;
  usuario?: Usuario;
  detalles?: (DetalleCompra & { producto?: Producto })[];
}

export interface ProductoConCategoria extends Producto {
  categoria?: Categoria;
}

// ============================================================================
// TIPOS PARA CARRITO DE COMPRAS (Cliente)
// ============================================================================

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}