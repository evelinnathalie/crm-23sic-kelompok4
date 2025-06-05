import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard";
import Pesanan from "./Pages/Pesanan";
import Menu from "./Pages/Menu";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pesanan" element={<Pesanan />} />
        <Route path="menu" element={<Menu />} />
      </Route>
    </Routes>
  );
}

export default App;
