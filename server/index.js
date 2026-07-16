require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);
app.use('/notes', notesRouter);

// 정의되지 않은 경로
app.use((req, res) => res.status(404).json({ error: '요청한 경로를 찾을 수 없습니다.' }));

app.listen(PORT, () => {
  console.log(`NEAT 서버 실행 중 — http://localhost:${PORT}`);
});
