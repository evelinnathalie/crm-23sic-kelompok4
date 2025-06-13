import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import Pesanan from "./Pages/Pesanan";
import Menu from "./Pages/Menu";
import CustomerManagement from "./Pages/CustomerManagement";

import EventManagement from "./Pages/Event";

import SalesManagement from "./Pages/SalesManagement";
import PromoManagement from "./Pages/Promosi";
import MemberManagement from "./Pages/Membership";


import ProductManagement from "./Pages/ProdukManagement";
import SalesManagement from "./Pages/SalesManagement";
import Reservasi from "./Pages/Reservasi";
import Stock from "./Pages/Stock";



function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pesanan" element={<Pesanan />} />
        <Route path="menu" element={<Menu />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/pelanggan" element={<CustomerManagement />} />
      <Route path="/event" element={<EventManagement />} />
      <Route path="/penjualan" element={<SalesManagement />} />

      <Route path="/promosi" element={<PromoManagement />} />
      <Route path="/member" element={<MemberManagement />} />

      <Route path="/reservasi" element={<Reservasi />} />

      <Route path="/stock" element={<Stock />} /> 



      </Route>
    </Routes>
  );
}

export default App;
