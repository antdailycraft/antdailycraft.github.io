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


## 댓글과 공감 (giscus)

글 본문 하단의 `src/components/Comments.astro`가 GitHub Discussions 기반 댓글과 공감을 표시합니다. 연결 설정은 `src/data/giscus.json`에 있으며 공개 저장소·카테고리 식별자만 포함합니다. 비밀 토큰은 사용하지 않습니다.

- 저장소: `antdailycraft/antdailycraft.github.io`, Discussions 활성화 필요.
- 카테고리: `Announcements`. giscus 앱을 이 저장소에 설치해야 읽기·쓰기가 작동합니다.
- 설치: https://github.com/apps/giscus/installations/new 에서 저장소 소유자 계정으로 `Only select repositories` → `antdailycraft.github.io` 선택.
- 글의 고정 경로(`/slug/`)를 `specific` 매핑 값으로 사용하므로 미리보기 호스트나 글 제목이 바뀌어도 같은 댓글로 연결합니다. 글 경로를 바꾸면 댓글 연결도 바뀝니다.
- `giscus:backlink`는 공개 사이트의 정식 주소로 지정해 미리보기 주소가 댓글의 원문 링크로 남지 않게 합니다.
- 한국어, 밝은 테마, 공감 활성화, 상단 입력창, 지연 로딩 설정입니다.
- 댓글과 공감은 GitHub에 공개 저장되며 작성에 GitHub 로그인이 필요합니다. 실제 댓글로 테스트할 때도 GitHub에 게시됩니다.

댓글 앱 설치와 사이트 배포는 별도 절차입니다. 사이트 변경은 위 GitHub Actions 배포 작업이 성공한 뒤 공개 사이트에 반영됩니다.
