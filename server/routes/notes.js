const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /notes — 전체 노트 목록 (최신순, 좋아요 수 포함)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        n.id, n.whisky, n.category, n.nose, n.palate, n.finish,
        n.rating, n.img, n.x, n.y, n.created_at,
        u.nickname AS handle,
        COUNT(l.user_id)::int AS likes
      FROM notes n
      JOIN users u ON n.user_id = u.id
      LEFT JOIN likes l ON l.note_id = n.id
      GROUP BY n.id, u.nickname
      ORDER BY n.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /notes — 노트 작성 (인증 필요)
router.post('/', auth, async (req, res) => {
  const { whisky, category, nose, palate, finish, rating, img, x, y } = req.body;

  if (!whisky || !whisky.trim()) {
    return res.status(400).json({ error: '위스키 이름은 필수입니다.' });
  }
  if (rating !== undefined && (rating < 0 || rating > 5)) {
    return res.status(400).json({ error: '별점은 0~5 사이여야 합니다.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, whisky, category, nose, palate, finish, rating, img, x, y)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, whisky, category, nose, palate, finish, rating, img, x, y, created_at`,
      [req.user.id, whisky.trim(), category || null, nose || null, palate || null,
       finish || null, rating || null, img || null, x || 100, y || 100]
    );
    const note = result.rows[0];
    res.status(201).json({ ...note, handle: req.user.nickname, likes: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// DELETE /notes/:id — 본인 노트 삭제 (인증 필요)
router.delete('/:id', auth, async (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  if (isNaN(noteId)) return res.status(400).json({ error: '유효하지 않은 노트 ID입니다.' });

  try {
    const check = await pool.query('SELECT user_id FROM notes WHERE id = $1', [noteId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
    }
    if (check.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: '본인 노트만 삭제할 수 있습니다.' });
    }

    await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /notes/:id/like — 좋아요 토글 (인증 필요)
router.post('/:id/like', auth, async (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  if (isNaN(noteId)) return res.status(400).json({ error: '유효하지 않은 노트 ID입니다.' });

  try {
    const exists = await pool.query(
      'SELECT 1 FROM likes WHERE user_id = $1 AND note_id = $2',
      [req.user.id, noteId]
    );

    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND note_id = $2', [req.user.id, noteId]);
    } else {
      // 노트 존재 여부 확인
      const noteCheck = await pool.query('SELECT id FROM notes WHERE id = $1', [noteId]);
      if (noteCheck.rows.length === 0) return res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
      await pool.query('INSERT INTO likes (user_id, note_id) VALUES ($1, $2)', [req.user.id, noteId]);
    }

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS likes FROM likes WHERE note_id = $1',
      [noteId]
    );
    res.json({ liked: exists.rows.length === 0, likes: countResult.rows[0].likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
