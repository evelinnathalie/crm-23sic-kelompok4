import { Routes,Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import CustomerManagement from "./Pages/CustomerManagement";
import ProductManagement from "./Pages/Produk";
import SalesManagement from "./Pages/SalesManagement";

function App() {
  return(
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pelanggan" element={<CustomerManagement />} />
      <Route path="/produk" element={<ProductManagement />} />
      <Route path="/penjualan" element={<SalesManagement />} />
      </Route>
    </Routes>
  )
}

export default App;