const express = require("express");
const { Sequelize } = require("sequelize");

var app = express(); //tạo ứng dụng nodejs
const port = 3005;
app.use(express.json()); //cho phép đọc dữ liệu dạng json
const cors = require("cors");
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng
const {
  SanPhamModel,
  LoaiModel,
  TinTucModel,
  DonHangModel,
  DonHangChiTietModel,
} = require("./config/database"); //các model lấy database

//routes

// Lấy danh sách loại sản phẩm

app.get("/api/loai", async (req, res) => {
  const loai_arr = await LoaiModel.findAll({
    where: { an_hien: 1 },
    order: [["thu_tu", "ASC"]],
  });
  res.json(loai_arr);
});
app.get("/api/admin/loai", async (req, res) => {
  const { an_hien, tu_khoa, limit = 15, page = 1 } = req.query; // dữ liệu đầu vào từ query
  //an hien lọc trạng thái hiển thị
  //tu khoa để tìm kiếm theo loại
  // limit page  dùng để phân trang
  const whereClause = {};

  // lọc bằng
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
    const { count, rows } = await LoaiModel.findAndCountAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("san_phams.id")), "so_san_pham"],
        ],
      },
      include: [
        {
          model: SanPhamModel,
          attributes: [],
          as: "san_phams",
        },
      ],
      where: whereClause,
      group: ["loai.id"],
      order: [["thu_tu", "ASC"]],
      limit: parsedLimit,
      offset: offset,
      distinct: true,
      subQuery: false, // ✅ thêm dòng này
    });

    res.json({ total: count.length, data: rows }); // Nếu group thì count là array
  } catch (err) {
    console.error("Lỗi lấy danh sách loại:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy danh sách loại." });
  }
});

app.get("/api/admin/loai/:id", async (req, res) => {
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
// Thêm loại sản phẩm
// app.post("/api/loai", (req, res) => {
//   const { ten_loai, thu_tu, an_hien } = req.body;

//   if (!ten_loai || thu_tu == undefined || an_hien == undefined) {
//     return res.status(400).json({ thong_bao: "Thiếu dữ liệu đầu vào!" });
//   }

//   // Tự động tạo slug từ ten_loai
//   const slug = ten_loai
//     .toLowerCase()
//     .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // xóa dấu tiếng Việt
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");

//   const sql = `INSERT INTO loai (ten_loai, slug, thu_tu, an_hien) VALUES (?, ?, ?, ?)`;
//   db.query(sql, [ten_loai, slug, thu_tu, an_hien], (err, data) => {
//     if (err) {
//       console.error("Lỗi khi thêm loại:", err);
//       return res.status(500).json({ thong_bao: "Lỗi server khi thêm loại." });
//     }

//     return res.json({ thong_bao: "Đã thêm loại", id: data.insertId });
//   });
// });

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

// lấy danh sách sản phẩm theo loại

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

// lấy danh sách sản phẩm hot
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

const { Op } = require("sequelize");
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
app.get("/api/admin/loai/timkiem", async (req, res) => {
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
// app.get("/api/timkiem", async (req, res) => {
//   try {
//     const tu_khoa = req.query.tu_khoa || "";
//     const page = Number(req.query.page) || 1;
//     const sosp = Number(req.query.sosp) || 12;

//     const sp_arr = await SanPhamModel.findAll({
//       where: {
//         ten_sp: { [Op.substring]: `%${tu_khoa}%` },
//         an_hien: 1,
//       },
//       order: [
//         ["ngay", "DESC"],
//         ["gia", "ASC"],
//       ],
//       offset: (page - 1) * sosp,
//       limit: sosp,
//     });

//     res.json(sp_arr);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// });

// Lưu đơnn hàng
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

app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });
