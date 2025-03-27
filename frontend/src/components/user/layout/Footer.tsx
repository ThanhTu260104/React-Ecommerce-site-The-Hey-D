import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-sky-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Thông tin công ty */}
          <div>
            <h3 className="text-2xl font-bold mb-4">The Hey D</h3>
            <p className="text-gray-300 mb-4">
              Chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-sky-400 transition-colors"
              >
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-sky-400 transition-colors"
              >
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-sky-400 transition-colors"
              >
                <i className="fab fa-youtube text-2xl"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-sky-400 transition-colors"
              >
                <i className="fab fa-tiktok text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sản phẩm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Khuyến mãi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tin tức
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Phương thức thanh toán
                </a>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
            <div className="space-y-3">
              <p className="flex items-center text-gray-300">
                <i className="fas fa-map-marker-alt w-6"></i>
                123 Đường ABC, Quận XYZ, TP.HCM
              </p>
              <p className="flex items-center text-gray-300">
                <i className="fas fa-phone w-6"></i>
                0123 456 789
              </p>
              <p className="flex items-center text-gray-300">
                <i className="fas fa-envelope w-6"></i>
                contact@theheyd.com
              </p>
              <p className="flex items-center text-gray-300">
                <i className="fas fa-clock w-6"></i>
                8:00 - 21:00, Thứ 2 - CN
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 The Hey D. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Image
                src="https://lh3.googleusercontent.com/ogw/AF2bZyhd6iUAL1OS0wLVvvcA6ZYuuYWzGROWFJylDsheewUvPJ4=s32-c-mo"
                alt="Visa"
                width={50}
                height={32}
              />
              <Image
                src="https://lh3.googleusercontent.com/ogw/AF2bZyhd6iUAL1OS0wLVvvcA6ZYuuYWzGROWFJylDsheewUvPJ4=s32-c-mo"
                alt="Mastercard"
                width={50}
                height={32}
              />
              <Image
                src="https://lh3.googleusercontent.com/ogw/AF2bZyhd6iUAL1OS0wLVvvcA6ZYuuYWzGROWFJylDsheewUvPJ4=s32-c-mo"
                alt="Momo"
                width={50}
                height={32}
              />
              <Image
                src="https://lh3.googleusercontent.com/ogw/AF2bZyhd6iUAL1OS0wLVvvcA6ZYuuYWzGROWFJylDsheewUvPJ4=s32-c-mo"
                alt="ZaloPay"
                width={50}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
