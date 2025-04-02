"use client";
import { useState, useEffect } from "react";
import { ILoai } from "@/components/user/data/Data";
import Pagination from "@/components/admin/layout/Pagination";

export default function CategoryPage() {
  const [categories, setCategories] = useState<ILoai[]>([]);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const showDeleteModal = (id: number, name: string) => {
    setSelectedId(id);
    setSelectedName(name);
    setShowModal(true);
  };

  const hideDeleteModal = () => setShowModal(false);

  const fetchCategories = async () => {
    try {
      let url = `http://localhost:3005/api/admin/loai?limit=${limit}&page=${page}`;
      if (keyword) url += `&tu_khoa=${encodeURIComponent(keyword)}`;
      if (filterStatus !== "") url += `&an_hien=${filterStatus}`;

      const res = await fetch(url);
      const result = await res.json();
      setCategories(result.data || []);
      setTotalItems(result.total || 0);
    } catch (err) {
      console.error("Lỗi khi lọc/tìm kiếm danh mục:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [keyword, filterStatus, page]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(`http://localhost:3005/api/loai/${selectedId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.thong_bao || "Đã xóa");

      setShowModal(false);
      setSelectedId(null);

      // Refetch lại danh sách sau khi xóa
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      alert("Lỗi server khi xóa danh mục");
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const pad = (n: number) => (n < 10 ? "0" + n : n);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )} ${pad(date.getDate())}/${pad(
      date.getMonth() + 1
    )}/${date.getFullYear()}`;
  };

  return (
    <div className="flex">
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">Quản lý danh mục sản phẩm</h1>
            <a
              href="/admin/category/create"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <i className="fas fa-plus mr-2"></i>Thêm danh mục
            </a>
          </div>
        </div>

        <div className="p-6">
          {/* Bộ lọc */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 relative">
                <input
                  type="text"
                  value={keyword}
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              <select
                className="w-full border rounded-lg px-4 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Danh sách */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thứ tự
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Số sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ngày cập nhật
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr className="hover:bg-gray-50" key={cat.id}>
                      <td className="px-6 py-4 text-sm">{cat.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {cat.ten_loai}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 text-sm">{cat.thu_tu}</td>
                      <td className="px-6 py-4 text-sm">{cat.so_san_pham}</td>
                      <td className="px-6 py-4">
                        {cat.an_hien === 1 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                            Ẩn
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(cat.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDateTime(cat.updated_at)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/admin/category/edit/${cat.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                        <button
                          onClick={() => showDeleteModal(cat.id, cat.ten_loai)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Hiển thị {(page - 1) * limit + 1}–
                  {Math.min(page * limit, totalItems)} của {totalItems} mục
                </p>
                <Pagination
                  page={page}
                  totalPages={Math.ceil(totalItems / limit)}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>

              <h3 className="text-lg pb-2 leading-6 font-medium text-gray-900">
                Xác nhận xóa danh mục
              </h3>
              <span className="text-lg leading-6 font-medium text-red-600">
                {selectedName}
              </span>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={hideDeleteModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded mr-2"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
