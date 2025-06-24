import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // pastikan path ini sesuai struktur project-mu
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f6]">
      {/* Sidebar tetap menempel di kiri */}
      <Sidebar />

      {/* Area kanan: Header + konten halaman */}
      <div className="ml-72 w-full flex flex-col">
        {/* Panggil Header yang kamu punya */}
        <Header />

        {/* Outlet untuk render halaman yang aktif */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
