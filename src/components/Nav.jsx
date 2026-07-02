export default function Nav({ tab, onTab, onWrite, user, onLogout }) {
  return (
    <nav className="nav">
      <div className="logo">NEAT</div>
      <div className="tabs">
        <button className={`tab ${tab === 'feed' ? 'on' : ''}`} onClick={() => onTab('feed')}>피드</button>
        <button className={`tab ${tab === 'mine' ? 'on' : ''}`} onClick={() => onTab('mine')}>내 노트</button>
      </div>
      <div className="nav-right">
        <button className="write-btn" onClick={onWrite}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> 노트 작성
        </button>
        {user && (
          <div className="nav-user">
            <span className="nav-nick">@{user}</span>
            <button className="nav-logout" onClick={onLogout}>로그아웃</button>
          </div>
        )}
      </div>
    </nav>
  );
}
