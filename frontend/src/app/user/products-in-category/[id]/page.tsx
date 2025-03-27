"use client";
import { ISanPham } from "../../../../components/user/data/Data";
import Show1Product from "../../../../components/user/layout/Show1Product";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
export default function ProductsInCategory({
  params,
}: {
  params: { id: number };
  // params: { id: string };
}) {
  // Lấy tham số trong id route
  const id_loai = params.id;
  // const id_loai = Number(params.id);

  // Dùng Hook useEffect để gọi API
  const [productsInCategoryData, setProductsInCategoryData] = useState<
    ISanPham[]
  >([]);
  const [categoryData, setCategoryData] = useState({
    id: 0,
    ten_loai: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3005/api/sptrongloai/${id_loai}`)
      .then((res) => res.json())
      .then((data) => {
        setProductsInCategoryData(data);
      })
      .catch((err) =>
        console.error("Lỗi lấy dữ liệu sản phẩm trong loại", err)
      );
    fetch(`http://localhost:3005/api/loai/${id_loai}
      `)
      .then((res) => res.json())
      .then((data) => {
        setCategoryData(data);
      });
  }, [id_loai]); // useEffect sẽ chạy MỖI KHI id_loai thay đổi

  // const productsInCategory = await fetch(
  //   `http://localhost:3005/api/sptrongloai/${id_loai}`
  // );
  // const resProductsInCategory = await productsInCategory.json();
  // const productsInCategoryData = resProductsInCategory as ISanPham[];
  // const category = await fetch(`http://localhost:3005/api/loai/${id_loai}`);
  // const resCategory = await category.json();
  // const categoryData = resCategory as ILoai;

  return (
    <div className="container mx-auto px-4 py-30">
      {/* Category Title Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-sky-950 mb-4">
          {categoryData.ten_loai}
        </h2>
        <div className="w-20 h-1 bg-sky-950 mx-auto"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsInCategoryData.map((item) => (
          <Show1Product key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
