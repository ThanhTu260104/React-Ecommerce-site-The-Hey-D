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
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner */}
      <div className="relative w-full h-64">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dba9gnba5/image/upload/v1743352504/sergey-zolkin-_UeY8aTI6d0-unsplash_1_eqcodl.jpg"
            alt="Banner sản phẩm"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Sản Phẩm Của Chúng Tôi
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl">
            Khám phá bộ sưu tập đa dạng và chất lượng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Danh mục",
                value: category,
                onChange: (v: string) => updateQuery("category", v),
                options: [
                  { value: "", label: "Tất cả danh mục" },
                  ...loaiData.map((l) => ({
                    value: l.id.toString(),
                    label: l.ten_loai,
                  })),
                ],
              },
              {
                label: "Sắp xếp",
                value: sort,
                onChange: (v: string) => updateQuery("sort", v),
                options: [
                  { value: "", label: "Mặc định" },
                  { value: "asc", label: "Giá tăng dần" },
                  { value: "desc", label: "Giá giảm dần" },
                ],
              },
              {
                label: "Tình trạng",
                value: hot,
                onChange: (v: string) => updateQuery("hot", v),
                options: [
                  { value: "", label: "Tất cả" },
                  { value: "1", label: "Sản phẩm Hot" },
                  { value: "0", label: "Sản phẩm Thường" },
                ],
              },
            ].map((filter, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  {filter.options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {sanPhamData.map((sp) => (
              <Show1Product key={sp.id} item={sp} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={() =>
              updateQuery("page", Math.max(1, Number(page) - 1).toString())
            }
            disabled={page === "1"}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg disabled:bg-gray-300 hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Trước
          </button>
          <span className="px-6 py-2 bg-white rounded-lg shadow-sm font-medium">
            Trang {page}
          </span>
          <button
            onClick={() => updateQuery("page", (Number(page) + 1).toString())}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sau
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">
                Đăng ký nhận thông tin
              </h3>
              <p>Nhận ngay ưu đãi đặc biệt và thông tin sản phẩm mới</p>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
