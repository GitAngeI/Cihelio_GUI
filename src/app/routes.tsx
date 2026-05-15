import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import ClientLayout from "./layouts/ClientLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import AdminLayout from "./layouts/AdminLayout";
import Chat from "./pages/Chat";

// Cliente pages
import ClientCatalog from "./pages/client/Catalog";
import ClientCart from "./pages/client/Cart";
import ClientOrders from "./pages/client/Orders";

// Employee pages
import EmployeeHome from "./pages/employee/Home";
import EmployeeOrders from "./pages/employee/Orders";
import EmployeeProducts from "./pages/employee/Products";
import CreateOrder from "./pages/employee/CreateOrder";

// Admin pages
import AdminHome from "./pages/admin/Home";
import AdminClients from "./pages/admin/Clients";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminPurchases from "./pages/admin/Purchases";
import AdminProviders from "./pages/admin/Providers";
import AdminPayments from "./pages/admin/Payments";
import AdminSchema from "./pages/admin/Schema";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/cliente",
    Component: ClientLayout,
    children: [
      { index: true, Component: ClientCatalog },
      { path: "carrito", Component: ClientCart },
      { path: "pedidos", Component: ClientOrders },
      { path: "chat", Component: Chat },
    ],
  },
  {
    path: "/empleado",
    Component: EmployeeLayout,
    children: [
      { index: true, Component: EmployeeHome },
      { path: "pedidos", Component: EmployeeOrders },
      { path: "productos", Component: EmployeeProducts },
      { path: "crear-pedido", Component: CreateOrder },
      { path: "chat", Component: Chat },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminHome },
      { path: "clientes", Component: AdminClients },
      { path: "productos", Component: AdminProducts },
      { path: "pedidos", Component: AdminOrders },
      { path: "compras", Component: AdminPurchases },
      { path: "proveedores", Component: AdminProviders },
      { path: "pagos", Component: AdminPayments },
      { path: "chat", Component: Chat },
    ],
  },
]);