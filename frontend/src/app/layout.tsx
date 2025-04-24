"use client";

import { Provider } from "react-redux";
import { store } from "../lib/store";
import { Quicksand } from "next/font/google";
import { usePathname } from "next/navigation";
import Header from "../components/user/layout/Header";

import "./globals.css";

// Import các component giao diện chung
import Footer from "../components/user/layout/Footer";
// import Header from "../components/user/layout/Header";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // ⚠️ Những route KHÔNG muốn hiển thị Header/Footer
  const hideLayout = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <Provider store={store}>
      <html lang="vi">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            
          />

        </head>
        <body className={`${quicksand.variable} font-sans`}>
          <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Hiển thị header nếu không thuộc admin/auth */}
            {!hideLayout && <Header />}

            <main className="flex-grow">{children}</main>

            {/* Hiển thị footer nếu không thuộc admin/auth */}
            {!hideLayout && <Footer />}
          </div>
        </body>
      </html>
    </Provider>
  );
}
