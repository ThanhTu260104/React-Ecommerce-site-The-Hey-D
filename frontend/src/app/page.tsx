"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Show1Product from "../components/user/layout/Show1Product";
import { ISanPham } from "../components/user/data/Data";

export default function Home() {
  const [hotProductData, setHotProductData] = useState<ISanPham[]>([]);
  const [newProductData, setNewProductData] = useState<ISanPham[]>([]);

  useEffect(() => {
    fetch("http://localhost:3005/api/sphot/8")
      .then((res) => res.json())
      .then((data) => setHotProductData(data))
      .catch((err) => console.error("Lỗi lấy sản phẩm nổi bật:", err));

    fetch("http://localhost:3005/api/spmoi/8")
      .then((res) => res.json())
      .then((data) => setNewProductData(data))
      .catch((err) => console.error("Lỗi lấy sản phẩm mới:", err));
  }, []);

  return (
    <div className="home-page">
      {/* 1. Banner full màn hình */}
      <div className="relative w-full h-screen">
        {/* Hình nền */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dba9gnba5/image/upload/v1743352504/sergey-zolkin-_UeY8aTI6d0-unsplash_1_eqcodl.jpg"
            alt="Banner Image"
            fill
            className="object-cover"
            priority
          />
          {/* Lớp phủ gradient để cải thiện khả năng đọc văn bản */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        </div>

        {/* Nội dung Banner */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              The Hey D
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Khám phá các sản phẩm và dịch vụ tốt nhất cho nhu cầu của bạn.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/user/product"
                className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-medium tracking-wide transition duration-300 transform hover:scale-105 shadow-md"
              >
                Xem sản phẩm
              </Link>

              <Link
                href="#"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-3 rounded-full font-medium transition duration-300 transform hover:scale-105"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>

        {/* Chỉ báo cuộn xuống */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-center">
            <p className="mb-2">Cuộn xuống</p>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      {/* 2. Điểm nổi bật */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-950 mb-4">
              Tại Sao Chọn Chúng Tôi
            </h2>
            <div className="w-20 h-1 bg-gray-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "fa-truck",
                title: "Giao hàng nhanh",
                desc: "Miễn phí cho đơn > 500K",
              },
              {
                icon: "fa-shield-alt",
                title: "Bảo hành tận tâm",
                desc: "Hỗ trợ 24/7",
              },
              {
                icon: "fa-medal",
                title: "Sản phẩm chính hãng",
                desc: "Cam kết 100%",
              },
              {
                icon: "fa-gift",
                title: "Ưu đãi hấp dẫn",
                desc: "Nhiều quà tặng giá trị",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl text-gray-600 mb-4">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Sản phẩm hot */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-950 mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="w-20 h-1 bg-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Khám phá những sản phẩm được ưa chuộng nhất tại The Hey D
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProductData.map((item) => (
              <Show1Product key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/user/product"
              className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Banner quảng cáo */}
      <div className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dba9gnba5/image/upload/v1742311028/sheraz-abdul-ghafoor-MndU3SH2j8M-unsplash_pu8oe8.jpg"
            alt="Promo"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <h2 className="text-4xl font-bold mb-6">Ưu Đãi Đặc Biệt</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Giảm giá lên đến 50% cho khách hàng mới. Đăng ký ngay hôm nay để
            nhận những ưu đãi độc quyền.
          </p>
          <button className="bg-white text-gray-950 px-8 py-3 rounded-full font-semibold hover:bg-gray-600 hover:text-white transition duration-300 transform hover:scale-105">
            Xem ngay
          </button>
        </div>
      </div>

      {/* 5. Sản phẩm mới */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-950 mb-4">
              Sản Phẩm Mới
            </h2>
            <div className="w-20 h-1 bg-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Khám phá những sản phẩm mới nhất vừa được ra mắt tại The Hey D
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProductData.map((item) => (
              <Show1Product key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/user/product"
              className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Đăng ký nhận thông tin */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-gray-950 font-bold mb-6">
            Đăng Ký Nhận Thông Tin
          </h2>
          <p className="mb-8 text-gray-950 text-lg max-w-2xl mx-auto">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt. Chúng tôi không
            gửi spam và bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
