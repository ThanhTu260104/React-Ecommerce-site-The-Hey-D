"use client"; // để sử dụng state trong react
// import { useState } from "react"  // mỗi khi state thay đổi, component sẽ render lại
import { RootState } from "@/lib/store"; // có tác dụng lấy state từ store
import { useSelector } from "react-redux"; // có tác dụng lấy state từ store
import { ICart } from "@/components/user/data/Data"; // định nghĩa interface cho giỏ hàng
import Image from "next/image";
import { suaSoLuong, xoaSanPham } from "@/lib/cartSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart_arr: ICart[] = useSelector(
    (state: RootState) => state.cart.listSanPham
  );
  const totalAmount = cart_arr.reduce(
    (total, item) => total + item.gia_mua * item.so_luong,
    0
  );
  const shippingFee = 30000;

  if (cart_arr.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
            <div className="mb-6">
              <i className="fas fa-shopping-cart text-6xl text-gray-300"></i>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-8">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-sky-950 text-white px-8 py-3 rounded-md hover:bg-sky-800 transition duration-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 pt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Giỏ hàng của bạn
            <span className="text-gray-500 text-lg ml-2">
              ({cart_arr.length} sản phẩm)
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Số lượng
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Đơn giá
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Thành tiền
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart_arr.map((sp: ICart) => (
                      <tr
                        key={sp.id}
                        className="border-b hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={sp.hinh}
                                alt={sp.ten_sp}
                                className="object-cover"
                                fill
                                sizes="80px"
                              />
                            </div>
                            <span className="font-medium text-gray-800">
                              {sp.ten_sp}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                dispatch(suaSoLuong([sp.id, sp.so_luong - 1]))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <i className="fas fa-minus text-sm"></i>
                            </button>
                            <input
                              type="number"
                              className="w-16 text-center border rounded-md py-1"
                              value={sp.so_luong}
                              onChange={(e) =>
                                dispatch(
                                  suaSoLuong([sp.id, parseInt(e.target.value)])
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                dispatch(suaSoLuong([sp.id, sp.so_luong + 1]))
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <i className="fas fa-plus text-sm"></i>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {sp.gia_mua.toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4 font-medium text-sky-950">
                          {(sp.gia_mua * sp.so_luong).toLocaleString()}đ
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => dispatch(xoaSanPham(sp.id))}
                            className="text-gray-400 hover:text-red-500 transition duration-300"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  Tổng đơn hàng
                </h2>
                <div className="space-y-4 border-b pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-medium">
                      {totalAmount.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">
                      {shippingFee.toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-6 border-b">
                  <span className="text-lg font-bold text-gray-800">
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-sky-950">
                    {(totalAmount + shippingFee).toLocaleString()}đ
                  </span>
                </div>
                <div className="pt-6 space-y-4">
                  <Link href="/user/payment" className="block">
                    <button className="w-full bg-sky-950 text-white py-4 rounded-lg hover:bg-sky-800 transition duration-300 flex items-center justify-center">
                      <i className="fas fa-lock mr-2"></i>
                      Tiến hành thanh toán
                    </button>
                  </Link>
                  <Link href="/" className="block">
                    <button className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                      <i className="fas fa-arrow-left mr-2"></i>
                      Tiếp tục mua sắm
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
