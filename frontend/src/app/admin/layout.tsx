// src/app/admin/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import Sidebar from "@/components/admin/layout/Sidebar";
// import Header from "@/components/admin/layout/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false); // Track verification status

  useEffect(() => {
    // Check if we're running on the client before accessing sessionStorage
    if (typeof window === 'undefined') return;

    // Get authentication data from sessionStorage
    const userAuthString = sessionStorage.getItem('userAuth');
    console.log("userAuth string in sessionStorage:", userAuthString);

    let isAdmin = false;

    if (userAuthString) {
      try {
        // Parse the data
        const userAuth = JSON.parse(userAuthString);
        console.log("Parsed userAuth:", userAuth);
        
        // Check for token AND admin role (vai_tro === 1)
        if (userAuth?.token && userAuth?.info) {
          console.log("vai_tro value:", userAuth.info.vai_tro);
          console.log("vai_tro type:", typeof userAuth.info.vai_tro);
          
          if (userAuth.info.vai_tro === 1) {
            isAdmin = true;
            console.log("Admin verified in layout");
          } else {
            console.log("Not admin role - vai_tro:", userAuth.info.vai_tro);
          }
        } else {
          console.log("Missing token or info in userAuth");
        }
      } catch (error) {
        console.error("Error parsing auth data in layout:", error);
        // Clear invalid data
        sessionStorage.removeItem('userAuth'); 
      }
    } else {
      console.log("No userAuth found in sessionStorage");
    }

    // Redirect if not admin
    if (!isAdmin) {
      alert('Bạn cần đăng nhập với quyền quản trị để truy cập khu vực này.'); 
      router.push('/auth/login'); 
    } else {
      setIsVerified(true); // Allow rendering children
    }
  }, [router]);

  // Show loading indicator until verification completes
  if (!isVerified) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Render the layout and children if verification passed
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
