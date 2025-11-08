import express, { Request, Response } from 'express';
import cors from 'cors';
import coldRouter from './routes/cold';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'EcoWatch API Server' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true });
});

// Cold biome route - fetches from GBIF API
app.use('/api/biomes/cold', coldRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});