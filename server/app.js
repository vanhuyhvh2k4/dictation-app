// server.js
import 'dotenv/config'; // tự động gọi dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { sequelize } from './models/index.js';

import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import dictationRoutes from './routes/dictation.js';
import wordRoutes from './routes/word.js';
import transcriptRoutes from './routes/transcript.js';
import progressRoutes from './routes/progress.js';

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/dictation', dictationRoutes);
app.use('/api/word', wordRoutes);
app.use('/api/transcript', transcriptRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // await sequelize.sync({ alter: true }); // dev only
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Unable to start', err);
    process.exit(1);
  }
})();
