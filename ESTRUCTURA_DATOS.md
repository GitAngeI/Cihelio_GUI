# Estructura de Datos - Tienda de Globos

Este documento describe la implementación de la estructura de datos basada en el diagrama entidad-relación proporcionado.

## 📁 Archivos Principales

### `/src/app/types/index.ts`
Contiene todas las definiciones de tipos TypeScript basadas en las entidades del diagrama ER.

### `/src/app/data/mockData.ts`
Contiene datos de prueba completos para todas las entidades del sistema.

## 🗂️ Entidades Implementadas

### 1. **Usuario**
- UsuarioID (PK)
- Nombre (compuesto: nombre, apellido_paterno, apellido_materno)
- Correo
- Contraseña

### 2. **Administrador**
Extiende Usuario
- UsuarioID (PK, FK)
- Nivel_acceso

### 3. **Cliente**
- ClienteID (PK)
- Nombre (compuesto: nombre, apellido_paterno, apellido_materno)
- Correo
- Teléfono
- Dirección (compuesta: calle, número, ciudad)

### 4. **Producto**
- ProductoID (PK)
- Nombre
- Precio
- Stock
- Tipo
- CategoriaID (FK)

### 5. **Categoría**
- CategoriaID (PK)
- Nombre

**Categorías disponibles:**
- Látex
- Metalizados
- Número
- Personajes
- Temáticos

### 6. **Pedido**
- PedidoID (PK)
- Fecha
- Total
- Estado (Pendiente | En Proceso | Completado | Entregado | Cancelado)
- ClienteID (FK)

### 7. **Detalle_Pedido**
- PedidoID (PK, FK)
- ProductoID (PK, FK)
- Cantidad
- Precio_venta
- Subtotal

### 8. **Pago**
- PagoID (PK)
- Tipo (Efectivo | Tarjeta | Transferencia | Otro)
- Monto
- Fecha
- Estado (Pendiente | Completado | Rechazado | Reembolsado)
- PedidoID (FK)

### 9. **Proveedor**
- ProveedorID (PK)
- Empresa
- Teléfono
- Dirección (compuesta: calle, número, ciudad)

### 10. **Compra**
- CompraID (PK)
- Fecha
- Estado (Pendiente | En Proceso | Recibida | Cancelada)
- Total
- ProveedorID (FK)
- UsuarioID (FK)

### 11. **Detalle_Compra**
- CompraID (PK, FK)
- ProductoID (PK, FK)
- Cantidad
- Costo_unitario
- Unidad_medida

## 📊 Datos de Prueba

El sistema incluye datos de prueba completos:

- **5 Clientes** con información completa (nombre completo, dirección, teléfono, correo)
- **12 Productos** de diferentes categorías (Látex, Metalizados, Número, Personajes, Temáticos)
- **5 Categorías** de productos
- **3 Proveedores** con direcciones completas
- **6 Pedidos** con sus respectivos detalles
- **6 Pagos** asociados a pedidos
- **4 Compras** a proveedores con detalles de productos

## 🔗 Relaciones Implementadas

### Relaciones Principales:
1. **Cliente → Pedido** (1:N)
2. **Pedido → Detalle_Pedido** (1:N)
3. **Producto → Detalle_Pedido** (1:N)
4. **Pedido → Pago** (1:1)
5. **Categoría → Producto** (1:N)
6. **Proveedor → Compra** (1:N)
7. **Usuario → Compra** (1:N)
8. **Compra → Detalle_Compra** (1:N)
9. **Producto → Detalle_Compra** (1:N)

## 🛠️ Funciones Helper

El archivo `mockData.ts` incluye funciones helper para facilitar el acceso a datos relacionados:

- `getClienteById(clienteID)` - Obtener cliente por ID
- `getProductoById(productoID)` - Obtener producto por ID
- `getCategoriaById(categoriaID)` - Obtener categoría por ID
- `getProveedorById(proveedorID)` - Obtener proveedor por ID
- `getUsuarioById(usuarioID)` - Obtener usuario por ID
- `getDetallesPorPedido(pedidoID)` - Obtener detalles de un pedido
- `getDetallesPorCompra(compraID)` - Obtener detalles de una compra
- `getPagoPorPedido(pedidoID)` - Obtener pago de un pedido
- `getNombreCompleto(nombre)` - Formatear nombre compuesto
- `getDireccionCompleta(direccion)` - Formatear dirección compuesta

## 📱 Páginas que Usan los Datos

### Administrador:
- **Home** - Dashboard con estadísticas calculadas desde los datos reales
- **Clientes** - Lista completa de clientes con nombre completo y dirección
- **Productos** - Lista de productos con categoría y tipo
- **Pedidos** - Pedidos con cliente, fecha, total y estado
- **Compras** - Compras con proveedor, usuario y estado
- **Proveedores** - Listado de proveedores con direcciones
- **Pagos** - Pagos con información de pedido y cliente
- **Esquema DB** - Visualización del diagrama ER y documentación de entidades

### Empleado:
- **Pedidos** - Gestión de pedidos con información de clientes
- **Productos** - Gestión de inventario con categorías

### Cliente:
- **Catálogo** - Productos con categorías y precios
- **Pedidos** - Historial de pedidos del cliente

## 🎨 Características Especiales

### Atributos Compuestos
Los atributos compuestos se implementan como interfaces TypeScript:

```typescript
interface Nombre {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

interface Direccion {
  calle: string;
  numero: string;
  ciudad: string;
}
```

### Estados con Tipos
Los estados están implementados como tipos TypeScript para mayor seguridad:

```typescript
type EstadoPedido = 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado' | 'Entregado';
type TipoPago = 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otro';
type EstadoPago = 'Pendiente' | 'Completado' | 'Rechazado' | 'Reembolsado';
type EstadoCompra = 'Pendiente' | 'En Proceso' | 'Recibida' | 'Cancelada';
```

## 📈 Estadísticas y Reportes

El panel de administración calcula estadísticas en tiempo real:
- Total de clientes
- Total de productos
- Total de pedidos
- Suma de ventas totales
- Productos más vendidos (ordenados por cantidad de unidades)
- Pedidos recientes

## 🔍 Visualización del Esquema

La página **Esquema DB** (`/admin/esquema`) proporciona:
1. Diagrama Entidad-Relación visual
2. Lista de todas las entidades con sus atributos
3. Identificación visual de llaves primarias (🔑) y foráneas (🔗)
4. Leyenda explicativa

## 📝 Notas de Implementación

- Todos los IDs son números enteros
- Las fechas se almacenan en formato ISO (YYYY-MM-DD)
- Los precios y montos son números decimales (number en TypeScript)
- Las relaciones muchos-a-muchos se implementan con tablas de detalle
- Los datos de prueba son coherentes y reflejan relaciones válidas entre entidades
