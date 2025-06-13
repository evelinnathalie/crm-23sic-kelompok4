import { Routes,Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import CustomerManagement from "./Pages/CustomerManagement";

import EventManagement from "./Pages/Event";
import SalesManagement from "./Pages/SalesManagement";
import PromoManagement from "./Pages/Promosi";
import MemberManagement from "./Pages/Membership";


function App() {
  return(
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pelanggan" element={<CustomerManagement />} />
      <Route path="/event" element={<EventManagement />} />
      <Route path="/penjualan" element={<SalesManagement />} />
      <Route path="/promosi" element={<PromoManagement />} />
      <Route path="/member" element={<MemberManagement />} />
      </Route>
    </Routes>
  )
}

export default App;