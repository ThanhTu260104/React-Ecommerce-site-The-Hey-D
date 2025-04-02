"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: "fas fa-chart-pie" },
  { href: "/admin/nguoi-dung", label: "Người dùng", icon: "fas fa-users" },
  { href: "/admin/category", label: "Danh mục sản phẩm", icon: "fas fa-th-large" },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
  { href: "/admin/danh-muc-tin", label: "Danh mục tin tức", icon: "fas fa-list" },
  { href: "/admin/tin-tuc", label: "Tin tức", icon: "fas fa-newspaper" },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: "fas fa-shopping-cart" },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: "fas fa-cog" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-gray-950 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Quản Trị</h1>
      </div>

      <div className="px-6 py-4 border-t border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60"
              alt="Admin Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold">Quản trị viên</h2>
            <p className="text-indigo-200 text-sm">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800"
              }`}
            >
              <i className={`${item.icon} w-5 h-5 mr-3`}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
