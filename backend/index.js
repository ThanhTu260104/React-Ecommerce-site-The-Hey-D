const express = require("express");
const { Sequelize } = require("sequelize");
const uploadCloud = require("./config/uploadCloud");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require('cloudinary').v2;
var app = express(); //tạo ứng dụng nodejs
const { uploader } = require("./config/cloudinary"); // nhớ import
const fs = require("fs");
const { adminAuth } = require('./auth'); // Import the adminAuth middleware
const port = 3005;
app.use(express.json()); //cho phép đọc dữ liệu dạng json
const cors = require("cors");
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng


const {
  SanPhamModel,
  LoaiModel,
  TinTucModel,
  DonHangModel,
  ThuocTinhModel,
  UserModel,
  DonHangChiTietModel,
} = require("./config/database"); //các model lấy database

//routes

// Tạo slug tự động
function generateSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // xoá dấu tiếng Việt
    .replace(/[^a-z0-9]+/g, "-")       // thay ký tự đặc biệt bằng dấu -
    .replace(/^-+|-+$/g, "")           // bỏ dấu - ở đầu/cuối
    .replace(/--+/g, "-");            // gộp nhiều dấu - liên tiếp thành 1
}
function generateUniqueSlug(baseName) {
  return `${generateSlug(baseName)}-${Date.now()}`;
}

app.get("/api/admin/user", adminAuth, async (req, res) => {
  try {
    const users = await UserModel.findAll({
      where: {
        email_verified_at: {
          [Op.ne]: null, // Op.ne = "not equal", tức là khác null
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error });
  }
});
app.get("/api/admin/user/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByPk(id);
  res.json(user);
});
app.post("/api/admin/user", adminAuth, async (req, res) => {
  const { ho_ten, email, dien_thoai, dia_chi, vai_tro, trang_thai, ngay_sinh, hinh } = req.body;
  const user = await UserModel.create({ ho_ten, email, dien_thoai, dia_chi, vai_tro, trang_thai, ngay_sinh, hinh });
  res.json(user);
});
app.put("/api/admin/user/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { ho_ten, email, dien_thoai, dia_chi, vai_tro, trang_thai, ngay_sinh, hinh } = req.body;
  const user = await UserModel.findByPk(id);
  res.json(user);
});
app.delete("/api/admin/user/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByPk(id);
  res.json(user);
});


// Lấy danh sách loại sản phẩm

app.get("/api/loai", async (req, res) => {
  const loai_arr = await LoaiModel.findAll({
    where: { an_hien: 1 },
    order: [["thu_tu", "ASC"]],
  });
  res.json(loai_arr);
});

app.get("/api/admin/loai", adminAuth, async (req, res) => {
  const { an_hien, tu_khoa, limit = 15, page = 1 } = req.query;
  const whereClause = {};

  if (an_hien !== undefined) {
    whereClause.an_hien = an_hien;
  }

  if (tu_khoa) {
    whereClause.ten_loai = { [Op.like]: `%${tu_khoa}%` };
  }

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const total = await LoaiModel.count({ where: whereClause });

    const rows = await LoaiModel.findAll({
      where: whereClause,
      order: [["thu_tu", "ASC"]],
      limit: parsedLimit,
      offset: offset,
      include: [{
        model: SanPhamModel,
        attributes: [],
        as: 'san_phams', // ✅ Đúng alias
        required: false
      }],
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('san_phams.id')), 'so_san_pham']
        ]
      },
      group: ['loai.id'],
      subQuery: false
    });

    res.json({ total, data: rows });
  } catch (err) {
    console.error("Lỗi lấy danh sách loại:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy danh sách loại." });
  }
});

app.get("/api/admin/loai/:id", adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const loai = await LoaiModel.findByPk(id);

    if (!loai) {
      return res.status(404).json({ thong_bao: "Không tìm thấy loại." });
    }

    res.json(loai);
  } catch (err) {
    console.error("Lỗi khi lấy loại theo ID:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy loại." });
  }
});
app.get("/api/loai/:id", async (req, res) => {
  const loai = await LoaiModel.findByPk(req.params.id);
  res.json(loai);
});

app.post("/api/loai", async (req, res) => {
  const { ten_loai, an_hien, thu_tu } = req.body;

  // Validate đầu vào từng phần cụ thể
  const errors = [];
  if (!ten_loai || typeof ten_loai !== "string" || ten_loai.trim() === "") {
    errors.push("Tên loại là bắt buộc và phải là chuỗi.");
  }

  if (an_hien === undefined || (an_hien !== 0 && an_hien !== 1)) {
    errors.push("Trạng thái hiển thị (an_hien) phải là 0 hoặc 1.");
  }

  if (thu_tu !== undefined && (isNaN(thu_tu) || thu_tu < 0)) {
    errors.push("Thứ tự (thu_tu) phải là số nguyên không âm.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ thong_bao: "Dữ liệu không hợp lệ", errors });
  }

  // Tạo slug tự động từ ten_loai
  const slug = ten_loai
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // Kiểm tra nếu người dùng nhập thu_tu → có bị trùng không?
    let thu_tu_final;

    if (thu_tu !== undefined) {
      const ton_tai = await LoaiModel.findOne({ where: { thu_tu } });
      if (ton_tai) {
        return res.status(400).json({
          thong_bao: "Thứ tự đã tồn tại, hãy chọn số khác!",
        });
      }
      thu_tu_final = thu_tu;
    } else {
      const maxThuTu = await LoaiModel.max("thu_tu");
      thu_tu_final = (maxThuTu || 0) + 1;
    }

    const loai = await LoaiModel.create({
      ten_loai,
      slug,
      thu_tu: thu_tu_final,
      an_hien,
    });

    return res.json({ thong_bao: "Đã thêm loại thành công", loai });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        thong_bao: "Slug đã tồn tại. Hãy đổi tên loại.",
      });
    }

    console.error("Lỗi khi thêm loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi thêm loại." });
  }
});
app.put("/api/loai/:id", async (req, res) => {
  const { id } = req.params;
  const { ten_loai, thu_tu, an_hien } = req.body;

  if (!ten_loai || an_hien === undefined) {
    return res.status(400).json({ thong_bao: "Thiếu dữ liệu đầu vào!" });
  }

  // Tạo slug tự động từ ten_loai
  const slug = ten_loai
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // Kiểm tra xem loại có tồn tại không
    const loaiHienTai = await LoaiModel.findByPk(id);
    if (!loaiHienTai) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy loại để cập nhật." });
    }

    // Xử lý thu_tu
    let thu_tu_final = loaiHienTai.thu_tu; // giữ nguyên mặc định nếu không có

    if (thu_tu !== undefined) {
      // Nếu người dùng nhập → kiểm tra có trùng không (với bản ghi khác)
      const trung = await LoaiModel.findOne({
        where: {
          thu_tu,
          id: { [Op.ne]: id }, // loại trừ chính bản ghi đang sửa
        },
      });

      if (trung) {
        return res.status(400).json({
          thong_bao: "Thứ tự đã tồn tại. Vui lòng chọn số khác.",
        });
      }

      thu_tu_final = thu_tu;
    }

    // Cập nhật dữ liệu
    await LoaiModel.update(
      {
        ten_loai,
        slug,
        thu_tu: thu_tu_final,
        an_hien,
      },
      {
        where: { id },
      }
    );

    return res.json({ thong_bao: "Đã cập nhật loại thành công." });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ thong_bao: "Slug đã tồn tại. Hãy đổi tên loại." });
    }

    console.error("Lỗi khi cập nhật loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi cập nhật loại." });
  }
});
app.delete("/api/loai/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const soBanGhi = await LoaiModel.destroy({ where: { id } });

    if (soBanGhi === 0) {
      return res.status(404).json({ thong_bao: "Không tìm thấy loại để xóa." });
    }

    return res.json({ thong_bao: "Đã xóa loại thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi xóa loại." });
  }
});

/*  ------------------------------------------------------   */

// Lấy tất cả sản phẩm
//GET http://localhost:5000/api/sanpham?category=shoes&sort=price_asc

app.get("/api/sanpham", async (req, res) => {
  let { page, limit, category, sort, hot } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 16; // mặc định hiện 10 sản phẩm
  let whereClause = { an_hien: 1 };
  if (category) whereClause.id_loai = category;
  let order = [];
  if (sort === "asc") order = [["gia", "ASC"]]; //sắp xếp tăng dần
  else if (sort === "desc") order = [["gia", "DESC"]]; //sắp xếp giảm dần
  else
    order = [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ];
  // sắp xếp theo ngày mới nhất và giá tăng dần
  if (hot === "1") {
    whereClause.hot = 1;
  } else {
    whereClause.hot = 0;
  }
  const offset = (page - 1) * limit;
  const sp_arr = await SanPhamModel.findAll({
    where: whereClause,
    order: order,
    offset: offset,
    limit: limit,
  });
  res.json(sp_arr);
});
app.get("/api/sphot/:sosp?", async (req, res) => {
  const sosp = Number(req.params.sosp) || 3;
  const sp_arr = await SanPhamModel.findAll({
    where: { an_hien: 1, hot: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: 0,
    limit: sosp,
  });
  res.json(sp_arr);
});
app.get("/api/spmoi/:sosp?", async (req, res) => {
  const sosp = Number(req.params.sosp) || 6;
  const sp_arr = await SanPhamModel.findAll({
    where: { an_hien: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: 0,
    limit: sosp,
  });
  res.json(sp_arr);
});
app.get("/api/sp/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sp = await SanPhamModel.findOne({
    where: { id: id },
  });
  res.json(sp);
});
app.get("/api/sptrongloai/:id", async (req, res) => {
  const id_loai = Number(req.params.id);

  const sp_arr = await SanPhamModel.findAll({
    where: { id_loai: id_loai, an_hien: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
  });
  res.json(sp_arr);
});


app.get("/api/admin/sanpham", adminAuth, async (req, res) => {
  let { page, limit, category, sort, minPrice, maxPrice, keyword, filterStatus } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;

  let whereClause = {};

  // Add category filter if filterStatus is provided
  if (filterStatus) {
    whereClause.id_loai = filterStatus;
  }

  if (minPrice && maxPrice) {
    whereClause.gia = {
      [Op.between]: [parseInt(minPrice), parseInt(maxPrice)],
    };
  } else if (minPrice) {
    whereClause.gia = {
      [Op.gte]: parseInt(minPrice),
    };
  } else if (maxPrice) {
    whereClause.gia = {
      [Op.lte]: parseInt(maxPrice),
    };
  }

  if (keyword) {
    whereClause.ten_sp = {
      [Op.like]: `%${keyword}%`,
    };
  }

  let order = [];
  if (sort === "asc") order = [["gia", "ASC"]];
  else if (sort === "desc") order = [["gia", "DESC"]];
  else order = [["ngay", "DESC"], ["gia", "ASC"]];

  const offset = (page - 1) * limit;
  const total = await SanPhamModel.count({ where: whereClause });
  const totalPages = Math.ceil(total / limit);

  const items = await SanPhamModel.findAll({
    where: whereClause,
    order,
    offset,
    limit,
    include: [
      {
        model: ThuocTinhModel,
        as: 'thuoc_tinh',
      },
      {
        model: LoaiModel,
        as: 'loai'
      }
    ],
  });

  res.json({
    items,
    total,
    totalPages,
    page,
    limit,
    totalItems: total,
  });
});

app.get("/api/admin/sanpham/:id", adminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const sp = await SanPhamModel.findByPk(id, {
      include: [
        {
          model: ThuocTinhModel,
          as: 'thuoc_tinh',
        },
        {
          model: LoaiModel,
          as: 'loai'
        }
      ],
    });

    if (!sp) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(sp);
  } catch (err) {
    console.error("Lỗi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});



app.post("/api/upload", uploadCloud.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path; // URL ảnh lưu trên Cloudinary
    const publicId = req.file.filename; // public_id để xoá sau này

    res.json({ url: imageUrl, public_id: `products/${publicId}` });
  } catch (err) {
    console.error("Lỗi upload:", err);
    res.status(500).json({ thong_bao: "Lỗi khi upload ảnh." });
  }
});


app.post("/api/admin/sanpham", uploadCloud.single("hinh"), async (req, res) => {
  try {
    const {
      ten_sp,
      gia,
      gia_km,
      id_loai,
      mo_ta,
      hot = 0,
      an_hien = 1,
      tinh_chat = 0,
      ngay = new Date(),
      slug,
      thuoc_tinh,
    } = req.body;

    if (!ten_sp || !id_loai || gia === undefined) {
      return res.status(400).json({ thong_bao: "Thiếu dữ liệu bắt buộc." });
    }

    const finalSlug = slug || generateUniqueSlug(ten_sp);

    // ✅ Lấy link ảnh từ Cloudinary (nếu có upload)
    const imageUrl = req.file?.path || "";
    const publicId = req.file?.filename || ""; 


    const sanpham = await SanPhamModel.create({
      ten_sp,
      slug: finalSlug,
      gia,
      gia_km,
      id_loai,
      mo_ta,
      hot,
      an_hien,
      tinh_chat,
      ngay,
      hinh: imageUrl, 
      hinh_public_id: publicId, 
    });

    if (thuoc_tinh && typeof thuoc_tinh === 'object') {
      await ThuocTinhModel.create({
        ...thuoc_tinh,
        id_sp: sanpham.id,
      });
    }

    return res.json({
      thong_bao: "Đã thêm sản phẩm thành công",
      sanpham,
    });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi thêm sản phẩm." });
  }
});
app.put("/api/admin/sanpham/:id", uploadCloud.single("hinh"), async (req, res) => {
  const { id } = req.params;
  
  try {
    // Validate required fields
    if (!req.body.ten_sp || !req.body.id_loai || req.body.gia === undefined) {
      return res.status(400).json({ thong_bao: "Thiếu dữ liệu bắt buộc." });
    }

    const sp = await SanPhamModel.findByPk(id);
    if (!sp) {
      return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm." });
    }

    // Parse numeric values
    const gia = Number(req.body.gia);
    const gia_km = Number(req.body.gia_km);
    const id_loai = Number(req.body.id_loai);
    const hot = Number(req.body.hot);
    const an_hien = Number(req.body.an_hien);

    if (isNaN(gia) || isNaN(id_loai)) {
      return res.status(400).json({ thong_bao: "Dữ liệu không hợp lệ." });
    }

    // Tạo slug mới nếu không có
    const finalSlug = req.body.slug || generateUniqueSlug(req.body.ten_sp);

    let updatedData = {
      ten_sp: req.body.ten_sp,
      slug: finalSlug,
      gia,
      gia_km: isNaN(gia_km) ? null : gia_km,
      id_loai,
      mo_ta: req.body.mo_ta,
      hot: isNaN(hot) ? 0 : hot,
      an_hien: isNaN(an_hien) ? 1 : an_hien,
      tinh_chat: 0,
      ngay: req.body.ngay || new Date()
    };

    // Xử lý thuộc tính
    if (req.body.thuoc_tinh) {
      try {
        const thuocTinhData = typeof req.body.thuoc_tinh === 'string' 
          ? JSON.parse(req.body.thuoc_tinh) 
          : req.body.thuoc_tinh;

        const existingTT = await ThuocTinhModel.findOne({ where: { id_sp: id } });
      
        if (existingTT) {
          await ThuocTinhModel.update(thuocTinhData, {
            where: { id_sp: id }
          });
        } else {
          await ThuocTinhModel.create({
            ...thuocTinhData,
            id_sp: id,
          });
        }
      } catch (err) {
        console.error("Lỗi xử lý thuộc tính:", err);
        return res.status(400).json({ thong_bao: "Dữ liệu thuộc tính không hợp lệ." });
      }
    }
    
    // Nếu có ảnh mới
    if (req.file) {
      try {
        // Xoá ảnh cũ nếu có
        if (sp.hinh_public_id) {
          await cloudinary.uploader.destroy(sp.hinh_public_id);
        }

        updatedData.hinh = req.file.path;
        updatedData.hinh_public_id = `products/${req.file.filename}`;
      } catch (err) {
        console.error("Lỗi xử lý ảnh:", err);
        return res.status(500).json({ thong_bao: "Lỗi khi xử lý ảnh." });
      }
    }

    await SanPhamModel.update(updatedData, { where: { id } });

    res.json({ thong_bao: "Đã cập nhật sản phẩm thành công." });
  } catch (err) {
    console.error("Lỗi cập nhật sản phẩm:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi cập nhật sản phẩm." });
  }
});

app.delete("/api/admin/sanpham/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sp = await SanPhamModel.findByPk(id);

    if (!sp) {
      return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm." });
    }

    // ✅ Xoá ảnh trên Cloudinary nếu có
    if (sp.hinh_public_id) {
      await cloudinary.uploader.destroy(sp.hinh_public_id, {
        resource_type: "image",
      });
    }

    // ✅ Xoá thuộc tính
    await ThuocTinhModel.destroy({ where: { id_sp: id } });

    // ✅ Xoá sản phẩm
    await SanPhamModel.destroy({ where: { id: id } });

    return res.json({ thong_bao: "Đã xoá sản phẩm và ảnh thành công." });
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi xoá sản phẩm." });
  }
});







// Tìm kiếm
app.get("/api/timkiem/:tu_khoa/:page?", async (req, res) => {
  const tu_khoa = req.params.tu_khoa;
  const page = Number(req.params.page) || 1;
  const sosp = Number(req.query.sosp) || 12;
  const sp_arr = await SanPhamModel.findAll({
    where: { ten_sp: { [Op.like]: `%${tu_khoa}%` }, an_hien: 1 },

    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: (page - 1) * sosp,
    limit: sosp,
  });
  res.json(sp_arr);
});
app.get("/api/admin/loai/timkiem", adminAuth, async (req, res) => {
  const { tu_khoa } = req.query;

  try {
    const loai_arr = await LoaiModel.findAll({
      where: {
        ten_loai: {
          [Op.like]: `%${tu_khoa || ""}%`, // nếu không có từ khóa thì trả về tất cả
        },
      },
      order: [["thu_tu", "ASC"]],
    });

    res.json(loai_arr);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm loại:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi tìm kiếm loại." });
  }
});

app.get("/api/tintuc", async (req, res) => {
  const tintuc_arr = await TinTucModel.findAll();
  res.json(tintuc_arr);
});
app.get("/api/tintuc/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tintuc = await TinTucModel.findOne({
    where: { id: id },
  });
  res.json(tintuc);
});


app.post("/api/luudonhang", async (req, res) => {
  let { ho_ten, email, ghi_chu } = req.body;
  await DonHangModel.create({
    ho_ten: ho_ten,
    email: email,
    ghi_chu: ghi_chu,
  })
    .then(function (item) {
      res.json({ thong_bao: "Tạo đơn hàng thành công", dh: item });
    })
    .catch(function (err) {
      res.json({ thong_bao: " Lỗi tạo đơn hàng", err });
    });
});
app.post("/api/luugiohang", async (req, res) => {
  let { id_dh, id_sp, so_luong } = req.body;
  await DonHangChiTietModel.create({
    id_dh: id_dh,
    id_sp: id_sp,
    so_luong: so_luong,
  })
    .then(function (item) {
      res.json({ thong_bao: "Đã lưu giỏ hàng thành công", sp: item });
    })
    .catch(function (err) {
      res.json({ thong_bao: "lỗi khi lưu giỏ hàng", err });
    });
});



app.post("/api/dangnhap", async (req, res) => {
  console.log("Signin request body:", req.body);
  const { email, password } = req.body;

  // Add validation for email and password
  if (!email || !password) {
    console.log("Login attempt missing email or password");
    return res.status(400).json({ msg: "Vui lòng cung cấp cả email và mật khẩu." });
  }

  try {
    // Tìm người dùng theo email
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      console.log("Email not found:", email);
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.mat_khau);
    if (!isMatch) {
      console.log("Incorrect password for email:", email);
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    // Kiểm tra xác thực email
    if (user.email_verified_at === null) {
      console.log("Email not verified for:", email);
      return res.status(400).json({
        msg: "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.",
      });
    }

    // Kiểm tra tài khoản bị khóa
    if (user.khoa) {
      console.log("Account locked for email:", email);
      return res.status(400).json({
        msg: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    // Tạo JWT token
    const secret = "rat_met";
    const payload = {
      id: user.id,
      email: user.email,
      ho_ten: user.ho_ten,
      vai_tro: user.vai_tro
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
      subject: String(user.id),
    });

    // Determine response based on role
    if (user.vai_tro === 1) {
      // Admin user
      res.status(200).json({
        token,
        expiresIn: "1h",
        info: {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          vai_tro: user.vai_tro
        },
        redirectTo: '/admin/dashboard' // Suggest admin redirection
      });
    } else {
      // Client user
      res.status(200).json({
        token,
        expiresIn: "1h",
        info: {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          vai_tro: user.vai_tro
        },
        redirectTo: '/' // Suggest client redirection
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Lỗi server", error });
  }
});










app.post("/api/dangky", async (req, res) => {
  console.log(req.body);
  // Dữ liệu người dùng gửi lên
  let { ho_ten, email, password, repeatPassword } = req.body;

  // Kiểm tra mật khẩu nhập lại có khớp với mật khẩu không
  if (password !== repeatPassword) {
    return res.status(400).json({
      msg: "Mật khẩu và mật khẩu nhập lại không khớp",
      field: "repeatPassword",
    });
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        msg: "Email đã tồn tại", 
        field: "email" 
      });
    }

    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    let mat_khau = bcrypt.hashSync(password, salt);

    // Thêm người dùng mới với email_verified_at là null (chưa xác thực)
    const user = await UserModel.create({
      ho_ten,
      email,
      mat_khau,
      vai_tro: 0,
      email_verified_at: null
    });

    // Tạo token kích hoạt tài khoản
    const secret = "rat_met";
    const payload = { email: email };
    const activationToken = jwt.sign(payload, secret, { expiresIn: "24h" });
    
    // Tạo link kích hoạt tài khoản
    const activationLink = `${req.protocol}://${req.get("host")}/api/kichhoattaikhoan?token=${activationToken}`;
    
    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Nội dung email
    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Xác nhận đăng ký tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">Xác nhận đăng ký tài khoản</h2>
          <p>Xin chào ${ho_ten},</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Để kích hoạt tài khoản, vui lòng click vào link dưới đây:</p>
          <p><a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Kích hoạt tài khoản</a></p>
          <p>Hoặc bạn có thể copy đường link này vào trình duyệt: <br> ${activationLink}</p>
          <p>Link này sẽ hết hạn sau 24 giờ.</p>
          <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br><strong>Đội ngũ hỗ trợ</strong></p>
        </div>
      `,
    };
    
    // Gửi email
    await transporter.sendMail(mailOptions);
    
    return res.status(201).json({ 
      msg: `Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.`,
      success: true 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      msg: "Đăng ký thất bại", 
      field: "server", 
      error: error.message 
    });
  }
});

app.post("/api/quenmatkhau", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "Email không tồn tại" });
    }

    // Tạo JWT token reset mật khẩu
    const secret = process.env.JWT_SECRET || "rat_met";
    const payload = {
      id: user.id,
      email: user.email
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" }); // Hạn 15 phút

    const resetLink = `http://localhost:3008/auth/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Support <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
        <div style="font-family: Arial; color: #333;">
          <h2>Đặt lại mật khẩu</h2>
          <p>Xin chào ${user.ho_ten},</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link dưới đây:</p>
          <a href="${resetLink}" style="color: #007bff;">Đặt lại mật khẩu</a>
          <p><i>Liên kết có hiệu lực trong 15 phút.</i></p>
          <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Liên kết đặt lại mật khẩu đã được gửi đến email." });
  } catch (err) {
    console.error("Lỗi khi gửi mail đặt lại mật khẩu:", err);
    res.status(500).json({ msg: "Lỗi máy chủ", error: err.message });
  }
});
app.post("/api/datlaimatkhau", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const secret = process.env.JWT_SECRET || "rat_met";
    const decoded = jwt.verify(token, secret); // Tự động kiểm tra hạn

    const user = await UserModel.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ msg: "Người dùng không tồn tại" });
    }

    const salt = bcrypt.genSaltSync(10);
    const mat_khau = bcrypt.hashSync(newPassword, salt);

    await UserModel.update(
      { mat_khau },
      { where: { id: user.id } }
    );

    return res.status(200).json({ msg: "Mật khẩu đã được đặt lại thành công" });
  } catch (err) {
    console.error("Lỗi đặt lại mật khẩu:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ msg: "Token đã hết hạn, vui lòng yêu cầu lại." });
    }

    res.status(400).json({ msg: "Token không hợp lệ hoặc đã bị thay đổi." });
  }
});




app.post("/api/doimatkhau", async (req, res) => {
  try {
    // Lấy token từ header
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "Không tìm thấy token" });
    }
    
    token = token.substring(7); // Cắt bỏ "Bearer "
    
    // Giải mã token
    const secret = "rat_met";
    const payload = jwt.verify(token, secret, { maxAge: "1h" });
    
    // Lấy thông tin từ request body
    const { old_password, new_password, repeat_password } = req.body;
    
    // Kiểm tra mật khẩu mới và nhập lại
    if (new_password !== repeat_password) {
      return res.status(400).json({ 
        msg: "Mật khẩu mới và mật khẩu nhập lại không khớp" 
      });
    }
    
    // Tìm người dùng
    const user = await UserModel.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy thông tin người dùng" });
    }
    
    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(old_password, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu cũ không đúng" });
    }
    
    // Mã hóa mật khẩu mới
    const salt = bcrypt.genSaltSync(10);
    const mat_khau = bcrypt.hashSync(new_password, salt);
    
    // Cập nhật mật khẩu
    await UserModel.update({ mat_khau }, { where: { id: user.id } });
    
    return res.status(200).json({ 
      msg: "Đã cập nhật mật khẩu mới thành công", 
      success: true 
    });
    
  } catch (error) {
    console.error("Change password error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: "Token đã hết hạn" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: "Token không hợp lệ" });
    }
    return res.status(500).json({ 
      msg: "Lỗi khi đổi mật khẩu", 
      error: error.message 
    });
  }
});







app.get("/api/kichhoattaikhoan", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      console.log("Lỗi: Token không được cung cấp");
      return res.status(400).json({ msg: "Token không hợp lệ" });
    }

    const secret = process.env.JWT_SECRET || "rat_met";
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.log("Lỗi khi giải mã token:", err);
      return res
        .status(401)
        .json({ msg: "Token hết hạn hoặc không hợp lệ!", error: err.message });
    }

    if (!decoded.email) {
      console.log("Lỗi: Token không chứa email hợp lệ");
      return res.status(400).json({ msg: "Token không chứa email hợp lệ!" });
    }

    // Tìm người dùng theo email
    const user = await UserModel.findOne({ where: { email: decoded.email } });
    
    if (!user) {
      console.log("Lỗi: Email không tồn tại trong hệ thống");
      return res.status(404).json({ msg: "Email không tồn tại trong hệ thống!" });
    }

    if (user.email_verified_at !== null) {
      console.log("Thông báo: Tài khoản đã được kích hoạt trước đó");
      return res.status(200).json({ msg: "Tài khoản đã được kích hoạt trước đó!" });
    }

    // Cập nhật trạng thái kích hoạt (đặt email_verified_at là thời điểm hiện tại)
    try {
      await UserModel.update(
        { email_verified_at: Sequelize.fn('NOW') },
        { where: { email: decoded.email } }
      );
      console.log("Cập nhật trạng thái kích hoạt thành công");
    } catch (err) {
      console.log("Lỗi khi cập nhật cơ sở dữ liệu:", err);
      return res
        .status(500)
        .json({ msg: "Lỗi khi cập nhật cơ sở dữ liệu", error: err.message });
    }

    // Tạo HTML phản hồi kích hoạt thành công
    const successHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kích hoạt tài khoản thành công</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .success-container {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 30px;
          margin-top: 50px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #28a745;
        }
        .button {
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          margin-top: 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="success-container">
        <h1>Kích hoạt tài khoản thành công!</h1>
        <p>Chào ${user.ho_ten},</p>
        <p>Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và sử dụng các dịch vụ của chúng tôi.</p>
        <a href="http://localhost:3008/auth/login" class="button">Đăng nhập ngay</a>
      </div>
    </body>
    </html>
    `;

    // Trả về HTML thành công
    console.log("Kích hoạt thành công");
    res.status(200).send(successHtml);
  } catch (err) {
    console.error("Lỗi xác thực:", err);
    return res
      .status(401)
      .json({ msg: "Token hết hạn hoặc không hợp lệ!", error: err.message });
  }
});





app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });
