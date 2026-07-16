import { useState, useEffect, useRef, useCallback } from 'react';
import { WALL_W, WALL_H, WHISKY_IMGS } from './data/seed';
import { api } from './api';
import Nav from './components/Nav';
import FilterBar from './components/FilterBar';
import NoteCard from './components/NoteCard';
import DetailModal from './components/DetailModal';
import WriteModal from './components/WriteModal';
import LoginScreen from './components/LoginScreen';

const CARD_W = 260, CARD_H = 360, MARGIN = 24;

function getSession() {
  try { return JSON.parse(localStorage.getItem('neat-user') || 'null'); } catch { return null; }
}

function clamp(v, wallW, wallH) {
  return {
    x: Math.max(window.innerWidth  - wallW - 60, Math.min(60, v.x)),
    y: Math.max(window.innerHeight - wallH - 60, Math.min(90, v.y)),
  };
}

function findEmptySpot(existing, wallW, wallH) {
  const tryFind = (w, h) => {
    for (let i = 0; i < 300; i++) {
      const x = MARGIN + Math.random() * (w - CARD_W - MARGIN * 2);
      const y = MARGIN + Math.random() * (h - CARD_H - MARGIN * 2);
      const ok = existing.every(n =>
        Math.abs(n.x - x) > CARD_W + MARGIN || Math.abs(n.y - y) > CARD_H + MARGIN
      );
      if (ok) return { x, y, w, h };
    }
    return null;
  };
  return tryFind(wallW, wallH)
    ?? tryFind(wallW + 800, wallH + 600)
    ?? { x: MARGIN, y: MARGIN, w: wallW + 800, h: wallH + 600 };
}

function centerPan(notes, wallW, wallH) {
  if (!notes.length) return { x: 0, y: 0 };
  const cx = notes.reduce((a, n) => a + n.x + 118, 0) / notes.length;
  const cy = notes.reduce((a, n) => a + n.y + 180, 0) / notes.length;
  return clamp(
    { x: window.innerWidth / 2 - cx, y: window.innerHeight / 2 - cy + 20 },
    wallW, wallH
  );
}

export default function App() {
  const session = getSession();
  const [user, setUser]       = useState(session?.nickname ?? null);
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallW, setWallW]     = useState(WALL_W);
  const [wallH, setWallH]     = useState(WALL_H);
  const [pan, setPan]         = useState({ x: 0, y: 0 });
  const [tab, setTab]         = useState('feed');
  const [filter, setFilter]   = useState('전체');
  const [query, setQuery]     = useState('');
  const [activeId, setActiveId]   = useState(null);
  const [showWrite, setShowWrite] = useState(false);
  const [dragging, setDragging]   = useState(false);
  const drag = useRef({ down: false, moved: false, sx: 0, sy: 0, px: 0, py: 0 });

  // 노트 불러오기
  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getNotes();
      setNotes(list);
      setPan(centerPan(list, wallW, wallH));
    } catch (err) {
      console.error('노트 불러오기 실패:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) loadNotes(); }, [user]);

  useEffect(() => {
    const mm = (e) => {
      if (!drag.current.down) return;
      const dx = e.clientX - drag.current.sx;
      const dy = e.clientY - drag.current.sy;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true;
      const { x, y } = clamp({ x: drag.current.px + dx, y: drag.current.py + dy }, wallW, wallH);
      setPan({ x, y });
    };
    const mu = () => {
      if (drag.current.down) {
        drag.current.down = false;
        setDragging(false);
        setTimeout(() => { drag.current.moved = false; }, 10);
      }
    };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
  }, [wallW, wallH]);

  const onWallDown = (e) => {
    drag.current = { down: true, moved: false, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
    setDragging(true);
  };

  const toggleLike = useCallback(async (id) => {
    try {
      const result = await api.toggleLike(id);
      setNotes(prev => prev.map(n =>
        n.id === id ? { ...n, liked: result.liked, likes: result.likes } : n
      ));
    } catch (err) {
      console.error('좋아요 실패:', err.message);
    }
  }, []);

  const openNote = (id) => { if (drag.current.moved) return; setActiveId(id); };

  const handleLogin = (nickname) => {
    setUser(nickname);
  };

  const handleSubmit = async (d) => {
    const spot = findEmptySpot(notes, wallW, wallH);
    if (spot.w !== wallW) setWallW(spot.w);
    if (spot.h !== wallH) setWallH(spot.h);

    const imgPool = WHISKY_IMGS;
    const randomImg = imgPool[Math.floor(Math.random() * imgPool.length)];
    if (!d.img) d.img = randomImg;

    try {
      const newNote = await api.createNote(d, spot.x, spot.y);
      setNotes(prev => [...prev, { ...newNote, rot: Math.random() * 4 - 2 }]);
    } catch (err) {
      console.error('노트 작성 실패:', err.message);
    }
    setShowWrite(false);
    setTab('feed');
    setFilter('전체');
    setQuery('');
  };

  const handleDelete = useCallback(async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      setActiveId(null);
    } catch (err) {
      console.error('삭제 실패:', err.message);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('neat-user');
    setUser(null);
    setNotes([]);
    setTab('feed');
  };

  const q = query.trim().toLowerCase();
  const filtered = notes.filter(n => {
    if (tab === 'mine' && n.handle !== `@${user}`) return false;
    if (filter !== '전체' && n.category !== filter) return false;
    if (q && !n.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const active = notes.find(n => n.id === activeId) ?? null;

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className={`stage ${dragging ? 'grabbing' : ''}`} onMouseDown={onWallDown}>
        <div className="wall" style={{
          width: wallW, height: wallH,
          transform: `translate3d(${pan.x}px,${pan.y}px,0)`,
        }}>
          {filtered.map(n => (
            <NoteCard key={n.id} note={n} onClick={openNote} onLike={toggleLike} />
          ))}
        </div>
        {!loading && filtered.length === 0 && (
          <div className="empty">
            <svg width="72" height="86" viewBox="0 0 72 86" fill="none" stroke="#C9892E" strokeWidth="2">
              <path d="M14 8h44l-6 46a8 8 0 0 1-8 7H28a8 8 0 0 1-8-7L14 8Z"/>
              <path d="M18 34h36" strokeOpacity=".5"/>
              <rect x="20" y="38" width="32" height="18" rx="3" fill="#C9892E" fillOpacity=".22" stroke="none"/>
              <path d="M36 68v10M24 78h24" strokeOpacity=".7"/>
            </svg>
            <div className="emsg">첫 번째 테이스팅 노트를 공유해보세요</div>
          </div>
        )}
        {loading && (
          <div className="empty">
            <div className="emsg">노트를 불러오는 중...</div>
          </div>
        )}
      </div>

      <Nav tab={tab} onTab={setTab} onWrite={() => setShowWrite(true)} user={user} onLogout={handleLogout} />
      <FilterBar filter={filter} query={query} onFilter={setFilter} onSearch={setQuery} />

      <div className="hint">
        <span className="ht">벽을 드래그해 노트를 둘러보세요</span>
        <span className="hb">&#10022; 갤러리</span>
      </div>

      {activeId && <DetailModal note={active} onClose={() => setActiveId(null)} onLike={toggleLike} onDelete={handleDelete} user={user} />}
      {showWrite && <WriteModal onClose={() => setShowWrite(false)} onSubmit={handleSubmit} />}
    </div>
  );
}
