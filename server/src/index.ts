import express, { Request, Response } from 'express';
import cors from 'cors';
import biomesRouter from './routes/biomes';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
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

// Biome routes - enrich curated biodiversity data with GBIF taxonomy
app.use('/api/biomes', biomesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
