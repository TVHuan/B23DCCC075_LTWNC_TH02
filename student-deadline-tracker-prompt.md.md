Student Deadline Tracker — UI/UX & Implementation Prompt
1. Vai trò

Bạn là một Senior Frontend Developer + UI/UX Engineer.

Hãy trực tiếp kiểm tra project hiện tại và implement hoàn chỉnh ứng dụng Student Deadline Tracker, không chỉ phân tích hay đưa ra hướng dẫn.

Mục tiêu:

Xây dựng một ứng dụng quản lý deadline bài tập cá nhân cho sinh viên với UI hiện đại, chuyên nghiệp, dễ sử dụng và có đầy đủ tương tác.

2. Bối cảnh sản phẩm
Tên ứng dụng

Student Deadline Tracker

Bài toán

Sinh viên thường phải quản lý rất nhiều bài tập đến từ nhiều môn học khác nhau.

Việc ghi nhớ:

Bài tập nào cần làm
Deadline khi nào
Bài nào đã hoàn thành
Bài nào đang quá hạn
Bài nào có mức độ ưu tiên cao

rất dễ dẫn đến quên deadline hoặc nộp bài muộn.

Mục tiêu

Xây dựng một ứng dụng giúp sinh viên:

Theo dõi toàn bộ deadline
Nhìn nhanh các deadline sắp tới
Nhận biết deadline quá hạn
Đánh dấu bài tập đã hoàn thành
Lọc bài tập theo trạng thái
Thêm / sửa / xóa bài tập
Có feedback trực quan khi thao tác thành công
3. Công nghệ bắt buộc

Ưu tiên sử dụng stack hiện có của project.

Nếu project đã sử dụng:

React
TypeScript
Tailwind CSS
shadcn/ui
Redux Toolkit

thì tiếp tục sử dụng.

UI Library

Bắt buộc sử dụng shadcn/ui.

Ưu tiên các component:

Button
Card
Badge
Checkbox
Dialog
AlertDialog
DropdownMenu
Input
Label
Select
Tabs
Popover
Calendar
Form
Separator
Avatar
Tooltip
Toast / Sonner
Skeleton

Không sử dụng thêm:

Ant Design
Material UI
Bootstrap
Chakra UI

trừ khi project hiện tại đã phụ thuộc bắt buộc vào chúng.

4. Nguyên tắc quan trọng
KHÔNG chỉ phân tích

Không được dừng lại ở:

Phân tích project
Đưa ra proposal
Viết pseudo-code
Mô tả cách làm

Hãy:

Kiểm tra project
Xác định architecture hiện tại
Tạo / chỉnh sửa các file cần thiết
Implement UI
Implement logic
Implement state management
Test
Fix lỗi
Kiểm tra responsive
Hoàn thiện UI/UX

Cuối cùng mới báo cáo những gì đã thực hiện.

5. Phong cách UI/UX

Thiết kế theo phong cách:

Modern Student Productivity SaaS

Cảm giác tổng thể:

Modern
Clean
Professional
Friendly
Minimal
Dễ sử dụng
Không quá nhiều màu
Không quá nhiều animation
Không sử dụng
Neon
Gradient quá mạnh
Glassmorphism quá mức
Shadow quá đậm
UI nhiều màu
Emoji quá nhiều
Animation gây rối
Card quá bo tròn
Layout giống dashboard quản trị doanh nghiệp
6. Color Palette

Sử dụng palette hài hòa.

Primary
Primary: #4F46E5
Primary Hover: #4338CA
Background
Page Background: #F8FAFC
Card Background: #FFFFFF
Text
Heading: #0F172A
Body: #475569
Muted: #64748B
Status
Pending
Blue
Warning
Amber
Overdue
Red
Completed
Green

Màu status phải được sử dụng nhất quán.

7. Typography

Ưu tiên font:

Inter
Kích thước
Page title
28px
font-weight: 600
Section title
20px
font-weight: 600
Assignment title
16px
font-weight: 500
Body
14px
Metadata
13px
8. Layout tổng thể

Desktop layout:

┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                         │
│         ├────────────────────────────────────────────────┤
│         │                                                │
│         │ Dashboard                                      │
│         │                                                │
│         │ Summary Cards                                  │
│         │                                                │
│         │ Alert                                          │
│         │                                                │
│         │ Deadline List                                  │
│         │                                                │
│         │ Assignment Cards                               │
│         │                                                │
└──────────────────────────────────────────────────────────┘
9. Sidebar

Desktop sidebar khoảng:

220px - 240px

Sidebar gồm:

Logo
Student Deadline Tracker

Overview
My Deadlines
Add Assignment
Settings

Sử dụng icon từ:

lucide-react

Ví dụ:

LayoutDashboard
CalendarDays
Plus
Settings
CheckCircle
Clock
AlertCircle

Menu đang active phải có trạng thái rõ ràng.

Ví dụ:

┌──────────────────────────┐
│ ▣ Overview               │
│   My Deadlines           │
│   Add Assignment         │
│   Settings               │
└──────────────────────────┘
10. Header

Header gồm:

Bên trái

Page title hoặc breadcrumb.

Bên phải
Notification Bell
Avatar
User menu

Notification Bell phải có indicator nếu có deadline quan trọng.

Ví dụ:

Dashboard                         🔔   👤
11. Dashboard
Header

Hiển thị:

Good morning! 👋

Stay on top of your assignments and never miss a deadline.

Không cần emoji nếu không phù hợp với design hiện tại.

12. Summary Cards

Hiển thị 4 card:

Total Assignments
Pending
Overdue
Completed

Ví dụ:

┌──────────────────┐
│ Total            │
│                  │
│ 12               │
│ assignments      │
└──────────────────┘

┌──────────────────┐
│ Pending          │
│                  │
│ 5                │
│ assignments      │
└──────────────────┘

┌──────────────────┐
│ Overdue          │
│                  │
│ 2                │
│ assignments      │
└──────────────────┘

┌──────────────────┐
│ Completed        │
│                  │
│ 5                │
│ assignments      │
└──────────────────┘

Số liệu phải được tính từ state thực tế.

Không hard-code.

13. Deadline Section

Section chính:

Upcoming Deadlines

Bên phải:

+ Add Assignment

Hoặc tiếng Việt:

Deadline sắp tới                  + Thêm bài tập
14. Filter Tabs

Bắt buộc có:

Tất cả
Chưa hoàn thành
Quá hạn
Đã hoàn thành

Ví dụ:

┌────────┬──────────────────┬──────────┬──────────────┐
│ Tất cả │ Chưa hoàn thành  │ Quá hạn  │ Đã hoàn thành│
└────────┴──────────────────┴──────────┴──────────────┘

Có thể hiển thị count:

Tất cả (12)
Chưa hoàn thành (5)
Quá hạn (2)
Đã hoàn thành (5)

Count phải được tính động.

15. Urgent Deadline Alert

Nếu có deadline gần:

⚠ You have 2 assignments due soon.

Thiết kế nhẹ nhàng bằng Alert/Callout.

Nếu không có deadline gấp:

✓ Bạn đang theo kịp tất cả deadline.

Không sử dụng màu đỏ nếu không thực sự cần cảnh báo.

16. Assignment Card

Không sử dụng table cứng nhắc.

Ưu tiên dạng Card/List hiện đại.

Ví dụ:

┌────────────────────────────────────────────────────────┐
│                                                        │
│ ○  Lập trình Web                         High           │
│    Xây dựng giao diện React                            │
│                                                        │
│    📅 18/09/2026       Còn 3 ngày                     │
│                                                        │
│                                      ⋮                 │
└────────────────────────────────────────────────────────┘

Card phải chứa:

Checkbox
Subject
Assignment title
Due date
Countdown
Priority
Action menu
17. Assignment Status

Mỗi assignment có:

completed: boolean

Không cần lưu overdue như state độc lập nếu có thể tính từ dueDate.

18. Deadline Logic

Tạo utility function:

getDeadlineStatus(dueDate, completed)

Return:

{
  type,
  label,
  days
}
Quy tắc
Deadline tương lai
Còn X ngày

Ví dụ:

Còn 5 ngày
Deadline trong 3 ngày

Hiển thị warning.

Còn 3 ngày
Deadline ngày mai
Còn 1 ngày
Deadline hôm nay
Hạn hôm nay
Deadline quá hạn
Quá hạn 1 ngày

hoặc:

Quá hạn 3 ngày
Assignment đã hoàn thành

Nếu assignment completed:

Không hiển thị overdue màu đỏ
Hiển thị Completed
Có thể hiển thị:
Đã hoàn thành
19. Priority

Ba mức:

type Priority = "low" | "medium" | "high";

UI:

Low
Medium
High

Có Badge.

Low

Neutral/subtle.

Medium

Warning nhẹ.

High

Danger nhẹ.

Không dùng màu quá chói.

20. Complete / Uncomplete

Khi user click checkbox:

Assignment chuyển trạng thái.

Khi hoàn thành

Animation:

checkbox scale
→ title strike-through
→ card transition
→ status badge Completed

Ví dụ:

~~Lập trình Web~~

✓ Completed

Animation phải nhẹ.

21. Completion Toast

Sau khi hoàn thành:

Assignment completed
Bạn đã hoàn thành "Lập trình Web".

Có thể dùng:

Sonner

Không cần emoji nếu không phù hợp.

22. Undo

Nếu phù hợp, toast hoàn thành có thể hỗ trợ:

Assignment completed
[Undo]

Nếu implement được thì ưu tiên.

23. Action Menu

Mỗi assignment có:

⋮

Dropdown:

Mark as complete
Edit
Delete

Nếu completed:

Mark as incomplete
Edit
Delete
24. Add Assignment

Click:

+ Thêm bài tập

Mở Dialog.

Form:

Subject
Assignment name
Due date
Priority
25. Add Assignment Form
Subject

Input hoặc Select.

Ví dụ:

Lập trình Web
Cơ sở dữ liệu
Trí tuệ nhân tạo
Phát triển ứng dụng di động
Assignment name

Ví dụ:

Xây dựng Dashboard React
Due date

Sử dụng:

Calendar
Popover
Date Picker
Priority

Select:

Low
Medium
High
26. Form Validation

Required:

Subject
Assignment name
Due date
Priority

Nếu thiếu:

Vui lòng nhập môn học
Vui lòng nhập tên bài tập

Không cho submit nếu invalid.

Nút submit:

Thêm bài tập

Khi loading:

Đang thêm...

Disable button trong lúc submit.

27. Add Success

Sau khi thêm:

Đóng modal.

Hiển thị toast:

Đã thêm bài tập thành công.

Assignment mới xuất hiện ngay trong danh sách.

28. Delete Assignment

Khi chọn Delete:

Mở:

AlertDialog

Nội dung:

Xóa bài tập?

Bạn có chắc chắn muốn xóa bài tập
"Xây dựng Dashboard React"?

Hành động này không thể hoàn tác.

Buttons:

Hủy
Xóa

Sau khi xóa:

Đã xóa bài tập.
29. Edit Assignment

Nếu có thể, implement Edit.

Form giống Add Assignment.

Khi update:

Đã cập nhật bài tập.
30. Empty State

Nếu không có assignment:

No assignments yet

Bạn chưa có bài tập nào.

+ Thêm bài tập

Nếu filter không có kết quả:

Không có bài tập phù hợp.

Hãy thử thay đổi bộ lọc.

Không để màn hình trống.

31. Responsive Design
Desktop

Sidebar cố định.

Assignment list full width.

Summary cards 4 columns.

Tablet

Summary:

2 columns

Sidebar có thể thu gọn.

Mobile

Sidebar chuyển thành:

Sheet / Drawer

Summary:

2 columns

Assignment Card:

full width

Action menu phải dễ bấm.

Có thể có Floating Action Button:

+

để thêm assignment.

32. Mobile Layout

Ví dụ:

┌───────────────────────────┐
│ ☰   Deadline Tracker  🔔 │
├───────────────────────────┤
│                           │
│ Good morning!             │
│                           │
│ ┌─────────┐ ┌─────────┐   │
│ │ Total   │ │ Pending │   │
│ │ 12      │ │ 5       │   │
│ └─────────┘ └─────────┘   │
│                           │
│ Upcoming Deadlines        │
│                           │
│ ┌───────────────────────┐ │
│ │ ○ React Assignment    │ │
│ │   Còn 2 ngày          │ │
│ └───────────────────────┘ │
│                           │
│                     [+]   │
└───────────────────────────┘
33. TypeScript Types

Tạo type rõ ràng.

export type Priority = "low" | "medium" | "high";

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

Không sử dụng:

any

trừ trường hợp thực sự cần thiết.

34. Redux Toolkit

Sử dụng feature-based structure.

Ví dụ:

src/
├── features/
│   └── assignments/
│       ├── assignmentsSlice.ts
│       ├── assignmentsSelectors.ts
│       ├── assignmentsThunks.ts
│       └── types.ts
│
├── components/
│   ├── assignment/
│   │   ├── AssignmentCard.tsx
│   │   ├── AssignmentList.tsx
│   │   ├── AssignmentForm.tsx
│   │   └── DeleteAssignmentDialog.tsx
│   │
│   ├── dashboard/
│   │   ├── SummaryCards.tsx
│   │   ├── DeadlineAlert.tsx
│   │   └── DeadlineFilters.tsx
│   │
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── DashboardLayout.tsx
│
├── hooks/
│   └── useAssignments.ts
│
├── lib/
│   ├── deadline.ts
│   └── utils.ts
│
└── pages/
    └── Dashboard.tsx

Điều chỉnh structure theo project hiện tại nếu cần.

Không phá vỡ architecture đang có.

35. Redux State

State tối thiểu:

interface AssignmentState {
  items: Assignment[];
  loading: boolean;
  error: string | null;
  filter: AssignmentFilter;
}

Filter:

type AssignmentFilter =
  | "all"
  | "pending"
  | "overdue"
  | "completed";
36. Redux Actions

Cần có:

addAssignment
updateAssignment
toggleAssignment
deleteAssignment
setFilter

Nếu project có backend:

Sử dụng:

createAsyncThunk

cho:

fetchAssignments
createAssignment
updateAssignment
deleteAssignment

Nếu chưa có backend:

Có thể tạo mock async service để vẫn thể hiện đúng architecture.

37. Custom Hook

Tạo:

useAssignments()

Hook có thể cung cấp:

{
  assignments,
  filteredAssignments,
  totalCount,
  pendingCount,
  overdueCount,
  completedCount,
  filter,
  setFilter,
  addAssignment,
  updateAssignment,
  toggleAssignment,
  deleteAssignment
}

Không lặp lại business logic ở nhiều component.

38. Utility Deadline

Tạo:

getDeadlineStatus(
  dueDate: string,
  completed: boolean
)

Ví dụ:

const result = getDeadlineStatus(
  assignment.dueDate,
  assignment.completed
);

Không hard-code:

Còn 3 ngày
Còn 2 ngày
...

Countdown phải được tính từ ngày hiện tại.

39. Mock Data

Nếu chưa có backend, tạo khoảng:

8–12 assignments

Phải bao phủ:

Deadline trong tương lai
Deadline hôm nay
Deadline ngày mai
Deadline 3 ngày
Deadline quá hạn
Completed
High priority
Medium priority
Low priority

Ví dụ:

React
Xây dựng Dashboard
18/09/2026
High

Database
Thiết kế ERD
20/09/2026
Medium

AI
Prompt Engineering
15/09/2026
High

Mobile
React Native Assignment
25/09/2026
Low
40. Persistence

Nếu backend chưa có:

Ưu tiên lưu dữ liệu vào:

localStorage

để reload trang không mất assignment.

Có thể tạo:

assignmentStorage.ts

hoặc service tương tự.

41. Animation

Chỉ sử dụng animation nhẹ.

Các trường hợp nên có animation:

Complete
checkbox scale
title strike-through
opacity transition
Delete
fade-out
Dialog

Sử dụng animation mặc định của shadcn/ui.

Toast

Sử dụng animation mặc định.

Không tạo animation phức tạp.

42. Accessibility

Đảm bảo:

Button có accessible name
Icon button có Tooltip
Checkbox có label
Form field có Label
Dialog có title
AlertDialog có description
Keyboard navigation hoạt động
Focus state rõ ràng
Color không phải cách duy nhất để biểu thị status
43. Loading State

Nếu có async action:

Hiển thị:

Skeleton

hoặc loading indicator.

Không để UI đứng im mà không feedback.

44. Error State

Nếu API/service lỗi:

Hiển thị:

Không thể tải danh sách bài tập.

Thử lại

Có Retry button nếu phù hợp.

45. Notification

Notification popover có thể hiển thị:

Deadline sắp tới

AI - Prompt Engineering
Còn 1 ngày

React - Dashboard
Còn 2 ngày

Nếu không có notification:

Không có thông báo mới.
46. Dashboard Behavior

Khi user:

Add

Assignment xuất hiện ngay.

Complete

Summary cards tự cập nhật.

Delete

Summary cards tự cập nhật.

Filter

Danh sách thay đổi.

Edit

Assignment cập nhật ngay.

Reload

Data vẫn tồn tại nếu sử dụng localStorage.

47. Important UX Detail

Khi assignment completed:

Card nên thay đổi trực quan.

Ví dụ:

Before

○ Xây dựng Dashboard React
  Còn 2 ngày
  High

Sau khi click:

✓ Xây dựng Dashboard React
  Đã hoàn thành

Title:

text-decoration: line-through

Nhưng vẫn giữ khả năng:

Mark as incomplete
48. Visual Hierarchy

Ưu tiên thông tin theo thứ tự:

1. Assignment title
2. Deadline / countdown
3. Subject
4. Priority
5. Actions

Không để priority nổi bật hơn deadline.

Deadline là thông tin quan trọng nhất.

49. Không lạm dụng Card

Summary cards:

Card

Assignment:

Card hoặc list item

Không tạo card lồng card.

Không tạo quá nhiều border/shadow.

50. Code Quality

Phải đảm bảo:

TypeScript strict
Không duplicate logic
Component nhỏ
Business logic tách khỏi UI
Không giant component
Không hard-code dữ liệu trong component
Không hard-code countdown
Không dùng any
Không duplicate className không cần thiết
Reuse component khi hợp lý
51. Project Inspection

Trước khi code, hãy kiểm tra:

package.json
tsconfig.json
vite.config.*
tailwind.config.*
components.json
src/

Xác định:

React version
TypeScript version
Tailwind version
shadcn/ui đã setup chưa
Redux Toolkit đã cài chưa
React Router đã có chưa
Existing architecture
Existing components

Không tự ý thay đổi dependency nếu không cần.

52. Nếu shadcn/ui chưa được setup

Nếu project chưa có shadcn/ui:

Thiết lập đúng theo architecture hiện tại.

Sau đó sử dụng các component cần thiết.

Không tự viết lại toàn bộ component shadcn nếu không cần.

53. Nếu Redux Toolkit chưa có

Nếu yêu cầu project cần Redux Toolkit:

Cài đặt và setup:

@reduxjs/toolkit
react-redux

Tạo:

store
slice
typed hooks

Ví dụ:

useAppDispatch()
useAppSelector()
54. React Design Pattern

Project cần thể hiện React design patterns.

Ưu tiên:

Custom Hook
useAssignments()

để encapsulate business logic.

Compound Component

Có thể sử dụng nếu thực sự phù hợp.

Ví dụ:

<AssignmentCard>
  <AssignmentCard.Header />
  <AssignmentCard.Content />
  <AssignmentCard.Footer />
</AssignmentCard>

Không ép buộc pattern nếu khiến code phức tạp không cần thiết.

55. Performance

Tránh:

Render lại không cần thiết
Tính countdown ở quá nhiều component
Duplicate selectors
Duplicate filtering logic

Redux selectors nên được tách riêng khi hợp lý.

56. Testing

Sau khi implement phải test các flow:

Test 1 — Add
Open Add Assignment
→ Fill form
→ Submit
→ Assignment xuất hiện
→ Toast xuất hiện
Test 2 — Validation
Open form
→ Submit empty
→ Validation errors xuất hiện
Test 3 — Complete
Click checkbox
→ Assignment completed
→ Summary update
→ Toast
Test 4 — Uncomplete
Completed
→ Mark incomplete
→ Assignment trở lại pending
Test 5 — Filter

Test:

All
Pending
Overdue
Completed
Test 6 — Delete
Delete
→ Confirmation
→ Confirm
→ Assignment biến mất
Test 7 — Edit
Edit
→ Change data
→ Save
→ UI cập nhật
Test 8 — Persistence
Add
→ Reload page
→ Assignment vẫn tồn tại
57. Build & Type Check

Sau khi hoàn thành chạy:

npm run lint
npm run build
npx tsc --noEmit

Nếu project có test:

npm test

Hoặc command tương ứng trong package.json.

Nếu có lỗi:

Không chỉ báo lỗi. Hãy tự sửa lỗi và chạy lại.

58. Final UI Review

Sau khi code xong hãy tự kiểm tra:

Desktop
Sidebar
Header
Summary cards
Deadline alert
Filters
Assignment list
Add modal
Tablet
Layout
Card width
Summary cards
Mobile
Sidebar drawer
Header
Cards
Form
Action menu
Floating button
59. Final Quality Checklist

Trước khi hoàn thành phải đảm bảo:

UI hiện đại

shadcn/ui được sử dụng

Responsive

TypeScript đúng

Redux Toolkit hoạt động

Custom hook hoạt động

Add assignment

Edit assignment

Delete assignment

Complete / Uncomplete

Filter

Countdown deadline

Overdue detection

Priority badge

Toast notification

Empty state

Loading state

Error state

localStorage nếu chưa có backend

Accessibility

Lint pass

Type check pass

Build pass

60. Quan trọng nhất

Không dừng ở việc phân tích.

Hãy trực tiếp:

INSPECT
↓
PLAN
↓
IMPLEMENT
↓
RUN
↓
TEST
↓
FIX
↓
POLISH
↓
FINAL REVIEW

Nếu gặp vấn đề trong quá trình implement:

Tìm nguyên nhân
Sửa code
Chạy lại
Kiểm tra regression

Không được bỏ qua lỗi chỉ vì lỗi không liên quan trực tiếp tới UI.

61. Expected Result

Kết quả cuối cùng phải là một ứng dụng:

Student Deadline Tracker hoàn chỉnh, có thể sử dụng thực tế, UI đẹp bằng shadcn/ui, responsive, có Redux Toolkit + TypeScript, có đầy đủ CRUD, filter, deadline calculation, toast notification và completion animation.

Không trả về mockup hoặc pseudo-code.

Hãy implement trực tiếp vào project hiện tại.