import { pool } from '../config/db.js';
import { Assignment, AssignmentFilter, CreateAssignmentDTO, StatsResponse, UpdateAssignmentDTO } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';

function mapRowToAssignment(row: any): Assignment {
  return {
    id: row.id,
    subject: row.subject,
    title: row.title,
    description: row.description || undefined,
    dueDate: new Date(row.due_date).toISOString(),
    priority: row.priority,
    completed: Boolean(row.completed),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export class AssignmentService {
  async getAllAssignments(filter?: AssignmentFilter, search?: string): Promise<Assignment[]> {
    let query = 'SELECT * FROM assignments';
    const params: any[] = [];
    const conditions: string[] = [];

    const now = new Date();

    if (filter && filter !== 'all') {
      if (filter === 'completed') {
        conditions.push('completed = TRUE');
      } else if (filter === 'pending') {
        conditions.push(`completed = FALSE AND due_date >= $${params.length + 1}`);
        params.push(now.toISOString());
      } else if (filter === 'overdue') {
        conditions.push(`completed = FALSE AND due_date < $${params.length + 1}`);
        params.push(now.toISOString());
      }
    }

    if (search && search.trim()) {
      const searchIndex = params.length + 1;
      conditions.push(`(subject ILIKE $${searchIndex} OR title ILIKE $${searchIndex} OR description ILIKE $${searchIndex})`);
      params.push(`%${search.trim()}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY completed ASC, due_date ASC';

    const result = await pool.query(query, params);
    return result.rows.map(mapRowToAssignment);
  }

  async getStats(): Promise<StatsResponse> {
    const now = new Date().toISOString();

    const query = `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE completed = FALSE AND due_date >= $1) AS pending,
        COUNT(*) FILTER (WHERE completed = FALSE AND due_date < $1) AS overdue,
        COUNT(*) FILTER (WHERE completed = TRUE) AS completed
      FROM assignments;
    `;

    const result = await pool.query(query, [now]);
    const row = result.rows[0];

    return {
      total: parseInt(row.total, 10) || 0,
      pending: parseInt(row.pending, 10) || 0,
      overdue: parseInt(row.overdue, 10) || 0,
      completed: parseInt(row.completed, 10) || 0,
    };
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return mapRowToAssignment(result.rows[0]);
  }

  async createAssignment(data: CreateAssignmentDTO): Promise<Assignment> {
    const id = `asg-${uuidv4().substring(0, 8)}`;
    const now = new Date();

    const result = await pool.query(
      `INSERT INTO assignments (id, subject, title, description, due_date, priority, completed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, data.subject.trim(), data.title.trim(), data.description ? data.description.trim() : null, new Date(data.dueDate).toISOString(), data.priority, false, now, now]
    );

    return mapRowToAssignment(result.rows[0]);
  }

  async updateAssignment(id: string, data: UpdateAssignmentDTO): Promise<Assignment | null> {
    const existing = await this.getAssignmentById(id);
    if (!existing) return null;

    const subject = data.subject !== undefined ? data.subject.trim() : existing.subject;
    const title = data.title !== undefined ? data.title.trim() : existing.title;
    const description = data.description !== undefined ? (data.description ? data.description.trim() : null) : existing.description;
    const dueDate = data.dueDate !== undefined ? new Date(data.dueDate).toISOString() : existing.dueDate;
    const priority = data.priority !== undefined ? data.priority : existing.priority;
    const completed = data.completed !== undefined ? data.completed : existing.completed;
    const updatedAt = new Date();

    const result = await pool.query(
      `UPDATE assignments
       SET subject = $1, title = $2, description = $3, due_date = $4, priority = $5, completed = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [subject, title, description, dueDate, priority, completed, updatedAt, id]
    );

    return mapRowToAssignment(result.rows[0]);
  }

  async toggleAssignment(id: string): Promise<Assignment | null> {
    const existing = await this.getAssignmentById(id);
    if (!existing) return null;

    const newCompleted = !existing.completed;
    const updatedAt = new Date();

    const result = await pool.query(
      `UPDATE assignments
       SET completed = $1, updated_at = $2
       WHERE id = $3
       RETURNING *`,
      [newCompleted, updatedAt, id]
    );

    return mapRowToAssignment(result.rows[0]);
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async resetSeed(): Promise<Assignment[]> {
    await pool.query('DELETE FROM assignments');
    await pool.query(`
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
    `);
    return this.getAllAssignments();
  }
}

export const assignmentService = new AssignmentService();
