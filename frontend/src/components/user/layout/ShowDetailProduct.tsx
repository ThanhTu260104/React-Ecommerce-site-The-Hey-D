"use client";
import { ISanPham } from "../data/Data";
import Image from "next/image";

export default function ShowDetailProduct({ sp }: { sp: ISanPham }) {
  return (
    <div className="container mx-auto px-4 py-30">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          {sp.hinh && (
            <Image
              src={sp.hinh}
              alt={sp.ten_sp}
              className="max-w-full h-auto rounded-lg"
              width={500}
              height={500}
            />
          )}

          {/* Product Details Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{sp.ten_sp}</h1>

            {/* Giá và giá khuyến mãi */}
            <div className="flex items-center gap-4">
              <div className="text-2xl font-semibold text-red-600">
                {sp.gia_km?.toLocaleString("vi-VN")} đ
              </div>
              {sp.gia_km < sp.gia && (
                <div className="text-lg text-gray-500 line-through">
                  {sp.gia?.toLocaleString("vi-VN")} đ
                </div>
              )}
            </div>

            {/* Thông tin chi tiết */}
            <div className="border-t border-b border-gray-200 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Ngày đăng:</span>
                <span>{new Date(sp.ngay).toLocaleDateString("vi-VN")}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Lượt xem:</span>
                <span>{sp.luot_xem}</span>
              </div>
            </div>

            {/* Mô tả sản phẩm */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-600">{sp.mo_ta}</p>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
