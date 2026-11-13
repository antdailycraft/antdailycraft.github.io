# Daily Daily On · Scrollcraft

## Creative authority and evidence
사용자 요청: “https://github.com/nateherkai/scroll-craft 이스킬을 적용하여 화려하게 꾸며주세요”. 기존 Astro 블로그, 콘텐츠, 검색, 링크와 도구를 보존한다. 아래 연출은 이 요청에 대한 작성자의 제안·구현 판단이며 사용자 발언으로 꾸미지 않는다. 별도 생성 이미지나 유료 서비스는 사용하지 않는다.

## Eight topics
1. 분위기: 작성 결정. 몰입감, 실험적인 타이포그래피, 짙은 녹색과 라임, 선명한 사진.
2. 순서: 기존 홈 정보 구조를 기반으로 소개 → 추천 글 → 주제 탐색 → 전체 기록 → 다음 행동.
3. 에너지: 강한 첫인상 → 조용한 읽기 진입 → 추천 글의 큰 전환 → 탐색 → 안정된 독서.
4. 기억할 순간: 스크롤을 움직이면 흩어진 기록 조각이 추천 글의 사진과 문장으로 정렬된다.
5. 고유 동작: 실제 글 제목 조각들이 독립적인 깊이에서 한 장의 추천 글로 정리되는 ‘기록 정렬’.
6. 범위: 사용자가 요청한 화려함. 기존 premium-minimal에서 typographic editorial로 확장.
7. 장면: 별도 장면과 자연스러운 문서 흐름. 지리적 여행 콘텐츠가 아니므로 연속 비행은 사용하지 않음.
8. 자산: 기존 코드 모니터 사진, 실제 글 제목과 코드 문장. 외부 생성 없음.

## Journey and feeling curve (before score)
- 호기심: 커다란 한글과 사진·글 조각의 깊이.
- 집중: 첫 화면 끝의 짧은 한 문장으로 시각적 소음을 낮춘다.
- 발견 (peak): 조각이 추천 글로 정렬되고 사진이 열리며 실제 글 읽기 링크가 남는다.
- 선택: 주제가 가로로 펼쳐지고 선택하면 기존 카테고리로 이동한다.
- 편안함: 밝은 바탕에 검색과 전체 글 목록.
- 의욕: 기록을 다시 읽거나 직접 쓸 때 쓸 도구로 이동하는 큰 링크로 끝난다.

Peak / tell-someone: “흩어진 개발 메모가 내 스크롤을 따라 한 편의 글로 정리되는 블로그.”
빈 화면 대기는 의도하지 않는다. 의미 있는 텍스트는 항상 보이고 별도 스크롤 안내는 두지 않는다.

## Grammar and alternatives
Chaptered editorial. Home has strong independent chapters with a readable archive, no full-page video. Filmic one-shot and continuous world require irrelevant footage/geography; live surface is not the blog task; typographic poster alone loses photography; gallery loses reading order; split stage forces the archive into a fixed panel; rhythmic cutlist is too fast for Korean reading.

## Score
| Beat | Device | Span |
|---|---|---|
| 소개 | parallax + pointer depth | natural flow |
| 집중 | kinetic typography | short flow |
| 추천 글 peak | pin + reveal + bespoke memo alignment | 2.3 desktop, flow mobile |
| 주제 | pan | 2 desktop, native rail mobile |
| 기록 | stagger once | natural flow |
| 마무리 | pointer response, held link | short flow |

## Fingerprint
첫 Scrollcraft 빌드. 기존 레지스트리에 비교 행 없음. Scrollcraft engine 파일은 그대로 복사하고 수정하지 않는다.

## Verification plan
Desktop 1440×900, phone 390×844, compact 360×640, reduced motion, JavaScript off. Sample hero/peak/rail intermediate scroll positions, keyboard, search/filter, no horizontal document overflow. Actual phone hardware is outside this run.

## Verification findings and feel-check
Opening → curiosity; quiet type → focus; initial peak → disconnected (photo stayed away while text scrolled out); subjects → choice; archive → calm; close → resolve.
The first desktop screenshot strip exposed a `position: relative` rule overriding the engine sticky stage. Fixed in site CSS, not in the engine. The replacement desktop-final strip supersedes desktop for the peak. The resolved peak now keeps photo, text and sorting memos together while the image opens. Intended curve remains unchanged.
Keyboard rail initially did not keep the focused item in view reliably. Replaced custom scroll calculations with native horizontal focus scrolling while focused. Search, category filter, no-JS text/links, image loading and mobile document overflow checked. Automated samples report no dead scroll or cue contrast failures; that does not certify all text contrast. Mobile hardware and assistive screen-reader software were not tested.
