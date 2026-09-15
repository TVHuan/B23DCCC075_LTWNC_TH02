import { Router } from 'express';
import { assignmentController } from '../controllers/assignmentController.js';

const router = Router();

// GET /api/assignments - Get all with optional filtering & searching
router.get('/', (req, res) => assignmentController.getAll(req, res));

// GET /api/assignments/stats - Summary counts
router.get('/stats', (req, res) => assignmentController.getStats(req, res));

// POST /api/assignments/seed - Reset to default seed
router.post('/seed', (req, res) => assignmentController.resetSeed(req, res));

// GET /api/assignments/:id - Single assignment
router.get('/:id', (req, res) => assignmentController.getById(req, res));

// POST /api/assignments - Create new assignment
router.post('/', (req, res) => assignmentController.create(req, res));

// PUT /api/assignments/:id - Update assignment
router.put('/:id', (req, res) => assignmentController.update(req, res));

// PATCH /api/assignments/:id/toggle - Toggle completed status
router.patch('/:id/toggle', (req, res) => assignmentController.toggle(req, res));

// DELETE /api/assignments/:id - Delete assignment
router.delete('/:id', (req, res) => assignmentController.delete(req, res));

export default router;
