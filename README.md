# NEAT — 위스키 테이스팅 노트 커뮤니티 웹

위스키 테이스팅 노트를 공유하는 커뮤니티 웹 MVP입니다.  
백엔드 없이 localStorage + Mock Data로 동작하는 React 프론트엔드입니다.

## 배포 URL

https://neat-web-pi.vercel.app/

## GitHub

https://github.com/lhs2257/neat_web

## 주요 기능

- 닉네임 기반 로그인 / 로그아웃 (localStorage)
- 드래그 가능한 갤러리 월 — 위스키 테이스팅 노트 카드
- 노트 작성: Nose / Palate / Finish 태그, 0.5단계 별점, 사진
- 노트 상세 보기 (모달)
- 본인 노트 삭제
- 검색 + 카테고리 필터 (싱글몰트 / 버번 / 블렌디드)
- 내 노트 탭
- 좋아요 토글
- 노트 증가에 따른 벽 자동 확장

## 기술 스택

- React 19 + Vite
- localStorage (상태 영속화)
- CSS Variables (ADR-008 다크 앰버 테마)
- Pretendard 폰트

## 로컬 실행

```bash
npm install
npm run dev
```
