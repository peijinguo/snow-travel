import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../views/frontend/Home";
import Products from "../views/frontend/Products";
import SingleProduct from "../views/frontend/SingleProduct";
import Cart from "../views/frontend/Cart";
import Checkout from "../views/frontend/Checkout";
import CheckoutSuccess from "../views/frontend/CheckoutSuccess";
import WishList from "../views/frontend/WishList";
import Login from "../views/admin/Login";
import AdminProducts from "../views/admin/AdminProducts";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "checkout-success/:orderId",
        element: <CheckoutSuccess />,
      },
      {
        path: "wishlist",
        element: <WishList />,
      },
      // 後台登入
      {
        path: "/login",
        element: <Login />,
      },
      // 後台產品管理
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
    ],
  },
]);
