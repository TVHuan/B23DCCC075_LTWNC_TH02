# Student Deadline Tracker — LTWNC Bài Thực Hành 01

Ứng dụng **Student Deadline Tracker** — Quản lý deadline bài tập cá nhân dành cho sinh viên, xây dựng theo chuẩn Kiến trúc Full-Stack hiện đại:
- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS, Lucide Icons, Sonner Toast.
- **Backend API**: Node.js, Express, TypeScript, RESTful API.
- **Database**: PostgreSQL 16 (chạy container Docker độc lập với volume persistence & seed data).
- **Containerization**: Docker & Docker Compose đa dịch vụ (PostgreSQL, Backend, Frontend).
- **UI/UX Design**: Modern Student Productivity SaaS theo đúng đặc tả giao diện trong [student-deadline-tracker-prompt.md.md](./student-deadline-tracker-prompt.md.md).

---

## 🎯 Đáp ứng đầy đủ mục tiêu & yêu cầu bài thực hành

### 1. TypeScript nâng cao
- **Generic types**: `ApiResponse<T>`, `FilterCriteria<T>`, `EntityMap<K, T>`.
- **Utility types**: `Pick<Assignment, ...>`, `Omit<Assignment, ...>`, `Partial<CreateAssignmentInput>`, `Record<Priority, PriorityMeta>`, `Readonly<Assignment>`.
- **Type guards**:
  - `isPriority(value)`: Kiểm tra giá trị hợp lệ của độ ưu tiên.
  - `isOverdue(assignment)`: Kiểm tra bài tập đã quá hạn hay chưa.
  - `isUrgent(assignment)`: Kiểm tra bài tập có cần nộp gấp (hôm nay hoặc ngày mai).
  - `isAssignment(obj)`: Kiểm tra cấu trúc đối tượng bài tập hợp lệ.

### 2. Design Pattern React
- **Custom Hook nâng cao**: `useAssignments()` đóng gói toàn bộ business logic, state selectors, CRUD dispatchers, bộ lọc trạng thái và toast hoàn tác (Undo).
- **Compound Component Pattern**: `<AssignmentCardCompound>` gồm các subcomponent lồng nhau:
  - `<AssignmentCardCompound.Root>`
  - `<AssignmentCardCompound.Checkbox>`
  - `<AssignmentCardCompound.Header>`
  - `<AssignmentCardCompound.Subject>`
  - `<AssignmentCardCompound.Title>`
  - `<AssignmentCardCompound.Countdown>`
- **Higher-Order Component (HOC) Pattern**: `withLoadingAndError()` tự động bọc component với skeleton loading animation và error boundary có nút "Thử lại".

### 3. Redux Toolkit + TypeScript
- **Feature-based structure**: `src/features/assignments/` tách bạch rõ ràng:
  - `types.ts`: Models, generics, type guards.
  - `assignmentsSlice.ts`: Reducers và extraReducers.
  - `assignmentsThunks.ts`: Async thunks (`fetchAssignmentsThunk`, `createAssignmentThunk`, `updateAssignmentThunk`, `toggleAssignmentThunk`, `deleteAssignmentThunk`, `resetSeedThunk`).
  - `assignmentsSelectors.ts`: Memoized selectors (`selectStats`, `selectFilteredAssignments`, `selectUrgentAssignments`).
- **Typed hooks**: `useAppDispatch`, `useAppSelector`.

### 4. Đầy đủ 6 yêu cầu chức năng bài thực hành
1. **Hiển thị danh sách bài tập**: Môn học (badge riêng), tên bài tập, hạn nộp (📅 dd/mm/yyyy), độ ưu tiên (Low, Medium, High với màu chuẩn), trạng thái hoàn thành (checkbox có check animation, strike-through text).
2. **Thêm bài tập mới qua form**: Dialog thêm bài tập với danh sách gợi ý môn học, input tên bài tập, chọn ngày hết hạn, chọn độ ưu tiên và form validation bắt lỗi chi tiết.
3. **Đánh dấu hoàn thành / bỏ đánh dấu**: Nhấp trực tiếp vào checkbox hoặc qua menu ba chấm ⋮. Khi hoàn thành hiển thị toast thông báo kèm nút **Hoàn tác (Undo)**.
4. **Xóa bài tập**: Mở AlertDialog xác nhận xóa, ngăn chặn bấm nhầm, hỗ trợ nút **Khôi phục** ngay trên toast.
5. **Lọc theo trạng thái**: 4 Tab ("Tất cả", "Chưa hoàn thành", "Quá hạn", "Đã hoàn thành") hiển thị số đếm động chính xác theo thời gian thực (tính tự động từ state, không hard-code). Kèm thanh tìm kiếm theo từ khóa và lọc theo mức độ ưu tiên.
6. **Countdown deadline**: Utility `getDeadlineStatus` tính toán chuẩn xác số ngày:
   - "Còn X ngày" (ví dụ: Còn 3 ngày, Còn 5 ngày).
   - "Hạn hôm nay" (đối với bài hết hạn hôm nay).
   - "Còn 1 ngày (Ngày mai)" (đối với bài hết hạn ngày mai).
   - "Quá hạn Y ngày" (ví dụ: Quá hạn 1 ngày, Quá hạn 3 ngày với badge đỏ cảnh báo).
   - "Đã hoàn thành" (badge xanh emerald khi bài tập đã hoàn thành).

---

## 🚀 Hướng dẫn chạy ứng dụng

### Cách 1: Chạy toàn bộ hệ thống bằng Docker Compose (Khuyên dùng)

Yêu cầu máy đã cài đặt Docker Desktop.

1. Tại thư mục gốc `LT-Web-Nang-Cao-THUC-HANH`, mở terminal và chạy:
   ```bash
   docker compose up --build -d
   ```

2. Truy cập ứng dụng:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/api/assignments](http://localhost:5000/api/assignments)
   - **Database PostgreSQL**: `localhost:5432` (Username: `postgres`, Password: `postgres`, Database: `deadlines_db`)

3. Dừng ứng dụng:
   ```bash
   docker compose down
   ```

---

### Cách 2: Chạy độc lập trong môi trường phát triển (Local Dev)

#### 1. Khởi động PostgreSQL qua Docker (nếu chưa có sẵn PostgreSQL cục bộ):
```bash
docker run --name deadline_postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=deadlines_db -p 5432:5432 -d postgres:16-alpine
```

#### 2. Khởi động Backend (Server):
```bash
cd server
npm install
npm run dev
# Server lắng nghe tại http://localhost:5000
```

#### 3. Khởi động Frontend (Client):
```bash
cd client
npm install
npm run dev
# Frontend chạy tại http://localhost:5173
```

---

## 📁 Cấu trúc thư mục dự án

```
LT-Web-Nang-Cao-THUC-HANH/
├── docker-compose.yml             # Orchestration: PostgreSQL, Backend, Frontend
├── README.md                      # Tài liệu hướng dẫn chi tiết
├── student-deadline-tracker-prompt.md.md # File đặc tả yêu cầu chi tiết
│
├── server/                        # Backend Node.js + Express + TypeScript + PostgreSQL
│   ├── db/
│   │   └── init.sql               # Script tạo bảng và seed 10 bài tập mẫu ban đầu
│   ├── src/
│   │   ├── config/db.ts           # PostgreSQL Pool & auto-migration
│   │   ├── controllers/           # assignmentController.ts
│   │   ├── models/                # types.ts
│   │   ├── routes/                # assignmentRoutes.ts
│   │   ├── services/              # assignmentService.ts
│   │   └── index.ts               # Server entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
└── client/                        # Frontend React + TypeScript + Redux Toolkit + Tailwind
    ├── src/
    │   ├── features/assignments/  # Feature Redux Toolkit
    │   │   ├── types.ts           # Generic, Utility types, Type guards
    │   │   ├── assignmentsSlice.ts
    │   │   ├── assignmentsThunks.ts
    │   │   └── assignmentsSelectors.ts
    │   ├── store/                 # Redux Store & Typed hooks
    │   ├── hooks/
    │   │   └── useAssignments.ts  # Custom Hook nâng cao đóng gói logic & toast
    │   ├── patterns/
    │   │   ├── AssignmentCardCompound.tsx # Compound Component Pattern
    │   │   └── withLoadingAndError.tsx    # Higher-Order Component (HOC) Pattern
    │   ├── components/
    │   │   ├── layout/            # Sidebar, Header, DashboardLayout
    │   │   ├── dashboard/         # SummaryCards, UrgentDeadlineAlert, DeadlineFilters
    │   │   └── assignment/        # AssignmentList, AssignmentCard, FormDialog, DeleteDialog
    │   ├── lib/
    │   │   ├── deadline.ts        # getDeadlineStatus tính toán thời gian
    │   │   └── utils.ts
    │   ├── services/              # api.ts (giao tiếp API và fallback localStorage)
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    ├── nginx.conf
    └── Dockerfile
```
