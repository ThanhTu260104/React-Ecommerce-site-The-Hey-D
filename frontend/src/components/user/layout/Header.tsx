"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter để điều hướng
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn chặn reload trang
    if (!searchTerm.trim()) return; // Không tìm kiếm nếu chuỗi rỗng
    router.push(`/user/search?tu_khoa=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="bg-sky-950 text-white py-5 px-10 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold animate-pulse">The Hey D</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="hover:text-blue-200 transition duration-300"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/user/product"
                className="hover:text-blue-200 transition duration-300"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href="/user/news"
                className="hover:text-blue-200 transition duration-300"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-200 transition duration-300"
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-200 transition duration-300"
              >
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-sky-900 text-white px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <i className="fas fa-search text-gray-300 hover:text-white"></i>
            </button>
          </form>
          <div className="flex space-x-6 items-center">
            <Link href="/user/cart">
              <button className="relative p-2 hover:bg-sky-800 rounded-full transition duration-300">
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  3
                </span>
              </button>
            </Link>
            <a href="#" className="hover:text-blue-200 transition duration-300">
              Đăng nhập
            </a>
            <a href="#" className="hover:text-blue-200 transition duration-300">
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
