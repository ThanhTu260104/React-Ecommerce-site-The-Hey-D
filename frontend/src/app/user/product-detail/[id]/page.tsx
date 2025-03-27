"use client";
import ShowDetailProduct from "@/components/user/layout/ShowDetailProduct";
import { ISanPham } from "@/components/user/data/Data";
import { useState, useEffect } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  // const sp = await fetch(`http://localhost:3005/api/sp/${id}`);
  // const kq = await sp.json();

  // Dùng Hook gọi
  const spnull: ISanPham = {
    id: 0,
    ten_sp: "",
    gia: 0,
    gia_km: 0,
    luot_xem: 0,
    ngay: "",
    tinh_chat: "",
    hot: "0",
    an_hien: "0",
    hinh: "",
    mo_ta: "",
    id_loai: 0,
  };
  const [spData, setSpData] = useState<ISanPham>(spnull);
  useEffect(() => {
    fetch(`http://localhost:3005/api/sp/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSpData(data);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu sản phẩm", err));
  }, [id]);

  // const spData: ISanPham = kq as ISanPham;
  return (
    <div>
      <ShowDetailProduct sp={spData} />
    </div>
  );
}
