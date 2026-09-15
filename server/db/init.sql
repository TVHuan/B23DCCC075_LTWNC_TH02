-- Student Deadline Tracker PostgreSQL Schema & Seed Data

CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(64) PRIMARY KEY,
    subject VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_completed ON assignments(completed);
CREATE INDEX IF NOT EXISTS idx_assignments_priority ON assignments(priority);

-- Clean table before seeding (idempotent init)
DELETE FROM assignments;

-- Seed 10 realistic assignments covering all deadline requirements:
-- Today: 2026-09-15
INSERT INTO assignments (id, subject, title, due_date, priority, completed) VALUES
    ('asg-01', 'Trí tuệ nhân tạo', 'Báo cáo Prompt Engineering & LLM Evaluation', '2026-09-15T23:59:59Z', 'high', false),
    ('asg-02', 'Lập trình Web Nâng Cao', 'Xây dựng giao diện React + Redux Deadline Tracker', '2026-09-18T23:59:59Z', 'high', false),
    ('asg-03', 'Cơ sở dữ liệu', 'Thiết kế ERD và tối ưu hóa truy vấn PostgreSQL', '2026-09-20T23:59:59Z', 'medium', false),
    ('asg-04', 'An toàn thông tin', 'Bài tập thực hành mã hóa RSA và chữ ký điện tử', '2026-09-16T23:59:59Z', 'high', false),
    ('asg-05', 'Phát triển ứng dụng di động', 'Giao diện ứng dụng đặt món React Native', '2026-09-25T23:59:59Z', 'low', false),
    ('asg-06', 'Mạng máy tính', 'Cấu hình định tuyến OSPF và VLAN trên Cisco Packet Tracer', '2026-09-14T23:59:59Z', 'high', false),
    ('asg-07', 'Kiến trúc phần mềm', 'Phân tích thiết kế hệ thống Microservices', '2026-09-12T23:59:59Z', 'medium', false),
    ('asg-08', 'Điện toán đám mây', 'Triển khai Kubernetes cluster trên AWS EKS', '2026-09-28T23:59:59Z', 'low', false),
    ('asg-09', 'Nhập môn Lập trình Web', 'Xây dựng trang cá nhân HTML5/CSS3 chuẩn SEO', '2026-09-10T23:59:59Z', 'medium', true),
    ('asg-10', 'Cấu trúc dữ liệu & Giải thuật', 'Cài đặt cây AVL và giải thuật Dijkstra', '2026-09-08T23:59:59Z', 'high', true);
