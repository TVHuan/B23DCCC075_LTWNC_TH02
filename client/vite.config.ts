import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-01',
    subject: 'Trí tuệ nhân tạo',
    title: 'Báo cáo Prompt Engineering & LLM Evaluation',
    dueDate: '2026-09-15T23:59:59Z',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-02',
    subject: 'Lập trình Web Nâng Cao',
    title: 'Xây dựng giao diện React + Redux Deadline Tracker',
    dueDate: '2026-09-18T23:59:59Z',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-03',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế ERD và tối ưu hóa truy vấn PostgreSQL',
    dueDate: '2026-09-20T23:59:59Z',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'asg-04',
    subject: 'An toàn thông tin',
    title: 'Bài tập thực hành mã hóa RSA và chữ ký điện tử',
    dueDate: '2026-09-16T23:59:59Z',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-05',
    subject: 'Phát triển ứng dụng di động',
    title: 'Giao diện ứng dụng đặt món React Native',
    dueDate: '2026-09-25T23:59:59Z',
    priority: 'low',
    completed: false,
  },
  {
    id: 'asg-06',
    subject: 'Mạng máy tính',
    title: 'Cấu hình định tuyến OSPF và VLAN trên Cisco Packet Tracer',
    dueDate: '2026-09-14T23:59:59Z',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-07',
    subject: 'Kiến trúc phần mềm',
    title: 'Phân tích thiết kế hệ thống Microservices',
    dueDate: '2026-09-12T23:59:59Z',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'asg-08',
    subject: 'Điện toán đám mây',
    title: 'Triển khai Kubernetes cluster trên AWS EKS',
    dueDate: '2026-09-28T23:59:59Z',
    priority: 'low',
    completed: false,
  },
  {
    id: 'asg-09',
    subject: 'Nhập môn Lập trình Web',
    title: 'Xây dựng trang cá nhân HTML5/CSS3 chuẩn SEO',
    dueDate: '2026-09-10T23:59:59Z',
    priority: 'medium',
    completed: true,
  },
  {
    id: 'asg-10',
    subject: 'Cấu trúc dữ liệu & Giải thuật',
    title: 'Cài đặt cây AVL và giải thuật Dijkstra',
    dueDate: '2026-09-08T23:59:59Z',
    priority: 'high',
    completed: true,
  },
];

let inMemoryAssignments = JSON.parse(JSON.stringify(INITIAL_ASSIGNMENTS));

function checkBackendHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/health',
        method: 'GET',
        timeout: 500,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function devApiMockPlugin(): Plugin {
  return {
    name: 'dev-api-mock-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/assignments')) {
          return next();
        }

        // Check if real backend is running on port 5000
        const isBackendUp = await checkBackendHealth();
        if (isBackendUp) {
          return next(); // Delegate to real backend proxy
        }

        // Handle in-memory mock seamlessly with 200 OK
        const method = req.method || 'GET';
        const parsedUrl = new URL(url, 'http://localhost:5173');
        const pathname = parsedUrl.pathname;

        const sendJson = (status: number, data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(status);
          res.end(JSON.stringify(data));
        };

        const readBody = (): Promise<any> => {
          return new Promise((resolve) => {
            const chunks: Buffer[] = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => {
              try {
                const str = Buffer.concat(chunks).toString();
                resolve(str ? JSON.parse(str) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        // 1. POST /api/assignments/seed
        if (method === 'POST' && pathname === '/api/assignments/seed') {
          inMemoryAssignments = JSON.parse(JSON.stringify(INITIAL_ASSIGNMENTS));
          return sendJson(200, {
            success: true,
            data: inMemoryAssignments,
            message: 'Đã khôi phục dữ liệu mẫu ban đầu.',
          });
        }

        // 2. PATCH /api/assignments/:id/toggle
        const toggleMatch = pathname.match(/^\/api\/assignments\/([^/]+)\/toggle$/);
        if (method === 'PATCH' && toggleMatch) {
          const id = toggleMatch[1];
          const item = inMemoryAssignments.find((a: any) => a.id === id);
          if (item) {
            item.completed = !item.completed;
            item.updatedAt = new Date().toISOString();
            return sendJson(200, {
              success: true,
              data: item,
              message: item.completed
                ? `Bạn đã hoàn thành "${item.title}".`
                : `Đã đánh dấu "${item.title}" là chưa hoàn thành.`,
            });
          }
          return sendJson(404, { success: false, error: 'Bài tập không tồn tại' });
        }

        // 3. DELETE /api/assignments/:id
        const deleteMatch = pathname.match(/^\/api\/assignments\/([^/]+)$/);
        if (method === 'DELETE' && deleteMatch) {
          const id = deleteMatch[1];
          inMemoryAssignments = inMemoryAssignments.filter((a: any) => a.id !== id);
          return sendJson(200, { success: true, message: 'Đã xóa bài tập.' });
        }

        // 4. PUT /api/assignments/:id
        if (method === 'PUT' && deleteMatch) {
          const id = deleteMatch[1];
          const body = await readBody();
          const item = inMemoryAssignments.find((a: any) => a.id === id);
          if (item) {
            Object.assign(item, body, { updatedAt: new Date().toISOString() });
            return sendJson(200, { success: true, data: item, message: 'Đã cập nhật bài tập.' });
          }
          return sendJson(404, { success: false, error: 'Bài tập không tồn tại' });
        }

        // 5. POST /api/assignments
        if (method === 'POST' && pathname === '/api/assignments') {
          const body = await readBody();
          const newAssignment = {
            id: `asg-${Date.now().toString(36)}`,
            subject: body.subject || 'Lập trình Web Nâng Cao',
            title: body.title || 'Bài tập mới',
            description: body.description,
            dueDate: body.dueDate || new Date().toISOString(),
            priority: body.priority || 'medium',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          inMemoryAssignments.unshift(newAssignment);
          return sendJson(201, {
            success: true,
            data: newAssignment,
            message: 'Đã thêm bài tập thành công.',
          });
        }

        // 6. GET /api/assignments
        if (method === 'GET' && pathname === '/api/assignments') {
          const filter = parsedUrl.searchParams.get('filter');
          const search = (parsedUrl.searchParams.get('search') || '').trim().toLowerCase();

          let results = [...inMemoryAssignments];
          if (filter === 'completed') {
            results = results.filter((a: any) => a.completed);
          } else if (filter === 'pending') {
            results = results.filter((a: any) => !a.completed);
          }

          if (search) {
            results = results.filter(
              (a: any) =>
                a.title.toLowerCase().includes(search) || a.subject.toLowerCase().includes(search)
            );
          }

          return sendJson(200, {
            success: true,
            data: results,
          });
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApiMockPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
