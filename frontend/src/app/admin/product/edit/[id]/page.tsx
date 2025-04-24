"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation'; // App router
import { ISanPham } from '@/components/user/data/Data';

export default function EditProductPage() {
    const router = useRouter(); // router để chuyển trang
    const params = useParams(); // lấy id từ url
    const id = params.id;

    const [product, setProduct] = useState<ISanPham | null>(null);
    const [imagePreview, setImagePreview] = useState("https://via.placeholder.com/200x150?text=Preview");
    const [fileName, setFileName] = useState("Không có tệp nào được chọn");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3005/api/admin/sanpham/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data);
                    setImagePreview(data.hinh || "https://via.placeholder.com/200x150?text=Preview");
                } else {
                    alert("Không tìm thấy sản phẩm");
                    router.push("/admin/product");
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin sản phẩm:", err);
                alert("Đã có lỗi xảy ra");
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, router]);

    if (!product) {
        return <div>Không tìm thấy sản phẩm</div>;
    }

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFileName(file.name);
  } else {
    setImageFile(null);
    setImagePreview("https://via.placeholder.com/200x150?text=Preview");
    setFileName("Không có tệp nào được chọn");
  }
};
// 👇 Handler khi submit form
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData();
  
    // Thêm file ảnh nếu có
    if (imageFile) {
      formData.append("hinh", imageFile);
    }

    // Thêm các trường cơ bản
    formData.append("ten_sp", form.ten_sp.value);
    formData.append("gia", form.gia.value);
    formData.append("gia_km", form.gia_km.value);
    formData.append("id_loai", form.id_loai.value);
    formData.append("mo_ta", form.mo_ta.value);
    formData.append("hot", form.hot.value);
    formData.append("an_hien", form.an_hien.value);

    // Thêm các trường thuộc tính
    const thuoc_tinh = {
      ram: form["thuoc_tinh[ram]"].value,
      cpu: form["thuoc_tinh[cpu]"].value,
      dia_cung: form["thuoc_tinh[dia_cung]"].value,
      mau_sac: form["thuoc_tinh[mau_sac]"].value,
      can_nang: form["thuoc_tinh[can_nang]"].value
    };

    // Thêm thuộc tính vào formData
    formData.append("thuoc_tinh", JSON.stringify(thuoc_tinh));
  
    try {
      const res = await fetch(`http://localhost:3005/api/admin/sanpham/${id}`, {
        method: "PUT",
        body: formData,
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Server response:", text);
        throw new Error("Server returned non-JSON response");
      }
  
      if (res.ok) {
        alert("Cập nhật thành công!");
        router.push("/admin/product");
      } else {
        alert(" Lỗi: " + (data?.message || data?.thong_bao || "Không xác định"));
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      alert(" Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <main className="flex-1 ">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Sửa sản phẩm</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" encType="multipart/form-data">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  className="rounded-md"
                  width={150}
                  height={100}
                  unoptimized
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
                    name="hinh" 
                    id="imageInput" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                  <span className="ml-3 text-sm text-gray-500 truncate">{fileName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input 
                type="text" 
                name="ten_sp" 
                defaultValue={product.ten_sp}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá</label>
              <input 
                type="number" 
                name="gia" 
                defaultValue={product.gia}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá khuyến mãi</label>
              <input 
                type="number" 
                name="gia_km" 
                defaultValue={product.gia_km}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea 
              name="mo_ta" 
              rows={4} 
              defaultValue={product.mo_ta}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
            <select name="id_loai" defaultValue={product.id_loai} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
              <option value="">-- Chọn loại --</option>
              <option value="1">Laptop</option>
              <option value="2">PC</option>
              <option value="3">Tablet</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700">RAM</label>
              <input 
                type="text" 
                name="thuoc_tinh[ram]" 
                defaultValue={product.thuoc_tinh?.ram}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">CPU</label>
              <input 
                type="text" 
                name="thuoc_tinh[cpu]" 
                defaultValue={product.thuoc_tinh?.cpu}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Ổ cứng</label>
              <input 
                type="text" 
                name="thuoc_tinh[dia_cung]" 
                defaultValue={product.thuoc_tinh?.dia_cung}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Màu sắc</label>
              <input 
                type="text" 
                name="thuoc_tinh[mau_sac]" 
                defaultValue={product.thuoc_tinh?.mau_sac}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Cân nặng</label>
              <input 
                type="text" 
                name="thuoc_tinh[can_nang]" 
                defaultValue={product.thuoc_tinh?.can_nang}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái hiển thị</label>
              <select name="an_hien" defaultValue={product.an_hien} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="1">Hiển thị</option>
                <option value="0">Ẩn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sản phẩm HOT?</label>
              <select name="hot" defaultValue={product.hot} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <a href="/admin/product" className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Hủy</a>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

