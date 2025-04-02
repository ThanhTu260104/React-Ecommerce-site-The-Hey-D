"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
//import  ErrorAlert  from "@/components/admin/layout/ErrorAlert ";

export default function EditCategoryForm() {
  const { id } = useParams(); // <-- lấy id từ URL
  const router = useRouter();

  const [tenLoai, setTenLoai] = useState("");
  // const [moTa, setMoTa] = useState("");
  const [anHien, setAnHien] = useState("1");
  const [thuTu, setThuTu] = useState("");

  useEffect(() => {
    if (!id) return; // tránh gọi fetch nếu chưa có id

    const fetchLoai = async () => {
      try {
        const res = await fetch(`http://localhost:3005/api/admin/loai/${id}`);
        const data = await res.json();
        setTenLoai(data.ten_loai || "");
        // setMoTa(data.mo_ta || "");
        setAnHien(data.an_hien?.toString() || "1");
        setThuTu(data.thu_tu || "");

      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", err);
      }
    };

    fetchLoai();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3005/api/loai/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_loai: tenLoai,
          // mo_ta: moTa,
          an_hien: parseInt(anHien),
        }),
      });
      const data = await res.json();
      alert(data.thong_bao || "Cập nhật thành công!");
      router.push("/admin/category");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };
  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Sửa danh mục sản phẩm</h2>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              value={tenLoai}
              onChange={(e) => setTenLoai(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thứ tự
            </label>
            <input
              type="number"
              value={thuTu}
              onChange={(e) => setThuTu(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              className="mt-1 block w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div> */}

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
              href="/admin/danh-muc"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Hủy
            </a>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
