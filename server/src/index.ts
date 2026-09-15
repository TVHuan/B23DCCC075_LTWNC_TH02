import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { initDatabase } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'student-deadline-tracker-api', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/assignments', assignmentRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Đã xảy ra lỗi máy chủ nội bộ.',
  });
});

async function startServer() {
  let retries = 10;
  while (retries > 0) {
    try {
      console.log('Connecting to PostgreSQL database...');
      await initDatabase();
      console.log('✅ PostgreSQL database connected and tables initialized.');
      break;
    } catch (err) {
      retries -= 1;
      console.warn(`⚠️ Database connection failed. Retrying in 2 seconds... (${retries} attempts left)`);
      if (retries === 0) {
        console.error('❌ Could not connect to database after maximum retries. Continuing with limited functionality...');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Student Deadline Tracker Server running on port ${PORT}`);
  });
}

startServer();
