import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [nick, setNick] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nick.trim();
    if (!trimmed) { setError('닉네임을 입력해 주세요.'); return; }
    if (trimmed.length < 2) { setError('2자 이상 입력해 주세요.'); return; }
    if (trimmed.length > 16) { setError('16자 이하로 입력해 주세요.'); return; }
    onLogin(trimmed);
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" />
      <div className="login-box">
        <div className="login-logo">NEAT</div>
        <p className="login-sub">위스키 테이스팅 노트 커뮤니티</p>
        <p className="login-desc">커뮤니티에서 사용할 닉네임을 설정하세요.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <span className="login-at">@</span>
            <input
              className="login-input"
              placeholder="닉네임 입력 (2~16자)"
              value={nick}
              onChange={e => { setNick(e.target.value); setError(''); }}
              autoFocus
              maxLength={16}
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">시작하기</button>
        </form>
        <p className="login-note">별도 회원가입 없이 닉네임만으로 시작할 수 있습니다.</p>
      </div>
    </div>
  );
}
