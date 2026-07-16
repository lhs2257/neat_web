import { useState } from 'react';
import { api } from '../api';

export default function LoginScreen({ onLogin }) {
  const [tab, setTab]         = useState('login');
  const [nick, setNick]       = useState('');
  const [pw, setPw]           = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = (nextTab) => { setNick(''); setPw(''); setError(''); setSuccess(''); setTab(nextTab); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!nick.trim() || !pw) { setError('닉네임과 비밀번호를 입력해 주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await api.login(nick.trim(), pw);
      localStorage.setItem('neat-user', JSON.stringify({ nickname: data.nickname, token: data.token }));
      onLogin(data.nickname);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!nick.trim() || !pw) { setError('닉네임과 비밀번호를 입력해 주세요.'); return; }
    if (pw.length < 4) { setError('비밀번호는 4자 이상이어야 합니다.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await api.signup(nick.trim(), pw);
      localStorage.setItem('neat-user', JSON.stringify({ nickname: data.nickname, token: data.token }));
      setSuccess(`@${data.nickname} 으로 가입되었습니다!`);
      setTimeout(() => onLogin(data.nickname), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" />
      <div className="login-box">

        <div className="login-logo">NEAT</div>
        <p className="login-sub">위스키 테이스팅 노트 커뮤니티</p>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'on' : ''}`} onClick={() => reset('login')} type="button">로그인</button>
          <button className={`login-tab ${tab === 'signup' ? 'on' : ''}`} onClick={() => reset('signup')} type="button">회원가입</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} noValidate>
            <p className="login-desc">닉네임으로 로그인하세요.</p>
            <label className="login-label">닉네임</label>
            <div className="login-field">
              <span className="login-at">@</span>
              <input className="login-input" placeholder="닉네임 입력" value={nick}
                onChange={e => { setNick(e.target.value); setError(''); }} autoFocus maxLength={16} />
            </div>
            <label className="login-label" style={{ marginTop: 12 }}>비밀번호</label>
            <div className="login-field">
              <input className="login-input" type="password" placeholder="비밀번호 입력"
                value={pw} onChange={e => { setPw(e.target.value); setError(''); }} />
            </div>
            {error   && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <p className="login-note">
              계정이 없으신가요?{' '}
              <button type="button" className="login-link" onClick={() => reset('signup')}>회원가입</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} noValidate>
            <p className="login-desc">닉네임 하나로 간편하게 시작하세요.</p>
            <label className="login-label">닉네임</label>
            <div className="login-field">
              <span className="login-at">@</span>
              <input className="login-input" placeholder="한글·영문·숫자·_ (2~16자)" value={nick}
                onChange={e => { setNick(e.target.value); setError(''); setSuccess(''); }} autoFocus maxLength={16} />
            </div>
            <label className="login-label" style={{ marginTop: 12 }}>비밀번호</label>
            <div className="login-field">
              <input className="login-input" type="password" placeholder="비밀번호 (4자 이상)"
                value={pw} onChange={e => { setPw(e.target.value); setError(''); setSuccess(''); }} />
            </div>
            {error   && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '가입 중...' : '가입하기'}
            </button>
            <p className="login-note">
              이미 계정이 있으신가요?{' '}
              <button type="button" className="login-link" onClick={() => reset('login')}>로그인</button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
