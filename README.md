# Daily Daily On

개발과 업무 자동화, 미국 주식과 일상을 기록하는 Astro 정적 블로그입니다.

## 로컬 실행

Node.js 22.23.4 이상이 필요합니다.

```sh
npm ci
npm run dev
```

기본 실행 주소는 `http://localhost:20000`입니다. 개발 서버와 미리보기는 `0.0.0.0:20000`에 바인딩하므로 같은 네트워크에서는 `http://<이 컴퓨터의 IP>:20000`으로 접속할 수 있습니다.

```sh
npm test        # 콘텐츠 호환성·검색·변환 기능 검증
npm run check   # Astro 및 TypeScript 검사
npm run build   # 검사 후 dist/에 정적 페이지 생성
npm run preview # 빌드 결과 확인
```

## 콘텐츠 관리

- 글: `_posts/YYYY-MM-DD-slug.md`. 기존 Markdown과 YAML 머리말을 그대로 사용합니다.
- 글 주소: `/slug/`. 날짜와 폴더명은 주소에 포함하지 않습니다.
- `published: false`는 빌드에서 제외합니다. `hidden: true`는 목록과 RSS에서 숨기고 기존 본문 주소는 유지합니다.
- `categories`, `tags`: 공백으로 구분한 문자열 또는 YAML 배열을 지원합니다.
- 글 이미지: `assets/images/`. 개발·빌드 전에 `scripts/sync-assets.mjs`가 `public/assets/`로 복사합니다. 복사본을 직접 편집하지 마세요.
- 링크와 배당 데이터: `_data/links.yaml`, `_data/dividends.yaml`.
- Jekyll highlight 블록, `site.baseurl`, 공백이 포함된 Markdown 이미지 경로는 `src/lib/content.mjs`에서 변환합니다.
- `_layouts`, `_includes`, `_sass`, `_pages`와 Ruby 설정은 이전 사이트 참고용으로 보존하며 Astro 빌드에서는 사용하지 않습니다.
- 본문 HTML을 허용하므로 저장소에서 신뢰하는 작성자의 콘텐츠만 추가하세요.

## 기능

제목·본문 검색·전체 주제 필터, 카테고리·태그 탐색, RSS(`/feed.xml`), 사이트맵, 공유 메타데이터, 404 페이지를 제공합니다. 기존 `/page2/` 형태의 페이지 주소도 유지합니다.

배당표는 기존 저장 데이터이며 최신 금융 데이터가 아닙니다. 차트는 기존 외부 CSV 저장소를 이용하며 네트워크 또는 데이터 부재 시 오류 안내와 재시도를 제공합니다. 배당 자료가 실패해도 유효한 주가 자료는 표시합니다. 날짜·빈 값·숫자를 검증하고 제외된 행을 안내하며, 데이터가 유효할 때만 차트 프로그램을 내려받습니다. 마지막 종가는 수집된 기록의 값이며 실시간 가격이 아닙니다. 파일명 및 JSON 변환은 브라우저 내부에서 처리합니다. 결과 복사 버튼을 제공하며, 복사가 제한된 환경에서는 결과를 선택한 뒤 수동 복사하도록 안내합니다. 입력을 수정하면 이전 결과를 비워 잘못 복사하는 것을 막습니다.

검색어와 주제는 `/?q=검색어&category=python#records` 형태의 주소로 저장됩니다. 새로고침하거나 글을 읽고 돌아와도 조건이 유지되며, 검색 주소 복사로 같은 결과를 공유할 수 있습니다. 검색어를 띄어 쓰면 모든 단어가 포함된 글을 찾습니다. 새 주제는 글을 추가하고 빌드하면 필터에 자동으로 나타납니다.

## GitHub Pages

`.github/workflows/astro.yml`이 `main` 또는 `master` 푸시 시 검사·빌드 후 GitHub Pages에 배포합니다. GitHub 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정해야 합니다. 로컬 변경만으로 배포되지는 않습니다.

배포 도메인은 `astro.config.mjs`의 `site`, `src/lib/content.mjs`의 `site.url`, `public/robots.txt`에 설정되어 있습니다. 다른 도메인으로 변경하면 세 곳을 함께 수정하세요.

## 라이선스

기존 Mediumish 테마의 MIT 라이선스는 `LICENSE.txt`에 보존되어 있습니다.

## 디자인

전체 사이트에 짙은 녹색과 라임색을 사용하며, 긴 본문과 댓글은 밝은 읽기 영역으로 구분합니다. `tokens.css`에서 색·서체·여백을, `src/styles/global.css`와 `src/styles/site-pages.css`에서 반응형 레이아웃과 본문·표·도구 스타일을 관리합니다. 공통 디자인 기준은 `DESIGN.md`를 참고하세요.

### Scrollcraft 홈

`nateherkai/scroll-craft` 스킬을 적용한 스크롤 연출이 홈에 포함됩니다. 홈 전용 스타일/동작은 `src/styles/scroll-home.css`와 `src/scripts/scroll-home.ts`입니다. 브리프는 `scrollcraft/builds/daily-on/BRIEF.md`, 검증 이미지와 보고서는 같은 폴더의 `verification/`에 있습니다. 스킬 엔진을 수정하지 않고 사용하며 모바일·감소된 움직임·JavaScript 없는 환경에 별도 표시를 제공합니다.


## 댓글 (Remark42)

글 하단의 `src/components/Comments.astro`가 공통 Remark42 서버에 연결합니다.

- 서버: `https://api.aidaon.com/remark42`, 사이트 ID: `blog`
- 글의 정식 URL(`https://blog.aidaon.com/slug/`)을 댓글 식별자로 사용합니다. 미리보기 주소와 검색 문자열은 댓글을 나누지 않습니다.
- 닉네임 익명 댓글, GitHub 로그인과 아바타, 한국어 UI를 지원합니다.
- 댓글 불러오기를 누르기 전에는 외부 댓글 스크립트를 요청하지 않습니다.
- 기존 giscus 설정은 `src/data/giscus.json`에 복구용으로 보존했습니다. 2026-11-24 전환 점검 당시 Discussions는 0건이었습니다.
- 서버 운영 구성은 `shared-services/deploy/remark42/`에서 관리합니다. 비밀키와 DB는 Git에 넣지 않습니다.

사이트 변경은 GitHub Actions 배포가 성공한 뒤 공개 사이트에 반영됩니다.

## Metis 개발 미리보기

Tailscale에 연결한 기기에서 http://metis.aidaon.com:8440/ 으로 접속합니다.
실행: `npm run dev -- --host 0.0.0.0 --port 8440`.
정식 사이트 주소는 `https://blog.aidaon.com`을 유지합니다.
