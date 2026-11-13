---
layout: post
title: "Orca의 Project와 Workspace, 왜 폴더 구조와 다를까?"
date: "2026-11-13T17:06:00+09:00"
author: picsen
categories: [tutorial]
tags: [Orca, workspace, Git, AI]
description: "폴더 이름 Workspaces와 Orca의 Project·Workspace는 서로 다른 분류입니다. Worktree, Folder Workspace, 부모 연결과 Group까지 구분해 봅니다."
ai_assisted: true
updated_at: "2026-11-13T17:06:00+09:00"
last_verified_at: "2026-11-13T17:06:00+09:00"
review_after: "2026-12-13"
review_status: verified
---

**마지막 갱신·자료 확인: 2026년 11월 13일 17:06 KST**  
**확인 범위: 공개 영문 문서·GitHub 원문, 설치된 Orca 1.4.257의 CLI 가이드와 한국어 번역 리소스.**

> **AI 활용 안내**  
> 이 글은 AI 에이전트(Codex)를 활용해 공식 자료와 설치된 제품의 안내를 확인하고 작성했습니다. 제품의 실제 용어, 버전에 따른 차이, 글쓴이의 해석을 구분했습니다. 아래 폴더와 작업 이름은 설명을 위한 가상 예시입니다.

개발 폴더를 다음처럼 정리했다고 해봅시다.

```text
개발 폴더/
└── Workspaces/
    ├── ReadingApp/
    └── PersonalBlog/
```

여기서는 Workspaces 폴더 안에 여러 프로젝트가 있습니다. 그런데 Orca에서는 프로젝트를 선택한 뒤 워크스페이스를 만듭니다. “작업 공간 안에 프로젝트가 있어야 하는 것 아닌가? 한국어 번역이 반대가 된 걸까?”라는 질문이 생길 만합니다.

**이 경우에는 오역으로 계층이 뒤집힌 것이 아니라, 같은 단어를 서로 다른 분류에 사용하고 있습니다.** 디스크의 보관 구조와 앱이 관리하는 작업 환경을 나눠 보면 이해하기 쉽습니다.

## 물리 폴더와 앱의 분류는 다르다

<div class="table-scroll" tabindex="0" role="region" aria-label="폴더 구조와 Orca 용어 비교">

| 용어 | 이 글에서 이해할 의미 | 혼동하기 쉬운 점 |
|---|---|---|
| 디스크의 `Workspaces/` | 사용자가 이름 붙인 보관 폴더 | 이름만으로 Orca의 Workspace가 되지는 않음 |
| Project | Orca에 등록해 관리하는 저장소·코드의 단위 | 디스크의 상위 폴더라는 뜻은 아님 |
| Workspace | 그 코드를 다루는 작업 환경 | 에이전트·터미널·편집기·브라우저 등의 작업 상태를 함께 생각하면 편리 |
| Git Worktree | 같은 저장소를 별도 경로에 체크아웃하는 Git 기능 | Workspace라는 화면 개념과 항상 일대일로 같다고 단정할 수 없음 |
| Parent workspace | 작업 공간 사이의 부모 연결 역할 | 별도의 작업 공간 종류나 상위 프로젝트가 아님 |
| Group | 여러 프로젝트를 묶어 분류하는 단위 | Git 저장소나 물리 폴더 이동 자체를 뜻하지 않음 |

</div>

물리 폴더는 **코드를 어디에 보관했는가**, 앱의 Workspace는 **어떤 환경에서 어떤 작업을 진행하는가**를 설명한다고 생각할 수 있습니다. 다른 IDE의 Workspace 정의까지 모두 같다고 일반화할 필요는 없습니다.

## 영어 원문도 Project 아래 Workspace를 사용한다

공식 [Worktrees 문서](https://orca.dev/docs/model/worktrees)의 Sidebar layout 절에는 다음 문장이 있습니다.

> “The sidebar groups worktrees by project by default”

기본 사이드바가 프로젝트별로 작업 트리를 묶는다는 설명입니다. 같은 문서의 Create dialog 절도 **Create Workspace 화면에서 Project를 선택**하도록 안내합니다. 영어 원문부터 이 관계를 사용하므로 한국어 번역만 고쳐서 뒤집을 문제는 아닙니다.

문서 첫머리의 “Orca is worktree-native.”라는 표현은 Git 작업 트리를 중심으로 한 제품 구성을 강조합니다. [GitHub의 문서 원문](https://github.com/stablyai/orca/blob/main/docs/site/content/docs/model/worktrees.mdx)에서도 이 설명과 Project 선택 구조를 확인할 수 있습니다.

이를 바탕으로 Orca는 작업별 환경을 나누는 데 무게를 둔 모델이라고 **해석할 수 있습니다**. 다만 개발자가 왜 이 이름을 골랐는지 직접 확인한 것은 아닙니다.

## Workspace가 언제나 새 Worktree인 것은 아니다

작업을 나누는 일반적인 모습을 단순화하면 다음과 같습니다.

```text
Orca의 프로젝트: ReadingApp
├── 메인 체크아웃에서 하는 작업
├── 검색 기능 개선 작업 공간
└── 오류 수정 작업 공간

프로젝트 그룹: 개인 서비스
├── ReadingApp 프로젝트
└── PersonalBlog 프로젝트
```

이 그림은 앱의 분류 예시이며 실제 폴더 위치나 Git 분기 그림이 아닙니다.

메인 체크아웃을 다루는 작업 공간도 있고, 공식 문서에는 **Folder Workspace**도 등장합니다. Multi-repo project groups & folder workspaces 절은 여러 저장소를 묶은 그룹의 상위 폴더 수준에서 작업하는 흐름을 설명합니다. 따라서 “Workspace를 만든다 = 항상 새 Git Worktree를 만든다”는 등식은 피해야 합니다. 세부 지원은 사용 중인 버전에서 확인하는 편이 안전합니다. [공식 문서](https://orca.dev/docs/model/worktrees)

## 부모·자식 연결은 폴더 이동이나 Git 분기가 아니다

사이드바에서 작업 공간이 다른 작업 공간 아래에 보이더라도, 그것만으로 디스크의 폴더가 이동하거나 Git 브랜치가 그 부모에서 만들어졌다고 볼 수 없습니다.

- **Parent workspace:** Orca의 작업 공간 연결·표시 관계.
- **Branch from / 시작 기준:** 새 작업의 Git 출발점.
- **파일 경로:** 실제 체크아웃이나 작업 폴더의 위치.

세 가지는 따로 확인해야 합니다. 부모로 연결되었다는 이유만으로 파일이 분리되거나 변경 충돌이 방지되는 것도 아닙니다.

여기에는 버전과 조작 경로의 차이가 있습니다. 확인한 웹 문서의 생성 화면 설명은 **같은 저장소**의 부모 선택을 안내합니다. 반면 설치된 **Orca 1.4.257**에서 `orca skills get orca-cli --json`으로 읽은 가이드는 **부모와 자식이 다른 프로젝트여도 연결 가능**하며, 작업 트리끼리는 같은 실행 호스트여야 한다고 명시합니다. 따라서 생성 화면의 선택지와 CLI의 연결 범위를 항상 같다고 단정하면 안 됩니다.

CLI 가이드는 부모 연결과 Git 출발점 선택도 구분합니다. 공개 [Orca CLI 원문](https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md)의 Worktrees·Lineage rules 부분과, 사용 중인 설치 버전의 안내를 함께 확인하면 좋습니다. Folder Workspace의 연결 지원은 웹 문서에 별도로 설명되어 있으므로 일반 작업 트리의 호스트 조건을 모든 종류에 그대로 적용하지 않습니다.

이 글에서는 연결 기능을 새로 실행해 프로젝트를 이동하거나 생성하지 않았습니다. 해당 범위는 문서와 설치 버전의 가이드를 확인한 결과입니다.

## 번역은 혼동을 더할 수 있다

설치된 1.4.257의 한국어 리소스에서는 Workspace·Worktree 관련 UI에 **‘워크스페이스’와 ‘작업 공간’** 표현이 함께 쓰입니다. 예를 들어 만들기 항목에는 ‘워크스페이스’, 이동 목록에는 ‘작업 공간’이라는 표현이 확인됐습니다.

영문 문서도 Workspace와 Worktree를 함께 사용합니다. 번역 표현의 통일성은 별도로 살펴볼 수 있지만, **Project 아래 Workspace라는 구조 자체는 한국어 오역의 결과가 아닙니다.** 설치 버전의 번역을 확인한 것이며, 모든 버전과 모든 화면의 번역이 같다는 뜻은 아닙니다.

## 개인 프로젝트에서는 이렇게 이름 붙이면 편하다

다음은 제품의 강제 규칙이 아니라 작업을 구분하기 위한 제안입니다.

<div class="table-scroll" tabindex="0" role="region" aria-label="프로젝트와 작업 공간 이름 예시">

| 대상 | 이름 예시 | 이름에 담을 정보 |
|---|---|---|
| 보관 폴더 | `dev/` 또는 `Workspaces/` | 개인의 디스크 정리 기준 |
| Project | `ReadingApp` | 관리하는 제품·저장소 |
| Workspace | `검색 개선`, `로그인 오류 조사` | 지금 진행하는 작업 |
| Group | `개인 서비스`, `학습 실험` | 여러 프로젝트를 묶는 목적 |
| 부모 연결 | `로그인 개선` 아래 `원인 조사` | 관련 작업을 함께 찾기 위한 관계 |

</div>

에이전트에 요청할 때도 “프로젝트는 ReadingApp, 작업 공간 이름은 검색 개선, Git 시작점은 기본 브랜치, 부모 연결은 없음”처럼 나누어 말하면 의도가 분명해집니다. **사이드바 배치, Git 출발점, 실제 경로를 각각 확인하는 습관**이 용어 하나에 모든 의미를 담으려는 것보다 실용적입니다.

## 확인한 자료와 갱신 기준

- [Orca 공식 Worktrees 문서](https://orca.dev/docs/model/worktrees): 생성 화면, 사이드바, 메인 체크아웃·Folder Workspace 관련 설명.
- [GitHub Worktrees 문서 원문](https://github.com/stablyai/orca/blob/main/docs/site/content/docs/model/worktrees.mdx): 영문 용어와 문서 구조.
- [GitHub Orca CLI 가이드](https://github.com/stablyai/orca/blob/main/skill-guides/orca-cli.md): 관리 단위·부모 연결 관련 설명.
- 설치된 Orca **1.4.257**의 CLI 가이드와 한국어 번역 리소스: 2026-11-13 직접 확인.

공개 사이트, GitHub의 `main`, 설치된 제품은 같은 시점의 내용을 보장하지 않습니다. 서로 다른 안내는 하나로 합쳐 단정하지 않고 확인한 범위를 적었습니다. 다음 검토 목표는 **2026-12-13**이며 자동 실행 예약은 아닙니다. 이후에는 버전과 관련 절의 변경 여부를 다시 확인하는 것이 좋습니다.

## 면책 및 변경 이력

AI를 활용한 용어 정리이며 Orca 개발사의 공식 입장이나 모든 버전의 동작 보증은 아닙니다. 실제 생성·이동·삭제 전에는 설치 버전의 도움말과 확인 창을 우선 확인해 주세요. 문서 해석에 오류나 변경 사항이 있으면 댓글로 알려주세요.

- **2026-11-13 17:06 KST:** 최초 작성. 물리 폴더와 앱 관리 모델, 번역 혼용, Workspace와 Worktree의 예외, 부모 연결 범위를 구분했습니다.
