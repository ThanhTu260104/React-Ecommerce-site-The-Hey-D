export interface ILoai {
  id: number;
  ten_loai: string;
  thu_tu: number;
  slug: string;
  an_hien: number;
  created_at: string;
  updated_at: string;
  so_san_pham: number;
}
export interface ISanPham {
  id: number;
  ten_sp: string;
  gia: number;
  gia_km: number;
  ngay: string;
  mo_ta: string;
  hinh: string;
  id_loai: number;
  luot_xem: number;
  hot: string;
  an_hien: string;
  tinh_chat: string;
}
export interface ITinTuc {
  id: number;
  tieu_de: string;
  mo_ta: string;
  slug: string;
  ngay: string;
  noi_dung: string;
  luot_xem: number;
  hinh: string;
}
export interface ICart {
  id: number;
  ten_sp: string;
  so_luong: number;
  gia_mua: number;
  hinh: string;
}
