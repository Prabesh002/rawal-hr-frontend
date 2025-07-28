import { Outlet } from "react-router-dom"; 

import { Navbar } from "@/modules/core/components/Navbar";

export default function DefaultLayout() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        <Outlet /> 
      </main>
    </div>
  );
}