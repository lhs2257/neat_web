import { useState } from 'react';
import { CATEGORIES } from '../data/seed';

const EMPTY = { name: '', category: '싱글몰트', nose: [], palate: [], finish: [], rating: 0, ni: '', pi: '', fi: '' };

function TagInput({ label, tags, input, onInput, onAdd, onRemove, onKeyDown }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="taginput">
        <input className="tin" placeholder="키워드 입력 후 +" value={input} onChange={e => onInput(e.target.value)} onKeyDown={onKeyDown} />
        <button className="addbtn" onClick={onAdd}>+</button>
      </div>
      {tags.length > 0 && (
        <div className="tagwrap">
          {tags.map((t, i) => (
            <span key={i} className="etag">
              {t}
              <button onClick={() => onRemove(i)}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StarPicker({ rating, onChange }) {
  const label = rating === 0 ? '별점 없음' : `${rating}점`;

  return (
    <div className="field">
      <label>별점 · {label}</label>
      <div className="starpick">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button"
            style={{ background: 'none', border: 'none', padding: '2px', fontSize: 30, cursor: 'pointer',
              color: rating >= i ? 'var(--accent)' : '#5a4b3d' }}
            onClick={() => onChange(rating === i ? 0 : i)}>
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WriteModal({ onClose, onSubmit }) {
  const [d, setD] = useState(EMPTY);

  const patch = (obj) => setD(prev => ({ ...prev, ...obj }));

  const addTag = (field, bufKey) => {
    const v = (d[bufKey] || '').trim();
    if (!v) return;
    patch({ [field]: [...d[field], v], [bufKey]: '' });
  };

  const removeTag = (field, i) => patch({ [field]: d[field].filter((_, j) => j !== i) });

  const keyDown = (field, bufKey) => (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(field, bufKey); }
  };

  const handleSubmit = () => {
    if (!d.name.trim()) return;
    onSubmit(d);
    setD(EMPTY);
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="wmodal" onClick={e => e.stopPropagation()}>
        <div className="whead">
          <h2>테이스팅 노트 작성</h2>
          <button className="xbtn" style={{ position: 'static' }} onClick={onClose}>✕</button>
        </div>

        <div className="wbody">
          <div className="field">
            <label>위스키 이름</label>
            <input className="tin" placeholder="예: 라가불린 16년" value={d.name} onChange={e => patch({ name: e.target.value })} />
          </div>

          <div className="field">
            <label>종류</label>
            <div className="selchips">
              {CATEGORIES.map(c => (
                <button key={c} className={`selchip ${d.category === c ? 'on' : ''}`} onClick={() => patch({ category: c })}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <TagInput label="Nose · 향" tags={d.nose} input={d.ni}
            onInput={v => patch({ ni: v })} onAdd={() => addTag('nose', 'ni')}
            onRemove={i => removeTag('nose', i)} onKeyDown={keyDown('nose', 'ni')} />

          <TagInput label="Palate · 맛" tags={d.palate} input={d.pi}
            onInput={v => patch({ pi: v })} onAdd={() => addTag('palate', 'pi')}
            onRemove={i => removeTag('palate', i)} onKeyDown={keyDown('palate', 'pi')} />

          <TagInput label="Finish · 여운" tags={d.finish} input={d.fi}
            onInput={v => patch({ fi: v })} onAdd={() => addTag('finish', 'fi')}
            onRemove={i => removeTag('finish', i)} onKeyDown={keyDown('finish', 'fi')} />

          <StarPicker rating={d.rating} onChange={v => patch({ rating: v })} />

          <div className="field">
            <label>사진 업로드 (선택)</label>
            <label htmlFor="img-upload" className="dz" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {d.img
                ? <img src={d.img} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                : <><div className="dzi">&#8593;</div>이미지를 클릭해 업로드</>
              }
            </label>
            <input
              id="img-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => patch({ img: ev.target.result });
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

        <div className="wfoot">
          <button className="ghost" onClick={onClose}>취소</button>
          <button className="primary" onClick={handleSubmit}>공유하기</button>
        </div>
      </div>
    </div>
  );
}
