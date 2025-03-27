// Đây là trang chủ của website
"use client";
import {Provider} from "react-redux"
import {store} from "@lib/strore"
import { ISanPham } from "../components/user/data/Data";
import Image from "next/image";
import Show1Product from "../components/user/layout/Show1Product";
import { useState, useEffect } from "react";
// Trang này sẽ được hiển thị ở tag <children> trong file layout.tsx
export default function Home() {
  // Lấy dữ liệu
  // const hotProduct = await fetch("http://localhost:3005/api/sphot/8");
  // const hotProductData = await hotProduct.json();
  // const newProduct = await fetch("http://localhost:3005/api/spmoi/8");
  // const newProductData = await newProduct.json();
  const [hotProductData, setHotProductData] = useState<ISanPham[]>([]);
  const [newProductData, setNewProductData] = useState<ISanPham[]>([]);

  // Chạy 1 lần duy nhất khi component được render
  useEffect(() => {
    fetch("http://localhost:3005/api/sphot/8")
      .then((res) => res.json())
      .then((data) => {
        setHotProductData(data); // khi lấy xong dữ liệu, cập nhật vào state
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu sản phẩm nổi bật", err));
    fetch("http://localhost:3005/api/spmoi/8")
      .then((res) => res.json())
      .then((data) => {
        setNewProductData(data); // khi lấy xong dữ liệu, cập nhật vào state
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu sản phẩm mới", err));
  }, []);

  return (
    <div>
      {/* 1. Banner */}
      <div className="pt-20">
        <div className="relative h-[600px] w-full">
          {/* Banner background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1706735733956-deebaf5d001c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>

          {/* Banner content */}
          <div className="relative container mx-auto h-full flex items-center">
            <div className="text-white max-w-2xl px-6">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">
                Chào mừng đến với The Hey D
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Khám phá bộ sưu tập sản phẩm độc đáo và chất lượng của chúng tôi
              </p>
              <button
                className="bg-sky-950 hover:bg-sky-700 text-white px-8 py-3 rounded-full 
                transition duration-300 transform hover:scale-105"
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Các điểm nổi bật */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl text-sky-950">
                <i className="fas fa-truck"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Giao hàng nhanh</h3>
                <p className="text-gray-600">Miễn phí cho đơn {">"} 500K</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl text-sky-950">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Bảo hành tận tâm</h3>
                <p className="text-gray-600">Hỗ trợ 24/7</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl text-sky-950">
                <i className="fas fa-medal"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sản phẩm chính hãng</h3>
                <p className="text-gray-600">Cam kết 100%</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl text-sky-950">
                <i className="fas fa-gift"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ưu đãi hấp dẫn</h3>
                <p className="text-gray-600">Nhiều quà tặng giá trị</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sản phẩm hot */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sky-950 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="w-20 h-1 bg-sky-950 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProductData.map((item: ISanPham) => (
              <Show1Product key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Banner quảng cáo */}
      <div className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="Promo"
            className="w-full h-full object-cover"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ưu Đãi Đặc Biệt</h2>
          <p className="text-xl mb-8">
            Giảm giá lên đến 50% cho khách hàng mới
          </p>
          <button
            className="bg-white text-sky-950 px-8 py-3 rounded-full font-semibold 
            hover:bg-sky-950 hover:text-white transition duration-300"
          >
            Xem ngay
          </button>
        </div>
      </div>

      {/* 5. Sản phẩm mới */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sky-950 mb-4">
              Sản Phẩm Mới
            </h2>
            <div className="w-20 h-1 bg-sky-950 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProductData.map((item: ISanPham) => (
              <Show1Product key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. Section đăng ký */}
      <div className="text-white py-16 ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-sky-950 font-bold mb-6">
            Đăng Ký Nhận Thông Tin
          </h2>
          <p className="mb-8 text-sky-950 text-lg">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button
              className="bg-white text-sky-950 px-6 py-3 rounded-lg font-semibold
              hover:bg-sky-800 hover:text-white transition duration-300"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
