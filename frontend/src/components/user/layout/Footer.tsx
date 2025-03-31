import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
      {/* 7. Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">The Hey D</h3>
              <p className="mb-4">
                Đối tác tin cậy của bạn trong việc cung cấp sản phẩm chất lượng
                cao.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-gray-300 transition">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/product"
                    className="hover:text-gray-300 transition"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Chính sách</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300 transition">
                    Điều khoản dịch vụ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i> 123 Đường ABC,
                  Quận XYZ, TP. HCM
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2"></i> (028) 1234 5678
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i> info@theheyd.com
                </li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-2xl hover:text-gray-300 transition">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-2xl hover:text-gray-300 transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-2xl hover:text-gray-300 transition">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} The Hey D. Tất cả các quyền được
              bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
