"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/user/search?tu_khoa=${encodeURIComponent(searchTerm)}`);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAuthDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-black py-5 px-10 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">The Hey D</Link>
        </h1>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 transition duration-300"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/user/product"
                className="hover:text-blue-600 transition duration-300"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                href="/user/news"
                className="hover:text-blue-600 transition duration-300"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-600 transition duration-300"
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-600 transition duration-300"
              >
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-gray-100 text-black px-4 py-2 rounded-full w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <i className="fas fa-search text-gray-500 hover:text-black"></i>
            </button>
          </form>

          <div className="flex space-x-6 items-center">
            <Link href="/user/cart">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition duration-300">
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  3
                </span>
              </button>
            </Link>

            {/* Icon thông tin tài khoản */}
            {/* <Link href="/user/account-info">
              <button className="p-2 hover:bg-gray-100 rounded-full transition duration-300">
                <i className="fas fa-address-card text-xl"></i>
              </button>
            </Link> */}

            {/* Icon đăng nhập với dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition duration-300"
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
              >
                <i className="fas fa-user text-xl"></i>
              </button>

              {/* Dropdown menu */}
              {showAuthDropdown && (
                <div className="absolute right-0 mt-8 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <p className="text-sm leading-5">Tài khoản</p>
                  </div>

                  {/* Phần cho người dùng chưa đăng nhập */}
                  <div className="guest-options">
                    <Link
                      href="/user/login"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-sign-in-alt mr-2 text-sky-600"></i>
                      Đăng nhập
                    </Link>
                    <Link
                      href="/user/register"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-user-plus mr-2 text-sky-600"></i>
                      Đăng ký
                    </Link>
                    {/* <Link 
                      href="/user/forgot-password"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-key mr-2 text-sky-600"></i>
                      Quên mật khẩu
                    </Link> */}
                  </div>

                  {/* Phần cho người dùng đã đăng nhập (có thể ẩn/hiện dựa vào trạng thái đăng nhập) */}
                  {/* <div className="user-options">
                    <Link 
                      href="/user/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-user-circle mr-2 text-sky-600"></i>
                      Thông tin tài khoản
                    </Link>
                    <Link 
                      href="/user/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-shopping-bag mr-2 text-sky-600"></i>
                      Đơn hàng của tôi
                    </Link>
                    <Link 
                      href="/user/wishlist"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-heart mr-2 text-sky-600"></i>
                      Danh sách yêu thích
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition duration-150 text-red-500"
                      onClick={() => console.log("Đăng xuất")}
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Đăng xuất
                    </button>
                  </div> */}
                </div>
              )}
            </div>

            {/* Icon menu cho mobile */}
            <button className="p-2 md:hidden hover:bg-gray-100 rounded-full transition duration-300">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
