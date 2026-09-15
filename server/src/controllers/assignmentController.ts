import { Request, Response } from 'express';
import { assignmentService } from '../services/assignmentService.js';
import { AssignmentFilter, CreateAssignmentDTO, isPriority } from '../models/types.js';

export class AssignmentController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filter = (req.query.filter as AssignmentFilter) || 'all';
      const search = (req.query.search as string) || '';

      const assignments = await assignmentService.getAllAssignments(filter, search);
      res.json({
        success: true,
        data: assignments,
      });
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể tải danh sách bài tập. Vui lòng thử lại.',
      });
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await assignmentService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể tải thống kê bài tập.',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const assignment = await assignmentService.getAssignmentById(id);
      if (!assignment) {
        res.status(404).json({
          success: false,
          error: 'Bài tập không tồn tại.',
        });
        return;
      }

      res.json({
        success: true,
        data: assignment,
      });
    } catch (error: any) {
      console.error('Error getting assignment:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi khi lấy thông tin bài tập.',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { subject, title, description, dueDate, priority } = req.body;

      if (!subject || typeof subject !== 'string' || !subject.trim()) {
        res.status(400).json({ success: false, error: 'Vui lòng nhập môn học.' });
        return;
      }

      if (!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).json({ success: false, error: 'Vui lòng nhập tên bài tập.' });
        return;
      }

      if (!dueDate || isNaN(new Date(dueDate).getTime())) {
        res.status(400).json({ success: false, error: 'Vui lòng chọn hạn nộp hợp lệ.' });
        return;
      }

      if (!isPriority(priority)) {
        res.status(400).json({ success: false, error: 'Độ ưu tiên không hợp lệ (low, medium, high).' });
        return;
      }

      const dto: CreateAssignmentDTO = {
        subject: subject.trim(),
        title: title.trim(),
        description: typeof description === 'string' ? description.trim() : undefined,
        dueDate,
        priority,
      };

      const created = await assignmentService.createAssignment(dto);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Đã thêm bài tập thành công.',
      });
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể thêm bài tập.',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { subject, title, description, dueDate, priority, completed } = req.body;

      if (subject !== undefined && (typeof subject !== 'string' || !subject.trim())) {
        res.status(400).json({ success: false, error: 'Tên môn học không hợp lệ.' });
        return;
      }

      if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        res.status(400).json({ success: false, error: 'Tên bài tập không hợp lệ.' });
        return;
      }

      if (dueDate !== undefined && isNaN(new Date(dueDate).getTime())) {
        res.status(400).json({ success: false, error: 'Hạn nộp không hợp lệ.' });
        return;
      }

      if (priority !== undefined && !isPriority(priority)) {
        res.status(400).json({ success: false, error: 'Độ ưu tiên không hợp lệ.' });
        return;
      }

      const updated = await assignmentService.updateAssignment(id, {
        subject,
        title,
        description: typeof description === 'string' ? description.trim() : undefined,
        dueDate,
        priority,
        completed,
      });

      if (!updated) {
        res.status(404).json({ success: false, error: 'Bài tập không tồn tại.' });
        return;
      }

      res.json({
        success: true,
        data: updated,
        message: 'Đã cập nhật bài tập.',
      });
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể cập nhật bài tập.',
      });
    }
  }

  async toggle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const toggled = await assignmentService.toggleAssignment(id);

      if (!toggled) {
        res.status(404).json({ success: false, error: 'Bài tập không tồn tại.' });
        return;
      }

      res.json({
        success: true,
        data: toggled,
        message: toggled.completed
          ? `Bạn đã hoàn thành "${toggled.title}".`
          : `Đã đánh dấu "${toggled.title}" là chưa hoàn thành.`,
      });
    } catch (error: any) {
      console.error('Error toggling assignment:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể thay đổi trạng thái bài tập.',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await assignmentService.deleteAssignment(id);

      if (!deleted) {
        res.status(404).json({ success: false, error: 'Bài tập không tồn tại.' });
        return;
      }

      res.json({
        success: true,
        message: 'Đã xóa bài tập.',
      });
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể xóa bài tập.',
      });
    }
  }

  async resetSeed(_req: Request, res: Response): Promise<void> {
    try {
      const assignments = await assignmentService.resetSeed();
      res.json({
        success: true,
        data: assignments,
        message: 'Đã khôi phục dữ liệu mẫu ban đầu.',
      });
    } catch (error: any) {
      console.error('Error seeding assignments:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể khôi phục dữ liệu mẫu.',
      });
    }
  }
}

export const assignmentController = new AssignmentController();
