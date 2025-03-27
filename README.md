# React E-commerce Site - The Hey-D

## 📝 Giới thiệu
Ứng dụng thương mại điện tử được xây dựng với các công nghệ hiện đại như **Next.js**, **React**, **Redux**, **TailwindCSS** và **MySQL**.

## 🛠 Công nghệ sử dụng
- **Next.js** - Framework React cho SSR và tối ưu hiệu suất
- **React** - Thư viện UI hàng đầu
- **Redux** - Quản lý state toàn cục
- **TailwindCSS** - Framework CSS tiện lợi
- **MySQL** - Cơ sở dữ liệu quan hệ
- **Node.js & Express** - Backend API server

## ⚙️ Cài đặt và Chạy

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend 
```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

### Loại Sản Phẩm
- `GET /api/loai` - Lấy tất cả loại sản phẩm
- `GET /api/loai/:id` - Chi tiết loại sản phẩm

### Sản Phẩm
- `GET /api/sanpham` - Danh sách sản phẩm (có phân trang)
- `GET /api/sp/:id` - Chi tiết sản phẩm
- `GET /api/timkiem/:tu_khoa/:page?` - Tìm kiếm sản phẩm

### Đơn Hàng
- `POST /api/luudonhang` - Lưu đơn hàng
- `POST /api/luugiohang` - Lưu giỏ hàng

## 📁 Cấu trúc Project

### Backend
```
backend/
├── config/
│   └── database.js
├── models/
├── routes/
└── index.js
```

### Frontend
```
frontend/
├── pages/
├── components/
└── store/
```

## 👤 Liên hệ
- **Tác giả:** Tran Thanh Tu
- **GitHub:** [ThanhTu260104](https://github.com/ThanhTu260104)

## 🚀 Triển khai
- [Hướng dẫn triển khai trên Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Hướng dẫn triển khai trên Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)