import { ApiResponse, Assignment, AssignmentFilter, CreateAssignmentInput, UpdateAssignmentInput } from '../features/assignments/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/assignments';
const STORAGE_KEY = 'student_deadline_tracker_cache_v1';

// Initial fallback mock data for offline/standalone persistence
const INITIAL_FALLBACK_ASSIGNMENTS: Assignment[] = [
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

function getStoredAssignments(): Assignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_ASSIGNMENTS));
  return INITIAL_FALLBACK_ASSIGNMENTS;
}

function saveStoredAssignments(items: Assignment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

export const assignmentApi = {
  async fetchAssignments(filter?: AssignmentFilter, search?: string): Promise<Assignment[]> {
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'all') params.append('filter', filter);
      if (search) params.append('search', search);

      const url = `${API_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: ApiResponse<Assignment[]> = await res.json();
      if (data.success && data.data) {
        saveStoredAssignments(data.data);
        return data.data;
      }
      throw new Error(data.error || 'Failed to fetch assignments');
    } catch (err) {
      console.warn('API fetch failed, utilizing cached/local storage fallback:', err);
      return getStoredAssignments();
    }
  },

  async createAssignment(input: CreateAssignmentInput): Promise<Assignment> {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: ApiResponse<Assignment> = await res.json();
      if (data.success && data.data) {
        const stored = getStoredAssignments();
        saveStoredAssignments([data.data, ...stored]);
        return data.data;
      }
      throw new Error(data.error || 'Failed to create assignment');
    } catch (err) {
      console.warn('API create failed, falling back to local creation:', err);
      const newAssignment: Assignment = {
        id: `asg-${Date.now().toString(36)}`,
        subject: input.subject,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        priority: input.priority,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const stored = getStoredAssignments();
      const updated = [newAssignment, ...stored];
      saveStoredAssignments(updated);
      return newAssignment;
    }
  },

  async updateAssignment(id: string, input: UpdateAssignmentInput): Promise<Assignment> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: ApiResponse<Assignment> = await res.json();
      if (data.success && data.data) {
        const stored = getStoredAssignments().map((a) => (a.id === id ? data.data! : a));
        saveStoredAssignments(stored);
        return data.data;
      }
      throw new Error(data.error || 'Failed to update assignment');
    } catch (err) {
      console.warn('API update failed, updating local cache:', err);
      const stored = getStoredAssignments();
      let updatedItem: Assignment | null = null;
      const updated = stored.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            ...input,
            updatedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return item;
      });
      saveStoredAssignments(updated);
      if (!updatedItem) throw new Error('Bài tập không tồn tại');
      return updatedItem;
    }
  },

  async toggleAssignment(id: string): Promise<Assignment> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: ApiResponse<Assignment> = await res.json();
      if (data.success && data.data) {
        const stored = getStoredAssignments().map((a) => (a.id === id ? data.data! : a));
        saveStoredAssignments(stored);
        return data.data;
      }
      throw new Error(data.error || 'Failed to toggle assignment');
    } catch (err) {
      console.warn('API toggle failed, toggling in local cache:', err);
      const stored = getStoredAssignments();
      let toggledItem: Assignment | null = null;
      const updated = stored.map((item) => {
        if (item.id === id) {
          toggledItem = {
            ...item,
            completed: !item.completed,
            updatedAt: new Date().toISOString(),
          };
          return toggledItem;
        }
        return item;
      });
      saveStoredAssignments(updated);
      if (!toggledItem) throw new Error('Bài tập không tồn tại');
      return toggledItem;
    }
  },

  async deleteAssignment(id: string): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: ApiResponse<void> = await res.json();
      if (data.success) {
        const stored = getStoredAssignments().filter((a) => a.id !== id);
        saveStoredAssignments(stored);
        return id;
      }
      throw new Error(data.error || 'Failed to delete assignment');
    } catch (err) {
      console.warn('API delete failed, deleting from local cache:', err);
      const stored = getStoredAssignments().filter((a) => a.id !== id);
      saveStoredAssignments(stored);
      return id;
    }
  },

  async resetSeed(): Promise<Assignment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
      if (res.ok) {
        const data: ApiResponse<Assignment[]> = await res.json();
        if (data.success && data.data) {
          saveStoredAssignments(data.data);
          return data.data;
        }
      }
    } catch (err) {
      console.warn('Reset seed via API failed, resetting local storage:', err);
    }
    saveStoredAssignments(INITIAL_FALLBACK_ASSIGNMENTS);
    return INITIAL_FALLBACK_ASSIGNMENTS;
  },
};
