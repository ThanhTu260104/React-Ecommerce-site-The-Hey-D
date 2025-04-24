"use client";

import React, { useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import { ISanPham } from '@/components/user/data/Data';
import Pagination from '@/components/admin/layout/Pagination';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
    const [products, setProducts] = useState<ISanPham[]>([]);
    const [keyword, setKeyword] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ISanPham | null>(null);
    
    // State for Delete Modal
    const [showDeleteModalState, setShowDeleteModalState] = useState(false); 
    const [productToDelete, setProductToDelete] = useState<ISanPham | null>(null);

    const limit = 15;

    const router = useRouter();

    // Helper function to format price
    const formatPrice = (price: number | undefined) => {
        if (price === undefined || price === null) return 'N/A';
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    // Helper function to format date and time
    const formatDateTime = (isoString: string | undefined) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(
          date.getMonth() + 1
        )}/${date.getFullYear()}`;
    };

    const showDetailProduct = (product: ISanPham) => {
        setSelectedProduct(product);
        setShowDetail(true);
    };
    
    const hideDetailProduct = () => {
        setSelectedProduct(null);
        setShowDetail(false);
    };
    
    // Show Delete Confirmation Modal
    const showDeleteModal = (product: ISanPham) => {
        setProductToDelete(product);
        setShowDeleteModalState(true);
    };

    // Hide Delete Confirmation Modal
    const hideDeleteModal = () => {
        setProductToDelete(null);
        setShowDeleteModalState(false);
    };

    const fetchProducts = async () => {
        try {
            let url = `http://localhost:3005/api/admin/sanpham?limit=${limit}&page=${page}`;
            if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
            if (filterStatus !== "") url += `&filterStatus=${filterStatus}`;

            // Get token from userAuth object in sessionStorage
            const userAuthString = sessionStorage.getItem('userAuth');
            if (!userAuthString) {
                console.error("No auth data found when trying to fetch products");
                router.push('/auth/login');
                return;
            }
            
            const userAuth = JSON.parse(userAuthString);
            const token = userAuth.token;
            
            console.log("Using token for API request:", token ? "Token exists" : "No token");

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!res.ok) {
                if (res.status === 401) {
                    console.error("Unauthorized: Token may be invalid or expired");
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Lỗi khi tải dữ liệu sản phẩm');
            }
            
            const result = await res.json();
            setProducts(result.items || []);
            setTotalItems(result.total || 0);
            setTotalPages(result.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi lọc/tìm kiếm sản phẩm:", err);
        }
    };

    useEffect(() => {
        // Restore fetching products based on dependencies
        fetchProducts(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, filterStatus, page]); // Restore page dependency

    // Handle Delete API Call
    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            const res = await fetch(`http://localhost:3005/api/admin/sanpham/${productToDelete.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            alert(data.thong_bao || "Đã xóa sản phẩm");

            hideDeleteModal(); // Close modal on success

            // Refetch product list after deletion
            fetchProducts(); 
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            alert("Lỗi server khi xóa sản phẩm");
        }
    };

    const handleDetailClick = (e: MouseEvent<HTMLAnchorElement>, product: ISanPham) => {
        e.preventDefault();
        showDetailProduct(product);
    };

    return (
        <>
        
          
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              {/* Header */}
              <header className="bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
                    <div className="flex space-x-2">
                        <a href="/admin/product/create"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                            <i className="fas fa-plus mr-2"></i>Thêm sản phẩm
                        </a>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            <i className="fas fa-file-excel mr-2"></i>Xuất Excel
                        </button>
                    </div>
                </div>
              </header>

              <div className="p-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tìm kiếm sản phẩm..."
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Tất cả danh mục</option>
                        <option value="1">Điện thoại</option>
                        <option value="2">Laptop</option>
                        <option value="3">Máy tính bảng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng
                            thái</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày 
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((sp) => (
                        <tr className="hover:bg-gray-50" key={sp.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                            <Image
  src={sp.hinh}
  alt="Product Image"
  width={70}
  height={70}
  unoptimized
  className="rounded-lg object-cover mr-4"
/>

                              <div>
                                <div className="text-xl font-medium text-gray-900">{sp.ten_sp}</div>
                                <div className="text-base text-gray-500">Slug: {sp.slug}</div>
<div className="text-base text-gray-500">
  Cấu hình: {sp.thuoc_tinh?.ram} | {sp.thuoc_tinh?.cpu} | {sp.thuoc_tinh?.dia_cung} | {sp.thuoc_tinh?.mau_sac} | {sp.thuoc_tinh?.can_nang}kg
</div>

                                <div className="text-base text-gray-500">Lượt xem: {sp.luot_xem}</div>
                                <div className="text-base text-gray-500">Tồn kho: 500</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-lg text-gray-500">{sp.loai?.ten_loai}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg text-gray-900">{formatPrice(sp.gia)}</div>
                            <div className="text-lg text-green-600">{formatPrice(sp.gia_km)}</div>
                          </td>
                          <td className="px-6 py-4 text-base text-gray-900">
                            <a href="#" onClick={(e) => handleDetailClick(e, sp)} className="text-blue-600 hover:text-blue-900 mr-3">Xem chi tiết</a>
                          </td>
                          <td className="px-6 py-4 ">
                            {Number(sp.an_hien) === 1 ? (
                              <span className="px-2 py-1 text-base rounded-full bg-green-200 text-green-800">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-base rounded-full bg-gray-300 text-gray-600">
                                Ẩn
                              </span>
                            )}
                            {Number(sp.hot) === 1 ? (
                              <span className="px-2 py-1 text-base rounded-full bg-green-200 text-green-800">
                                Nổi bật
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-base rounded-full bg-gray-300 text-gray-600">
                                Không nổi bật
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base text-gray-900">Ngày tạo: {formatDateTime(sp.created_at)}</div>
                            <div className="text-base text-green-600">Ngày cập nhật: {formatDateTime(sp.updated_at)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <a href={`/admin/product/edit/${sp.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                              <i className="fas fa-edit"></i>
                            </a>
                            <button onClick={() => showDeleteModal(sp)} className="text-red-600 hover:text-red-900">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Hiển thị {(page - 1) * limit + 1}-{Math.min(page * limit, totalItems)} của {totalItems} sản phẩm
                        </div>
                        <Pagination 
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </main>
        

            {/* Delete Confirmation Modal */}
            {showDeleteModalState && productToDelete && (
                <div id="deleteModal" className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div  className="relative mx-auto p-5  w-96 shadow-[0px_10px_20px_2px_rgba(0,0,0,0.3)] rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Xác nhận xóa sản phẩm</h3>
                             <span className="text-lg pt-2 leading-6 font-medium text-red-600">
                                {productToDelete.ten_sp}
                            </span>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button onClick={hideDeleteModal} id="deleteCancel" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded mr-2">
                                    Hủy
                                </button>
                                <button onClick={handleDelete} id="deleteConfirm" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
  
          {/* Detail Product Modal Placeholder */}
          {showDetail && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative mx-auto p-5  w-96 shadow-[0px_10px_20px_2px_rgba(0,0,0,0.3)] rounded-md bg-white">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800">Mô tả sản phẩm</h3>
            <button onClick={hideDetailProduct} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{selectedProduct?.mo_ta}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={hideDetailProduct} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition">
              Đóng
            </button>
          </div>
        </div>
      </div>
    )}
        </>
      );
    }