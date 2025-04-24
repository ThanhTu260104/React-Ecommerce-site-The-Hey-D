"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/admin/layout/ErrorAlert ";
import { ILoai } from "@/components/user/data/Data"; // Assuming ILoai interface exists

export default function CreateProductPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState<ILoai[]>([]);

  // Product Fields
  const [tenSp, setTenSp] = useState("");
  const [gia, setGia] = useState("");
  const [giaKm, setGiaKm] = useState("");
  const [idLoai, setIdLoai] = useState("");
  const [moTa, setMoTa] = useState("");
  const [hinh, setHinh] = useState<File | null>(null);
  const [hot, setHot] = useState("0"); // Default to not hot
  const [anHien, setAnHien] = useState("1"); // Default to active

  // Attributes (Thuộc tính)
  const [ram, setRam] = useState("");
  const [cpu, setCpu] = useState("");
  const [diaCung, setDiaCung] = useState("");
  const [mauSac, setMauSac] = useState("");
  const [canNang, setCanNang] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/loai");
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const responseData = await res.json();

        // Check if the actual category array is nested
        let categoriesArray: ILoai[] = [];
        if (Array.isArray(responseData)) {
            categoriesArray = responseData;
        } else if (responseData && typeof responseData === 'object' && Array.isArray(responseData.data)) {
            // Example: Handle if response is { data: [...] }
            categoriesArray = responseData.data;
        } else if (responseData && typeof responseData === 'object' && Array.isArray(responseData.categories)) {
           // Example: Handle if response is { categories: [...] }
           categoriesArray = responseData.categories;
        }
        // Add more checks here if other structures are possible

        // Validate the structure of items within the array
        const validCategories = categoriesArray.filter(
          cat => cat && typeof cat.id !== 'undefined' && typeof cat.ten_loai !== 'undefined'
        );

        setCategories(validCategories);

        if (validCategories.length > 0) {
          // Set default value only if current idLoai is empty or not in the fetched list
          const currentSelectionValid = validCategories.some(cat => cat.id.toString() === idLoai);
          if (!idLoai || !currentSelectionValid) {
              setIdLoai(validCategories[0].id.toString());
          }
        } else {
          // No valid categories fetched, ensure selection is cleared
          setIdLoai("");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setErrorMsg("Không thể tải danh mục.");
        setCategories([]); // Set empty array on error
        setIdLoai(""); // Clear selection on error
      }
    };
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // idLoai intentionally removed from deps if it was there

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHinh(e.target.files[0]);
    } else {
      setHinh(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error

    if (!tenSp || !idLoai || !gia) {
        setErrorMsg("Vui lòng điền đầy đủ các trường bắt buộc: Tên sản phẩm, Danh mục, Giá.");
        return;
    }

    const formData = new FormData();
    formData.append("ten_sp", tenSp);
    formData.append("gia", gia);
    if (giaKm) formData.append("gia_km", giaKm);
    formData.append("id_loai", idLoai);
    formData.append("mo_ta", moTa);
    formData.append("hot", hot);
    formData.append("an_hien", anHien);

    // Append attributes as a stringified JSON object
    const thuocTinh = {
      ram: ram || null,
      cpu: cpu || null,
      dia_cung: diaCung || null,
      mau_sac: mauSac || null,
      can_nang: canNang ? parseFloat(canNang) : null
    };
    formData.append("thuoc_tinh", JSON.stringify(thuocTinh));

    if (hinh) {
      formData.append("hinh", hinh);
    }

    try {
      const res = await fetch("http://localhost:3005/api/admin/sanpham", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.thong_bao || "Lỗi không xác định khi thêm sản phẩm!");
        return;
      }

      alert("Thêm sản phẩm thành công!");
      router.push("/admin/product");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      setErrorMsg("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Thêm sản phẩm mới</h2>
        </div>
        <ErrorAlert message={errorMsg} />

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Image Upload Section - Copied from edit */}
          <div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                {/* Use standard img tag for create preview, Image component might have issues */}
                <img
                  src={hinh ? URL.createObjectURL(hinh) : "https://via.placeholder.com/150x100?text=Preview"}
                  alt="Preview"
                  className="rounded-md w-[150px] h-[100px] object-cover" // Set explicit size
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <div className="flex items-center border border-gray-300 rounded-lg p-1.5">
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-md border border-gray-300 transition-colors whitespace-nowrap"
                  >
                    Chọn tệp
                  </label>
                  <input
                    type="file"
                    id="imageInput" // Added id to match label's htmlFor
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="ml-3 text-sm text-gray-500 truncate">
                     {hinh ? hinh.name : "Không có tệp nào được chọn"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section - Updated grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tenSp}
                onChange={(e) => setTenSp(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={gia}
                onChange={(e) => setGia(e.target.value)}
                required
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá khuyến mãi
              </label>
              <input
                type="number"
                value={giaKm}
                onChange={(e) => setGiaKm(e.target.value)}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
            />
          </div>

          {/* Category Selection - Similar layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại sản phẩm <span className="text-red-500">*</span>
            </label>
            <select
              value={idLoai}
              onChange={(e) => setIdLoai(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" disabled>-- Chọn loại --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    
                  {cat.ten_loai}
                </option>
              ))}
            </select>
          </div>

          {/* Attributes Section - Updated layout */}
           {/* Use div instead of fieldset for consistency */}
<fieldset className="border border-gray-300 rounded-md p-2">
    <legend className="text-sm font-semibold text-gray-800">Thuộc tính sản phẩm</legend>
           <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm text-gray-700">RAM</label> {/* Removed font-medium */}
                <input type="text" value={ram} onChange={(e) => setRam(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/> {/* Updated class */}
            </div>
            <div>
                <label className="block text-sm text-gray-700">CPU</label> {/* Removed font-medium */}
                <input type="text" value={cpu} onChange={(e) => setCpu(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/> {/* Updated class */}
            </div>
            <div>
                <label className="block text-sm text-gray-700">Ổ cứng</label> {/* Removed font-medium */}
                <input type="text" value={diaCung} onChange={(e) => setDiaCung(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/> {/* Updated class */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4"> {/* New grid for color and weight */}
             <div>
                <label className="block text-sm text-gray-700">Màu sắc</label> {/* Removed font-medium */}
                <input type="text" value={mauSac} onChange={(e) => setMauSac(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/> {/* Updated class */}
            </div>
            <div>
                <label className="block text-sm text-gray-700">Cân nặng (kg)</label> {/* Removed font-medium */}
                <input type="number" step="0.1" value={canNang} onChange={(e) => setCanNang(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"/> {/* Updated class */}
            </div>
          </div>
          </fieldset>

          {/* Status and Hot - Updated grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái hiển thị {/* Updated Label Text */}
              </label>
              <select
                value={anHien}
                onChange={(e) => setAnHien(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
              >
                <option value="1">Hiển thị</option> {/* Updated Option Text */}
                <option value="0">Ẩn</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">
                Sản phẩm HOT? {/* Updated Label Text */}
              </label>
              <select
                value={hot}
                onChange={(e) => setHot(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" // Updated class
              >
                 <option value="1">Có</option> {/* Changed order and text */}
                 <option value="0">Không</option>
              </select>
            </div>
          </div>

          {/* Action Buttons - Updated layout */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200"> {/* Added pt-4 and border */}
            <button
              type="button"
              onClick={() => router.push("/admin/product")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition" // Added text-gray-800 and transition
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition" // Added transition
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
