// src/app/admin/layout.tsx
"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/admin/layout/Sidebar";
// import Header from "@/components/admin/layout/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
       {/* role="admin" */}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
     
        <main className="p-6 flex-1">{children}</main>
      </div>
      
    </div>
  );
}
