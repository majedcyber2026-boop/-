import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleChat, handleGenerateDescription, handleNaturalSearch, handleClassifyPriority, handleDailySummary, handleCompareVerdict } from './src/server/geminiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Gemini API Endpoints
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, products } = req.body;
    const reply = await handleChat(message, products || []);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Chat error' });
  }
});

app.post('/api/gemini/generate-description', async (req, res) => {
  try {
    const { name, brand, category, price } = req.body;
    const description = await handleGenerateDescription(name, brand, category, price);
    res.json({ description });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Description error' });
  }
});

app.post('/api/gemini/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await handleNaturalSearch(query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Search error' });
  }
});

app.post('/api/gemini/classify-priority', async (req, res) => {
  try {
    const { notes, total, customerName } = req.body;
    const priority = await handleClassifyPriority(notes, total, customerName);
    res.json({ priority });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Classification error' });
  }
});

app.post('/api/gemini/daily-summary', async (req, res) => {
  try {
    const { orders, products, customers } = req.body;
    const summary = await handleDailySummary(orders || [], products || [], customers || []);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Daily summary error' });
  }
});

app.post('/api/gemini/compare-verdict', async (req, res) => {
  try {
    const { products } = req.body;
    const verdict = await handleCompareVerdict(products || []);
    res.json({ verdict });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Compare verdict error' });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WAKNOVA server running on port ${PORT}`);
});
