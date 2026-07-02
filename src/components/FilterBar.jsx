import { FILTERS } from '../data/seed';

export default function FilterBar({ filter, query, onFilter, onSearch }) {
  return (
    <div className="bar">
      <div className="search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A89C88" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" />
        </svg>
        <input
          placeholder="위스키 이름 검색"
          value={query}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="chips">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`chip ${filter === f ? 'on' : ''}`}
            onClick={() => onFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
