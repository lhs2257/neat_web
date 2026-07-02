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
  const label = rating === 0 ? '별점 없음' : `${rating.toFixed(1)}점`;

  const handleClick = (i, side) => {
    const next = side === 'l' ? i - 0.5 : i;
    onChange(rating === next ? 0 : next);
  };

  return (
    <div className="field">
      <label>별점 · {label}</label>
      <div className="starpick">
        {[1, 2, 3, 4, 5].map(i => {
          const cls = rating >= i ? 'full' : rating >= i - 0.5 ? 'half' : 'empty';
          return (
            <span key={i} className={`star ${cls}`}>
              ★
              <button className="sh l" onClick={() => handleClick(i, 'l')} />
              <button className="sh r" onClick={() => handleClick(i, 'r')} />
            </span>
          );
        })}
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
            <div className="dz">
              <div className="dzi">⬆</div>
              이미지를 끌어다 놓거나 클릭해 업로드
            </div>
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
