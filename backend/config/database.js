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
    slug: { type: DataTypes.STRING, allowNull: false, unique: true }, // thêm slug
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm created_at
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm updated_at
  },
  {
    tableName: "loai",
    timestamps: false, // giữ nguyên vì bạn đang quản lý created_at/updated_at trong DB
  }
);

const ThuocTinhModel = sequelize.define(
  "thuoc_tinh",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    id_sp: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    ram: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    cpu: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    dia_cung: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    mau_sac: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    can_nang: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: "thuoc_tinh",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// model diễn tả cấu trúc 2 table san_pham
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    id_loai: { type: DataTypes.INTEGER },
    mo_ta: { type: DataTypes.TEXT },
    hot: { type: DataTypes.INTEGER },
    an_hien: { type: DataTypes.INTEGER },
    hinh: { type: DataTypes.STRING },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm created_at
    hinh_public_id: { type: DataTypes.STRING },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm updated_at
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
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm created_at
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm updated_at
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

LoaiModel.hasMany(SanPhamModel, { foreignKey: "id_loai", as: "san_phams" });

SanPhamModel.belongsTo(LoaiModel, { foreignKey: "id_loai", as: "loai" });

SanPhamModel.hasOne(ThuocTinhModel, { foreignKey: "id_sp", as: "thuoc_tinh" });
ThuocTinhModel.belongsTo(SanPhamModel, { foreignKey: "id_sp" });

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

const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mat_khau: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ho_ten: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ngay_sinh: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dien_thoai: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dia_chi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dien_thoai: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vai_tro: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0, // 0 = user, 1 = admin
    },
    khoa: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0, // 0 = active, 1 = khóa
    },
    hinh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false, // Vì bạn không có updated_at
  }
);

module.exports = {
  SanPhamModel,
  LoaiModel,
  DonHangModel,
  TinTucModel,
  DonHangChiTietModel,
  ThuocTinhModel,
  UserModel,
};
