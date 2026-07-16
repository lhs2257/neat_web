const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const router = express.Router();
const NICK_RE = /^[가-힣a-zA-Z0-9_]+$/;

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: '닉네임과 비밀번호를 입력해 주세요.' });
  }
  if (nickname.length < 2 || nickname.length > 16) {
    return res.status(400).json({ error: '닉네임은 2~16자여야 합니다.' });
  }
  if (!NICK_RE.test(nickname)) {
    return res.status(400).json({ error: '닉네임은 한글·영문·숫자·_만 사용할 수 있습니다.' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE nickname = $1', [nickname]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 닉네임입니다.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (nickname, password_hash) VALUES ($1, $2) RETURNING id, nickname, created_at',
      [nickname, password_hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, nickname: user.nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  if (!nickname || !password) {
    return res.status(400).json({ error: '닉네임과 비밀번호를 입력해 주세요.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '가입되지 않은 닉네임입니다.' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign({ id: user.id, nickname: user.nickname }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, nickname: user.nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
