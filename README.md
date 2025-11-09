# 🌐 Dự án Quản Lý Trung Tâm Công Nghệ

## 📖 Giới thiệu

Dự án xây dựng hệ thống quản lý cho **Trung tâm Công nghệ**, bao gồm:
- **Quản lý sản phẩm phần mềm**  
- **Quản lý yêu cầu khách hàng**  
- **Quản lý tools** 
- **Quản lý sự kiện chuyên đề (seminar)**  

Hệ thống được chia thành 3 phần:
1. **Server (Express + MongoDB):** Xử lý API, xác thực, upload, gửi mail, tài liệu Swagger.
2. **Client-Admin (React + MUI):** Giao diện dành cho quản trị viên.
3. **Client-User (React + MUI):** Giao diện dành cho người dùng cuối.

---

## 📁 Cấu trúc dự án

```
📦 project-root
 ┣ 📂 server
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers
 ┃ ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📂 models
 ┃ ┃ ┗ 📜 server.js
 ┃ ┣ 📜 .env.example
 ┃ ┗ 📜 package.json
 ┣ 📂 client-admin
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┗ 📜 main.jsx
 ┃ ┗ 📜 package.json
 ┣ 📂 client-user
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┗ 📜 main.jsx
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

---

## ⚙️ Công nghệ sử dụng

### 🖥 Server
| Gói | Mô tả |
|-----|--------|
| **express@5.1.0** | Framework chính để xây dựng API |
| **mongoose@8.18.1** | Kết nối và làm việc với MongoDB |
| **dotenv@16.6.1** | Quản lý biến môi trường |
| **cors@2.8.5** | Cho phép truy cập API từ frontend |
| **jsonwebtoken@9.0.2** | Xác thực người dùng bằng JWT |
| **bcrypt / bcryptjs** | Mã hóa mật khẩu người dùng |
| **multer / cloudinary / multer-storage-cloudinary** | Upload hình ảnh |
| **nodemailer@7.0.6** | Gửi email tự động |
| **slugify@1.6.6** | Tạo slug thân thiện với URL |
| **swagger-jsdoc + swagger-ui-express** | Tự động sinh tài liệu API |
| **mammoth@1.11.0** | Chuyển đổi file Word sang HTML |
| **cheerio@1.1.2** | Xử lý HTML, scraping dữ liệu |
| **streamifier@0.1.1** | Xử lý luồng dữ liệu upload |
| **nodemon@3.1.10** | Tự động reload khi dev |

---

### 🧑‍💼 Client-Admin
| Gói | Mô tả |
|------|-------|
| **React 19 + Vite** | Frontend framework và công cụ build |
| **@mui/material + @mui/icons-material** | Thư viện giao diện Material UI |
| **Ant Design (antd@5.26.7)** | Giao diện bảng biểu, form, button... |
| **Axios** | Gọi API |
| **TinyMCE / Quill** | Trình soạn thảo nội dung (editor) |
| **Moment.js** | Xử lý thời gian |
| **Recharts** | Hiển thị biểu đồ thống kê |
| **Leaflet + React Leaflet** | Bản đồ hiển thị vị trí |
| **Docx-preview + Mammoth** | Xem trước và xử lý file Word |
| **Zustand** | Quản lý trạng thái ứng dụng |
| **Tailwind + Emotion** | CSS linh hoạt và tối ưu |

---

### 👩‍💻 Client-User
| Gói | Mô tả |
|------|-------|
| **React 19 + Vite** | Frontend framework và công cụ build |
| **TailwindCSS + AnimateCSS + tw-animate-css** | Giao diện và hiệu ứng động |
| **Zustand** | Quản lý state |
| **Axios** | Gọi API |
| **React Router DOM 7** | Điều hướng trang |
| **React Toastify** | Hiển thị thông báo |
| **Lucide React / React Icons** | Biểu tượng UI |
| **GSAP / Three.js / OGL / tsparticles** | Hiệu ứng và hoạt hình 3D |
| **Class-variance-authority / clsx / tailwind-merge** | Xử lý class tiện lợi |

---

## 🧠 Scripts khả dụng

### 🖥 Server
| Lệnh | Chức năng |
|------|------------|
| `npm start` | Chạy server (production) |
| `npm run dev` | Chạy server bằng Nodemon (development) |

### 🧑‍💼 Client-Admin & Client-User
| Lệnh | Chức năng |
|------|------------|
| `npm run dev` | Chạy ở môi trường phát triển |
| `npm run build` | Build sản phẩm cho deploy |
| `npm run preview` | Xem trước bản build |
| `npm run lint` | Kiểm tra lỗi ESLint |

---

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Clone dự án
```bash
git clone https://github.com/NPKhang8148/Thuc_Tap_Thuc_Te_CUSC-RD.git
cd Thuc_Tap_Thuc_Te_CUSC-RD
```

### 2️⃣ Cài đặt dependencies cho từng phần
```bash
cd server
npm i

cd ../client-admin
npm i

cd ../client-user
npm i
```

---

## 🔧 Cấu hình môi trường

Sửa file `.env` trong thư mục **server**:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<your-mongo-uri>
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

## ▶️ Chạy dự án

### Chạy Server
```bash
cd server
npm start
```

### Chạy Client-Admin
```bash
cd client-admin
npm run dev
```

### Chạy Client-User
```bash
cd client-user
npm run dev
```

Server mặc định chạy tại:  
👉 http://localhost:5000  
Client-Admin: 👉 http://localhost:5174  
Client-User: 👉 http://localhost:5173 (hoặc port khác do Vite cấp)

---

## 📊 API Documentation

Dự án có tích hợp **Swagger** để mô tả API:  
📄 Truy cập tại:
```
http://localhost:5000/api-docs
```

---

## 🧩 Triển khai (Deployment)

- **Server:** có thể deploy lên [Render](https://render.com) hoặc [Railway](https://railway.app)  
- **Client (Admin & User):** có thể deploy lên [Vercel](https://vercel.com)

---

## 👨‍💻 Tác giả

**Nguyễn Phúc Khang**  
📅 Năm thực hiện: **2025**

---

