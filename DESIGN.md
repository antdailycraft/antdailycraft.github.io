# Daily Daily On 디자인

## 전체 사이트 방향
랜딩 페이지와 다른 페이지가 같은 사이트로 이어지도록, 사용자의 전체 디자인 적용 요청에 따라 Scrollcraft의 짙은 녹색과 라임색을 공통 디자인으로 사용한다. 브랜드 색·서체·헤더·푸터·초점 표시를 모든 Astro 화면이 공유한다.

## 색과 서체
`tokens.css`가 공통 색·서체·여백의 기준이다.
- Canvas: `#101b16`, surface: `#19271f`, second surface: `#1c2b22`.
- Text: `#f0f2e8`, secondary: `#b6c3b4`, rule: `#35483a`.
- Accent / focus: `#d2f86a`, text on accent: `#152016`.
- 긴 본문과 댓글의 reading panel: paper `#f8f7f2`, ink `#242d28`, secondary `#626b63`, accent `#2d674c`.
- 한글·본문은 Noto Sans KR Variable, 로고·큰 영문 워터마크는 Newsreader Variable. 코드는 운영체제의 고정폭 글꼴.

## 화면별 적용
- 홈: 독립적인 사진·메모 레이어, 타이포그래피, 추천 글 pin/reveal, 주제 pan, 밝은 아카이브 영역. `src/styles/scroll-home.css`와 `src/scripts/scroll-home.ts`.
- 주제·태그·목록: 같은 어두운 헤더와 큰 제목, 낮은 대비의 배경 워드마크, 라임색 상태 표시, 구분선과 주제 카드.
- 링크: 기존 사이트 캡처를 유지하고 공통 색과 제목 위계로 정돈한다.
- 배당표·차트: 어두운 표·검색·축·범례·툴팁과 라임색 데이터. 출처와 오래된 기록이라는 안내를 유지한다.
- 도구: 공통 패널·입력창·라임색 실행 버튼, 결과는 고정폭 글꼴로 표시한다.
- 글·소개: 어두운 제목 영역 뒤에 밝은 읽기 패널을 제공한다. 코드·이미지·giscus는 패널의 밝은 바탕에 맞춘다. 원본 서버에서 삭제된 본문 이미지는 안내와 원본 링크로 표시한다.
- 404·바로가기·페이지 목록도 같은 공통 스타일을 사용한다. 옛 2·3페이지는 기록으로 이동한다.
- `public/design-comparison.html`은 과거 스크린샷을 보존하는 독립 비교 문서다.

## 반응형·접근성
모바일은 메뉴를 줄바꿈하고 정보·도구·링크를 한 열로 구성한다. 표와 코드는 자체 가로 스크롤을 제공하고 문서 전체는 가로로 넘치지 않게 한다. 현재 메뉴를 색과 굵기·aria-current로 알린다. 본문 바로가기와 즉시 표시되는 초점 테두리를 유지한다. 움직임 줄이기를 존중하고 읽기·입력 화면에는 고정 스크롤을 추가하지 않는다.

## 구현과 출처
공통 레이아웃은 `src/layouts/Base.astro`, 기본 스타일은 `src/styles/global.css`, 하위 페이지 확장은 `src/styles/site-pages.css`다. 홈 Scrollcraft 엔진은 변경 없이 `public/vendor/scrollcraft.js`, `src/styles/vendor/scrollcraft.css`에 복사했다. 라이선스는 `public/vendor/scrollcraft-LICENSE.txt`, 스킬 원본은 `.agents/skills/scroll-craft/`, 홈 기획·검증 기록은 `scrollcraft/builds/daily-on/`에 있다.
