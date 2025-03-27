"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Show1Product from "@/components/user/layout/Show1Product";
import { ISanPham, ILoai } from "@/components/user/data/Data";
import Image from "next/image";

export default function SanPhamList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy query từ URL
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "16";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const hot = searchParams.get("hot") || "";

  const [sanPhamData, setSanPhamData] = useState<ISanPham[]>([]);
  const [loaiData, setLoaiData] = useState<ILoai[]>([]);

  useEffect(() => {
    const fetchSanPhams = async () => {
      const res = await fetch(
        `http://localhost:3005/api/sanpham?page=${page}&limit=${limit}&category=${category}&sort=${sort}&hot=${hot}`
      );
      const data = await res.json();
      setSanPhamData(data);
    };

    fetchSanPhams();
  }, [page, limit, category, sort, hot]);
  // Fetch danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:3005/api/loai");
      const data = await res.json();
      setLoaiData(data);
    };

    fetchCategories();
  }, []);
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`/user/product?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Section */}
      <div className="relative w-full h-64 md:h-80 mb-10 rounded-xl overflow-hidden">
        <Image
          src="/images/product-banner.jpg"
          alt="Sản phẩm banner"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Khám Phá Sản Phẩm
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl">
            Chọn lựa những sản phẩm công nghệ tốt nhất với giá cả hợp lý
          </p>
        </div>
      </div>

      {/* Danh mục nổi bật */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Danh Mục Nổi Bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loaiData.slice(0, 4).map((loai) => (
            <div
              key={loai.id}
              onClick={() => updateQuery("category", loai.id)}
              className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center h-32 hover:bg-blue-100 hover:shadow-md transition cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full mb-2 flex items-center justify-center">
                <span className="text-white text-lg">
                  {loai.ten_loai.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-center">{loai.ten_loai}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Danh sách sản phẩm
      </h2>

      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          onChange={(e) => updateQuery("category", e.target.value)}
          value={category}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">Tất cả danh mục</option>
          {loaiData.map((loai) => (
            <option key={loai.id} value={loai.id}>
              {loai.ten_loai}
            </option>
          ))}
          {/* <option value="1">Điện thoại</option>
          <option value="2">Laptop</option>
          <option value="3">Phụ kiện</option> */}
        </select>

        <select
          onChange={(e) => updateQuery("sort", e.target.value)}
          value={sort}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">Mặc định</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
        <select
          onChange={(e) => updateQuery("hot", e.target.value)}
          value={hot}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {" "}
          <option value="">Mặc định</option>
          <option value="1">Sản phẩm Hot</option>
          <option value="0">Sản phẩm Old</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sanPhamData.map((sp) => (
          <Show1Product key={sp.id} item={sp} />
        ))}
      </div>

      {/* Lời nhắn khuyến mãi */}
      <div className="my-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Ưu đãi đặc biệt!</h3>
            <p className="text-lg">
              Đăng ký nhận thông báo để không bỏ lỡ các khuyến mãi mới nhất
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() =>
            updateQuery("page", Math.max(1, Number(page) - 1).toString())
          }
          disabled={page === "1"}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300"
        >
          Trang trước
        </button>

        <span className="text-lg font-medium text-gray-700">Trang {page}</span>

        <button
          onClick={() => updateQuery("page", (Number(page) + 1).toString())}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
