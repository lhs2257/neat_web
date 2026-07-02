import { useState } from 'react';
import { starArr } from './NoteCard';

export default function DetailModal({ note, onClose, onLike, onDelete, user }) {
  const [confirmDel, setConfirmDel] = useState(false);

  if (!note) return null;

  const grad = `linear-gradient(158deg,hsl(${note.hue},46%,33%),hsl(${note.hue - 8},58%,15%))`;
  const initial = note.handle.replace('@', '').charAt(0).toUpperCase();
  const stars = starArr(note.rating);
  const isOwn = user && note.handle === `@${user}`;

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(note.id);
  };

  const handleDeleteConfirm = (e) => {
    e.stopPropagation();
    onDelete(note.id);
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="detail" onClick={e => e.stopPropagation()}>
        <button className="xbtn" onClick={onClose}>✕</button>

        <div className="dphoto" style={note.img
          ? { backgroundImage: `url(${note.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: grad }
        }>
          <span className="dbadge">{note.category}</span>
          <span className="dwm">NEAT</span>
        </div>

        <div className="dbody">
          <div className="dname">{note.name}</div>
          <div className="dsub">
            <span className="meta">{note.category}</span>
            <span className="dot" />
            <span className="meta">{note.years}</span>
            <span className="dot" />
            <div className="stars">
              {stars.map((s, i) => (
                <span key={i} className={`star ${s}`}>★</span>
              ))}
            </div>
            <span className="rnum">{note.rating.toFixed(1)}</span>
          </div>

          <div className="npfblock">
            {[
              { label: 'NOSE',   tags: note.nose },
              { label: 'PALATE', tags: note.palate },
              { label: 'FINISH', tags: note.finish },
            ].map(({ label, tags }) => (
              <div key={label} className="npfrow">
                <div className="lbl">{label}</div>
                <div className="val">
                  {tags.map((t, i) => (
                    <span key={i} className="tagpill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {confirmDel ? (
            <div className="del-confirm">
              <span className="del-msg">이 노트를 삭제할까요?</span>
              <button className="iconbtn del-btn" onClick={handleDeleteConfirm}>삭제</button>
              <button className="iconbtn" onClick={() => setConfirmDel(false)}>취소</button>
            </div>
          ) : (
            <div className="dfoot">
              <div className="duser">
                <div className="avatar">{initial}</div>
                <span className="h">{note.handle}</span>
              </div>
              <div className="dacts">
                <button className={`iconbtn ${note.liked ? 'liked' : ''}`} onClick={handleLike}>
                  ♥ {note.likes}
                </button>
                <button className="iconbtn">↗ 공유</button>
                {isOwn && (
                  <button className="iconbtn del-btn" onClick={e => { e.stopPropagation(); setConfirmDel(true); }}>
                    삭제
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
