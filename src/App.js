import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/AuthenForm/Login";
import ErrorPage from "./pages/ErrorPage";
import ProductsManagement from "./pages/ProductsManagement";
import OrdersManagement from "./pages/OrdersManagement";
import UsersManagement from "./pages/UsersManagement";
import UserOrdersDetails from "./pages/UserOrdersDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="users/:id" element={<UserOrdersDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
