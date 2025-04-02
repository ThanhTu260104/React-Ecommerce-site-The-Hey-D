// src/app/user/layout.tsx
"use client";

import { ReactNode } from "react";
import Header from "@/components/user/layout/Header";
import Footer from "@/components/user/layout/Footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
    <Header></Header>
      <main className="flex-1 px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
