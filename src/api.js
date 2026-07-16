const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  try {
    const u = JSON.parse(localStorage.getItem('neat-user') || 'null');
    return u?.token ?? null;
  } catch { return null; }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '서버 오류가 발생했습니다.');
  return data;
}

// 서버 응답 노트를 프론트 형식으로 변환
function mapNote(n) {
  const splitTags = (v) => v ? v.split(',').map(s => s.trim()).filter(Boolean) : ['-'];
  return {
    id: n.id,
    name: n.whisky,
    category: n.category || '기타',
    nose:   splitTags(n.nose),
    palate: splitTags(n.palate),
    finish: splitTags(n.finish),
    rating: parseFloat(n.rating) || 0,
    img:    n.img || null,
    x:      n.x ?? 100,
    y:      n.y ?? 100,
    rot:    0,
    handle: `@${n.handle}`,
    likes:  n.likes ?? 0,
    liked:  n.liked ?? false,
    hue:    26,
    years:  '',
  };
}

export const api = {
  signup: (nickname, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ nickname, password }) }),

  login: (nickname, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ nickname, password }) }),

  getNotes: () => request('/notes').then(list => list.map(mapNote)),

  createNote: (d, x, y) => {
    const joinTags = (arr) => arr.filter(t => t && t !== '-').join(', ');
    return request('/notes', {
      method: 'POST',
      body: JSON.stringify({
        whisky:   d.name.trim(),
        category: d.category,
        nose:     joinTags(d.nose),
        palate:   joinTags(d.palate),
        finish:   joinTags(d.finish),
        rating:   d.rating || 0,
        img:      d.img || null,
        x, y,
      }),
    }).then(mapNote);
  },

  deleteNote: (id) =>
    request(`/notes/${id}`, { method: 'DELETE' }),

  toggleLike: (id) =>
    request(`/notes/${id}/like`, { method: 'POST' }),
};
