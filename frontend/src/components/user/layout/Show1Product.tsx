"use client"
import { ISanPham } from "../data/Data";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { themSanPham } from "@/lib/cartSlice";

// Định dạng giá: 1.234.567đ
function formatPrice(price: number | null | undefined) {
  if (price === null || price === undefined || isNaN(price)) {
    return "0đ"; // Return a default value if price is not valid
  }
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default function Show1Product(props: { item: ISanPham }) {
  const { item } = props;
  const dispatch = useDispatch();
  return (
    <div className="relative group">
      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        {/* Badge giảm giá */}
        <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md ">
          -{(((item.gia - item.gia_km) / item.gia) * 100).toFixed(0)}%
        </div>

        {/* Badge sản phẩm mới */}
        {/* {item.moi == "1" && (
          <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
            <i className="fas fa-bolt mr-1"></i> Mới
          </div>
        )} */}
      </div>

      {/* Badge Hot */}
      {item.hot == "1" && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md z-3">
          <i className="fas fa-fire mr-1"></i> Hot
        </div>
      )}

      {/* Container sản phẩm */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Ảnh sản phẩm */}
        <Link href={`/user/product-detail/${item.id}`}>
          <div className="relative h-72 overflow-hidden">
            <Image
              src={item.hinh}
              alt={item.ten_sp}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>

        {/* Thông tin sản phẩm */}
        <div className="p-6">
          {/* Tên sản phẩm */}
          <h3 className="text-base font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-gray-950 transition-colors duration-300 min-h-[1rem]">
            {item.ten_sp}
          </h3>

          {/* Giá */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-red-600 font-bold text-xl">
              {formatPrice(item.gia_km)}
            </span>
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(item.gia)}
            </span>
          </div>

          {/* Thông tin thêm */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <i className="fas fa-truck text-green-600 mr-2"></i>
              <span>Giao hàng 24h</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-blue-600 mr-2"></i>
              <span>Bảo hành 12T</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-sync-alt text-orange-600 mr-2"></i>
              <span>Đổi trả 30 ngày</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-600 mr-2"></i>
              <span>Chính hãng 100%</span>
            </div>
          </div>

          {/* Lượt xem */}
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <i className="fas fa-eye mr-2"></i>
            <span>{item.luot_xem} lượt xem</span>
          </div>

          {/* Nút mua hàng */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => dispatch(themSanPham(item))}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg
                  font-medium transition-all duration-300 flex items-center justify-center"
              >
                <i className="fas fa-cart-plus mr-1"></i>
                Thêm vào giỏ
              </button>

              <button
                onClick={() => dispatch(themSanPham(item))}
                className="bg-gray-950 hover:bg-gray-800 text-white px-3 py-2 rounded-lg
                  font-medium transition-all duration-300 flex items-center justify-center"
              >
                <i className="fas fa-shopping-cart mr-1"></i>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
