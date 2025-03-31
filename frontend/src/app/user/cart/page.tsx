"use client";
import { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { ICart } from "@/components/user/data/Data";
import { suaSoLuong, xoaSanPham } from "@/lib/cartSlice";
import Image from "next/image";
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
      <div className="min-h-screen bg-gray-50 pt-28">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shopping-cart text-4xl text-gray-400"></i>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-gray-800">
                Giỏ hàng trống
              </h1>
              <p className="text-gray-600 mb-8">
                Bạn chưa thêm sản phẩm nào vào giỏ hàng.
              </p>
            </div>
            <Link href="/user/product">
              <button className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                <i className="fas fa-arrow-left mr-2"></i>
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Giỏ hàng của bạn
              <span className="text-gray-500 text-lg ml-2">
                ({cart_arr.length} sản phẩm)
              </span>
            </h1>
            <Link href="/user/product">
              <button className="text-gray-600 hover:text-gray-900">
                <i className="fas fa-arrow-left mr-2"></i>
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-6">
              {cart_arr.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={sp.hinh}
                        alt={sp.ten_sp}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {sp.ten_sp}
                          </h3>
                          <p className="text-gray-600">
                            Đơn giá:{" "}
                            <span className="font-medium text-gray-800">
                              {sp.gia_mua.toLocaleString()}đ
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(xoaSanPham(sp.id))}
                          className="text-gray-400 hover:text-red-500 transition duration-300 p-2"
                        >
                          <i className="fas fa-times text-lg"></i>
                        </button>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              dispatch(suaSoLuong([sp.id, sp.so_luong - 1]))
                            }
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            disabled={sp.so_luong <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input
                            type="number"
                            className="w-20 text-center border-2 rounded-lg py-2 text-lg font-medium"
                            value={sp.so_luong}
                            onChange={(e) =>
                              dispatch(
                                suaSoLuong([sp.id, parseInt(e.target.value)])
                              )
                            }
                            min="1"
                          />
                          <button
                            onClick={() =>
                              dispatch(suaSoLuong([sp.id, sp.so_luong + 1]))
                            }
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {(sp.gia_mua * sp.so_luong).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng đơn hàng */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b text-gray-800">
                  Tổng đơn hàng
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cart_arr.length} sản phẩm):</span>
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
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-gray-800">
                        Tổng cộng:
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {(totalAmount + shippingFee).toLocaleString()}đ
                      </span>
                    </div>
                    <Link href="/user/payment" className="block">
                      <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center">
                        <i className="fas fa-lock mr-2"></i>
                        Tiến hành thanh toán
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
