"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/admin/layout/ErrorAlert ";

export default function AddCategoryForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [tenLoai, setTenLoai] = useState("");
  const [thuTu, setThuTu] = useState("");
  const [anHien, setAnHien] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error

    try {
      const res = await fetch("http://localhost:3005/api/loai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_loai: tenLoai,
          thu_tu: thuTu ? parseInt(thuTu) : undefined,
          an_hien: parseInt(anHien),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.thong_bao || "Lỗi không xác định!");
        return;
      }

      router.push("/admin/category");
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      setErrorMsg("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Thêm danh mục sản phẩm</h2>
        </div>
        <ErrorAlert message={errorMsg} />

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              value={tenLoai}
              onChange={(e) => setTenLoai(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thứ tự (tùy chọn)
            </label>
            <input
              type="number"
              value={thuTu}
              onChange={(e) => setThuTu(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              value={anHien}
              onChange={(e) => setAnHien(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="1">Hoạt động</option>
              <option value="0">Ẩn</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <a
              href="/admin/category"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Hủy
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
            >
              Thêm danh mục
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
