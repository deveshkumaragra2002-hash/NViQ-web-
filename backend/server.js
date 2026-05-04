import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// routes
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import fundsRoutes from './routes/fundsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// 🔥 MongoDB connect
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
};


// 🔐 Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));


// 🌐 CORS
app.use(cors({
  origin: ['http://localhost:4200', /\.vercel\.app$/],
  credentials: true,
}));


// 🚦 Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
}));


// 📦 Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 📁 Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 🧪 Health route
app.get('/api/health', async (req, res) => {
  await connectDB();

  res.json({
    success: true,
    message: "Backend Running 🚀"
  });
});


// 🔥 API routes
app.use('/api/auth', async (req, res, next) => { await connectDB(); next(); }, authRoutes);
app.use('/api/company', async (req, res, next) => { await connectDB(); next(); }, companyRoutes);
app.use('/api/services', async (req, res, next) => { await connectDB(); next(); }, servicesRoutes);
app.use('/api/funds', async (req, res, next) => { await connectDB(); next(); }, fundsRoutes);
app.use('/api/contact', async (req, res, next) => { await connectDB(); next(); }, contactRoutes);


// ❌ 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ❗❗ Vercel serverless export
export default app;