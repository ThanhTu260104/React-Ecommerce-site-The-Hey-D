const { Sequelize, DataTypes } = require("sequelize");
// Tạo đối tượng kết nối đến database
const sequelize = new Sequelize("laptop_node", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// model mô tả table loai
const LoaiModel = sequelize.define(
  "loai",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_loai: { type: DataTypes.STRING, allowNull: false },
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "loai" }
);

// model diễn tả cấu trúc 2 table san_pham
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    id_loai: { type: DataTypes.INTEGER },
    mo_ta: { type: DataTypes.TEXT },
    hot: { type: DataTypes.INTEGER },
    an_hien: { type: DataTypes.INTEGER },
    hinh: { type: DataTypes.STRING },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "san_pham" }
);
const TinTucModel = sequelize.define(
  "tin_tuc",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tieu_de: { type: DataTypes.STRING },
    mo_ta: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    noi_dung: { type: DataTypes.TEXT },
    id_loai: { type: DataTypes.INTEGER },
    luot_xem: { type: DataTypes.NUMBER },
    hinh: { type: DataTypes.STRING },
  },
  { timestamps: false, tableName: "tin_tuc" }
);
const DonHangModel = sequelize.define(
  "don_hang",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thoi_diem_mua: { type: DataTypes.DATE, defaultValue: new Date() },
    ho_ten: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    ghi_chu: { type: DataTypes.STRING, defaultValue: "" },
  },
  { timestamps: false, tableName: "don_hang" }
);
// model diễn tả cấu trúc  table don_hang_chi_tiet
const DonHangChiTietModel = sequelize.define(
  "don_hang_chi_tiet",
  {
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dh: { type: DataTypes.INTEGER },
    id_sp: { type: DataTypes.INTEGER },
    so_luong: { type: DataTypes.INTEGER },
  },
  { timestamps: false, tableName: "don_hang_chi_tiet" }
);
module.exports = {
  SanPhamModel,
  LoaiModel,
  DonHangModel,
  TinTucModel,
  DonHangChiTietModel,
};
