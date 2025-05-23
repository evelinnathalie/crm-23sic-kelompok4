import { Routes,Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import SalesManagement from "./Pages/SalesManagement";

function App() {
  return(
    <Routes>
      <Route element={<MainLayout />}>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/penjualan" element={<SalesManagement />} />
      </Route>
    </Routes>
  )
}

export default App;