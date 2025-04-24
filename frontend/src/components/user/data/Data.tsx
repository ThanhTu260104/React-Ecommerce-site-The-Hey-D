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
  loai: ILoai;
  slug: string;
  created_at: string;
  updated_at: string;
  thuoc_tinh: IThuocTinh;
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
export interface IThuocTinh {
  id: number;
  id_sp: number;
  ram: string | number;
  cpu: string;
  dia_cung: string;
  mau_sac: string;
  can_nang: string; 
}
export interface IUser {
  id:number;
  ho_ten:string;
  email:string;
  mat_khau:string;
  vai_tro:number;
  khoa:boolean;
}
