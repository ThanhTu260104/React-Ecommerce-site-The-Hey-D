"use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Show1Product from "../../components/user/layout/Show1Product";
// import { ISanPham } from "../../components/user/data/Data";

export default function Home() {
 
  return (
    
  <div>
    <main className="flex-1 overflow-y-auto">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <button className="md:hidden text-gray-600">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900">
                            <i className="fas fa-bell"></i>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                            <i className="fas fa-user-circle text-xl"></i>
                            <span className="hidden md:inline">Tài khoản</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium">Tổng người dùng</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                +12%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">1.254</p>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <i className="fas fa-arrow-up text-green-500 mr-1"></i>
                            <span>So với tuần trước</span>
                        </div>
                    </div>

                    {/* Bạn có thể nhân bản thêm các card tương tự như trên cho: Đơn hàng, Sản phẩm, Doanh thu */}
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Xem tất cả</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ĐH-123456</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nguyễn Văn A</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30/03/2024</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Hoàn thành
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.500.000đ</td>
                                </tr>
                                {/* Có thể map danh sách đơn hàng ở đây nếu dữ liệu đến từ API */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
  </div>
  )
}
