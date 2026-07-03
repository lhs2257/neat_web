import { useState } from 'react';

function getUsers() {
  try { return JSON.parse(localStorage.getItem('neat-users') || '[]'); } catch { return []; }
}
function saveUser(nick) {
  const users = getUsers();
  if (!users.includes(nick)) localStorage.setItem('neat-users', JSON.stringify([...users, nick]));
}

export default function LoginScreen({ onLogin }) {
  const [tab, setTab]     = useState('login');   // 'login' | 'signup'
  const [nick, setNick]   = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = (nextTab) => { setNick(''); setError(''); setSuccess(''); setTab(nextTab); };

  const validate = (v) => {
    if (!v) return '닉네임을 입력해 주세요.';
    if (v.length < 2) return '2자 이상 입력해 주세요.';
    if (v.length > 16) return '16자 이하로 입력해 주세요.';
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(v)) return '한글·영문·숫자·_만 사용할 수 있습니다.';
    return '';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const v = nick.trim();
    const err = validate(v);
    if (err) { setError(err); return; }
    const users = getUsers();
    if (!users.includes(v)) { setError('가입되지 않은 닉네임입니다. 회원가입을 먼저 해주세요.'); return; }
    onLogin(v);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const v = nick.trim();
    const err = validate(v);
    if (err) { setError(err); return; }
    const users = getUsers();
    if (users.includes(v)) { setError('이미 사용 중인 닉네임입니다.'); return; }
    saveUser(v);
    setSuccess(`@${v} 으로 가입되었습니다!`);
    setTimeout(() => onLogin(v), 900);
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" />
      <div className="login-box">

        <div className="login-logo">NEAT</div>
        <p className="login-sub">위스키 테이스팅 노트 커뮤니티</p>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'on' : ''}`}
            onClick={() => reset('login')}
            type="button"
          >로그인</button>
          <button
            className={`login-tab ${tab === 'signup' ? 'on' : ''}`}
            onClick={() => reset('signup')}
            type="button"
          >회원가입</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} noValidate>
            <p className="login-desc">닉네임으로 로그인하세요.</p>
            <label className="login-label">닉네임</label>
            <div className="login-field">
              <span className="login-at">@</span>
              <input
                className="login-input"
                placeholder="가입한 닉네임 입력"
                value={nick}
                onChange={e => { setNick(e.target.value); setError(''); }}
                autoFocus
                maxLength={16}
              />
            </div>
            {error   && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit" className="login-btn">로그인</button>
            <p className="login-note">
              계정이 없으신가요?{' '}
              <button type="button" className="login-link" onClick={() => reset('signup')}>
                회원가입
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} noValidate>
            <p className="login-desc">닉네임 하나로 간편하게 시작하세요.</p>
            <label className="login-label">닉네임</label>
            <div className="login-field">
              <span className="login-at">@</span>
              <input
                className="login-input"
                placeholder="한글·영문·숫자·_ (2~16자)"
                value={nick}
                onChange={e => { setNick(e.target.value); setError(''); setSuccess(''); }}
                autoFocus
                maxLength={16}
              />
            </div>
            {error   && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit" className="login-btn">가입하기</button>
            <p className="login-note">
              이미 계정이 있으신가요?{' '}
              <button type="button" className="login-link" onClick={() => reset('login')}>
                로그인
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
