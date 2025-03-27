"use client";

//Import
// import { useState } from "react"  // mỗi khi state thay đổi, component sẽ render lại
import { RootState } from "@/lib/store"; // có tác dụng lấy state từ store
import { useSelector } from "react-redux"; // có tác dụng lấy state từ store
import { ICart } from "@/components/user/data/Data"; // định nghĩa interface cho giỏ hàng
// simport { redirect } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const [thongBaoTrongGioHang, setThongBaoTrongGioHang] = useState("");

  const listSanPham: ICart[] = useSelector(
    (state: RootState) => state.cart.listSanPham
  ); // Lấy mảng sản phẩm listSanPham từ trong Redux store (state.cart.listSanPham) và gán nó vào biến listSanPham

  // Kiểm tra giỏ hàng nếu trống thì hiển thị abc...
  useEffect(() => {
    if (listSanPham.length === 0) {
      setThongBaoTrongGioHang("Giỏ hàng chưa có sản phẩm nào.");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [listSanPham, router]);

  //Tạo ref - reference đến các tag input
  const hotenRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ghichuRef = useRef<HTMLTextAreaElement>(null);
  const thongbaoRef = useRef<HTMLDivElement>(null);

  //Hàm Submit dữ liệu
  const submitDuLieu = () => {
    const ht = hotenRef.current?.value;
    const email = emailRef.current?.value;
    if (ht?.trim() == "") {
      thongbaoRef.current!.innerHTML = "Chưa nhập họ tên";
      hotenRef.current!.style.backgroundColor = "yellow";
      hotenRef.current!.focus();
      return;
    } else hotenRef.current!.style.backgroundColor = "white";

    const opt = {
      method: "post",
      body: JSON.stringify({ ho_ten: ht, email: email }),
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://localhost:3005/api/luudonhang", opt)
      .then((res) => res.json())
      .then((data) => {
        thongbaoRef.current!.innerHTML = data.thong_bao;
        if (data.dh != undefined) {
          const id_dh = data.dh.id;
          //luuchitietdonhang(id_dh, listSP);
          const luuchitietdonhang = async (id_dh: number, cart: ICart[]) => {
            const url = "http://localhost:3000/api/luugiohang";
            const promises = cart.map((sp) => {
              const t = { id_dh: id_dh, id_sp: sp.id, so_luong: sp.so_luong };
              const opt = {
                method: "POST",
                body: JSON.stringify(t),
                headers: { "Content-Type": "application/json" },
              };
              return fetch(url, opt)
                .then((res) => res.json())
                .catch(() => console.log("Lỗi lưu sản phẩm", sp));
            });
            await Promise.all(promises);
            window.location.href = "/thanh-toan/hoan-tat";
          };
          luuchitietdonhang(id_dh, listSanPham);
        }
      })
      .catch((err) => {
        console.log("Lỗi request lưu dh:", err);
        thongbaoRef.current!.innerHTML = "Có lỗi gì đó, xem trong log";
      });
  }; //submitDuLieu

  return (
    <div className="flex-1 bg-gray-50 pt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
            <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn</p>
          </div>

          {thongBaoTrongGioHang && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
              <p className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {thongBaoTrongGioHang}
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-sky-950 text-white p-6">
              <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>
              <p className="text-sky-200 text-sm mt-1">
                Vui lòng điền thông tin chính xác để chúng tôi có thể liên hệ
                với bạn
              </p>
            </div>

            <form className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  ref={hotenRef}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailRef}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  type="email"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú
                </label>
                <textarea
                  ref={ghichuRef}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  rows={4}
                  placeholder="Nhập ghi chú về đơn hàng hoặc yêu cầu đặc biệt..."
                />
              </div>
            </form>
          </div>

          {listSanPham.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tóm tắt đơn hàng
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {listSanPham.map((sp) => (
                    <div
                      key={sp.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className="bg-sky-100 text-sky-800 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                          {sp.so_luong}
                        </span>
                        <span className="font-medium">{sp.ten_sp}</span>
                      </div>
                      <span className="font-medium">
                        {(sp.gia_mua * sp.so_luong).toLocaleString()}đ
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>
                      {listSanPham
                        .reduce(
                          (total, item) => total + item.gia_mua * item.so_luong,
                          0
                        )
                        .toLocaleString()}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{(30000).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-sky-950">
                      {(
                        listSanPham.reduce(
                          (total, item) => total + item.gia_mua * item.so_luong,
                          0
                        ) + 30000
                      ).toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-4 mb-8">
            <Link href="/user/cart" className="w-full sm:w-auto">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                <i className="fas fa-arrow-left mr-2"></i>
                Quay lại giỏ hàng
              </button>
            </Link>

            <button
              onClick={submitDuLieu}
              className="w-full sm:w-auto sm:ml-auto bg-sky-950 text-white py-3 px-8 rounded-lg hover:bg-sky-800 transition duration-300 flex items-center justify-center"
              type="button"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Hoàn tất đơn hàng
            </button>
          </div>

          <div
            ref={thongbaoRef}
            className="text-red-500 font-medium text-center p-4 bg-red-50 rounded-lg"
          ></div>
        </div>
      </div>
    </div>
  );
}
