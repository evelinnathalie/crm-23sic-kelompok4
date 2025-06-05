import { Routes,Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import CustomerManagement from "./Pages/CustomerManagement";

import EventManagement from "./Pages/Event";

import ProductManagement from "./Pages/Produk";
import SalesManagement from "./Pages/SalesManagement";
import Reservasi from "./Pages/Reservasi";


function App() {
  return(
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pelanggan" element={<CustomerManagement />} />
      <Route path="/event" element={<EventManagement />} />

      <Route path="/produk" element={<ProductManagement />} />
      <Route path="/penjualan" element={<SalesManagement />} />
      <Route path="/reservasi" element={<Reservasi />} />

      </Route>
    </Routes>
  )
}

export default App;