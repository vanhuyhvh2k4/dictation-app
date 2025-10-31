// app.js
import 'dotenv/config'; // tự động gọi dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import transcriptRoutes from './routes/transcript.js';
import wordRoutes from './routes/word.js';
import dictationRoutes from './routes/dictation.js';
import progressRoutes from './routes/progress.js';
import translateRoutes from './routes/translate.js';
import topicRoutes from './routes/topic.js';
import analyticsRoutes from './routes/analytics.js';
import videoRatingRoutes from './routes/videoRating.js';
import FactUserService from './services/factUserService.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  credentials: true
}));

// Middleware để parse JSON
app.use(express.json());

// Nếu client gửi form (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Khởi động cập nhật định kỳ fact_users
FactUserService.startPeriodicUpdate();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/dictation', dictationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', videoRatingRoutes);

// Health check
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Export the Express app instance
export default app;
