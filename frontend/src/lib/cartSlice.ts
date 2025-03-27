import { createSlice, current } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

import { ISanPham, ICart } from "@/components/user/data/Data";

export const cartSlice = createSlice({
  name: "cart",
  initialState: { listSanPham: [] as ICart[], order: {} },
  reducers: {
    // Thêm sản phẩm
    themSanPham: (state, param) => {
      const sp = param.payload as ISanPham;
      const index = state.listSanPham.findIndex(
        (item: ICart) => item.id === sp.id
      );
      if (index >= 0) {
        state.listSanPham[index].so_luong++;
      } else {
        const c: ICart = {
          id: sp.id,
          ten_sp: sp.ten_sp,
          hinh: sp.hinh,
          so_luong: 1,
          gia_mua: sp.gia_km,
        };
        state.listSanPham.push(c);
      }
      console.log(
        "Đã thêm sản phẩm vào store. ListSanPham: ",
        current(state.listSanPham)
      );
    },

    suaSoLuong: (state, action: PayloadAction<[number, number]>) => {
      const [id, so_luong] = action.payload;
      const index = state.listSanPham.findIndex((s: ICart) => s.id === id);
      if (index !== -1) {
        if (so_luong < 1) {
          state.listSanPham.splice(index, 1);
        } else {
          state.listSanPham[index].so_luong = so_luong;
        }
        console.log("đã sửa số lượng ", action.payload);
      }
    },

    xoaSanPham: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.listSanPham.findIndex((s: ICart) => s.id === id);
      if (index !== -1) {
        state.listSanPham.splice(index, 1);
      }
      console.log("Đã xoá sản phẩm", id);
    },

    xoaGioHang: (state) => {
      state.listSanPham = [];
      console.log("Đã xoá giỏ hàng");
    },
  },
});
export const { themSanPham, suaSoLuong, xoaSanPham, xoaGioHang } =
  cartSlice.actions;
export default cartSlice.reducer;

// listSanPham là mảng các sản phẩm trong giỏ hàng
