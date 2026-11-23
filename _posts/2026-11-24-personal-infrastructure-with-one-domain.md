---
layout: post
title: "도메인 하나로 개인 인프라 정리하기: aidaon.com 구축 기록"
date: "2026-11-24T00:00:00+09:00"
author: picsen
categories: [tutorial]
tags: [도메인, GitHub Pages, Cloudflare, Cloudflare Tunnel, Synology, DNS, 개인인프라, AI]
description: "Porkbun에서 구입한 도메인 하나로 블로그, 프로젝트 사이트, NAS와 개인 서버의 주소를 정리한 과정과 막혔던 점을 기록합니다."
ai_assisted: true
updated_at: "2026-11-24T03:20:02+09:00"
---

**작성 기준일: 2026년 11월 24일**

> **AI 활용 안내**  
> 인프라 구성은 Claude Code와 ego lite 브라우저 자동화를 활용해 진행했습니다. 로그인·결제·비밀번호 입력은 사람이 직접 담당했습니다. 이 글은 그 작업 기록을 바탕으로 AI의 도움을 받아 정리한 개인 구축기입니다. 계정 정보와 내부 주소는 공개하지 않습니다.

## 왜 도메인부터 정리했나

사이드 프로젝트가 늘어나니 블로그, 정적 사이트, NAS, 개인 서버 서비스의 주소가 제각각이었습니다. 이번에는 개인 도메인 하나를 기준으로 주소를 정리했습니다. 회사 자산과도 구분할 수 있도록 회사 도메인이 아닌 개인 도메인을 사용했습니다.

결과적으로 도메인 등록은 Porkbun, DNS 관리는 Cloudflare로 나눴습니다. 정적 사이트는 GitHub Pages에, NAS는 기존 접속 구성을 유지한 채 별도 주소에, 개인 서버 서비스는 Cloudflare Tunnel에 연결했습니다. 새로 드는 비용은 도메인 1년 등록비 $11.81입니다.

## 전체 구조

여기서 DNS는 주소를 연결하는 역할이고, 실제 서비스를 제공하는 곳은 GitHub Pages·NAS·개인 서버로 나뉩니다.

```text
aidaon.com — Porkbun에 등록, Cloudflare에서 DNS 관리
│
├── GitHub Pages
│   ├── aidaon.com          준비 중 스튜디오 랜딩
│   ├── blog.aidaon.com     기존 블로그
│   ├── etf.aidaon.com
│   ├── adfree.aidaon.com
│   ├── mobileui.aidaon.com
│   └── effects.aidaon.com
│
├── Synology NAS
│   └── nas.aidaon.com → DDNS → NAS
│       DNS-01 인증서 발급·자동 갱신
│
├── Cloudflare Tunnel → 개인 서버(Mac)
│   ├── showcase.aidaon.com
│   ├── agora.aidaon.com
│   └── api.aidaon.com
│
└── 메일: Porkbun 포워딩용 MX·SPF 유지
```

도메인을 등록한 업체와 DNS를 관리하는 업체가 같을 필요는 없었습니다. 주소를 한곳에 모으면서도 서비스별 배포 위치는 그대로 나눌 수 있었습니다.

## 1. Porkbun에서 도메인 구입

aidaon.com은 .com 블랙프라이데이 기간에 1년 $11.81로 등록했습니다. WHOIS 개인정보 보호와 SSL이 무료로 포함된 조건이었습니다. 이 금액은 이번 등록 비용이며, 다음 해 연장 요금을 확정하는 값은 아닙니다.

회원가입에 필요한 주소는 도로명주소 안내시스템의 영문 변환을 이용했습니다. 해외 결제 수수료가 청구 국가 설정으로 달라지는지도 확인했는데, 기준은 청구 국가가 아니라 카드사와 결제 통화였습니다.

등록 후에는 Porkbun의 기본 주차 페이지용 ALIAS와 와일드카드 CNAME 레코드를 삭제했습니다. 이후 사용할 사이트에 맞춰 레코드를 구성하기 위한 정리였습니다.

## 2. GitHub Pages에 사이트별 주소 연결

<span id="www-redirect"></span>

처음에는 루트 도메인에 GitHub Pages용 A 레코드 4개와 AAAA 레코드 4개, www에는 CNAME을 설정했습니다. 기존 블로그는 blog.aidaon.com으로 옮겼고, 예전 github.io 주소에서는 새 주소로 자동 이동하게 됐습니다.

루트 aidaon.com에는 새 저장소에서 만든 ‘준비 중’ 스튜디오 랜딩을 배포했습니다. 프로젝트 사이트도 etf, adfree, mobileui, effects 서브도메인으로 각각 분리했습니다.

루트를 대표 주소로 지정해 www 요청은 루트로 301 이동합니다. 실제 이동과 브라우저의 표시 생략 차이는 [www가 주소창에서 사라져 보이는 이유](/why-www-disappears-from-address-bar/)에 따로 정리했습니다.

프로젝트 Pages의 주소가 블로그 아래로 따라가고 서브도메인 이전 후 화면이 깨진 문제는 빌드 경로를 수정해 해결했습니다. → [트러블슈팅 1 참고](#troubleshooting-pages)

legacy 방식의 브랜치 배포에서는 도메인 지정 시 GitHub이 CNAME 파일을 자동 커밋해 로컬에서 pull이 필요했습니다. 이 경험을 다른 배포 방식에 그대로 적용하지는 않았습니다. 무료 플랜 Pages는 공개 저장소에서 사용하도록 구성했습니다.

## 3. 저장소를 공개하기 전에 점검

비공개였던 효과 실험 저장소를 공개하기 전에는 현재 파일뿐 아니라 커밋 이력의 비밀 값, 라이선스와 내부 호스트명을 점검했습니다.

이 과정에서 커밋 작성자에 회사 이메일이 남아 있는 문제를 발견했습니다. git filter-repo로 작성자 이메일을 GitHub noreply 주소로 일괄 변경한 뒤 공개했습니다. 실제 주소나 계정 정보는 이 글에 싣지 않습니다.

이후 개인 프로젝트 폴더의 `git user.email`을 noreply로 고정하는 것을 운영 원칙으로 삼았습니다. GitHub의 ‘Block command line pushes that expose my email’ 설정도 함께 확인해야 합니다. 작성자 이메일이 공개를 막도록 설정된 주소로 남아 있으면 푸시가 차단될 수 있기 때문입니다.

## 4. NAS에 별도 주소와 인증서 적용

nas.aidaon.com은 CNAME으로 기존 Synology DDNS에 연결했습니다. 인증서 발급과 갱신 스크립트 실행 오류는 DNS-01 전환과 실행 경로 변경으로 해결했습니다. → [트러블슈팅 2 참고](#troubleshooting-nas)

자동 갱신은 DSM 작업 스케줄러에서 root 권한으로 매일 acme.sh를 실행하는 구성입니다. Cloudflare API 토큰은 해당 도메인의 DNS 편집 권한으로 제한했습니다. 갱신한 인증서는 `synology_dsm` 배포 훅으로 적용하며, 임시 관리자 방식을 사용해 관리자 비밀번호를 저장하지 않았습니다.

## 5. DNS 관리를 Cloudflare로 이전

개인 서버에도 같은 도메인의 주소를 붙이려 했지만 Tailscale Funnel에서는 커스텀 도메인을 사용할 수 없었습니다. Cloudflare Tunnel을 사용하기 위해 DNS 관리를 Cloudflare로 옮겼습니다.

기존 레코드는 자동 스캔에만 맡기지 않고 BIND zone 파일로 옮겼습니다. 자동 스캔에서 서브도메인이 누락될 위험을 줄이기 위해서였습니다. 메일 전달에 쓰던 Porkbun MX·SPF도 유지했습니다.

GitHub Pages와 NAS 레코드는 DNS only, 즉 회색 구름으로 유지했습니다. 이번 구성에서는 GitHub 인증서 갱신과 NAS의 비표준 포트 사용 조건을 고려한 선택이었습니다.

DNSSEC이 꺼져 있는지 확인한 뒤 Porkbun에서 네임서버를 변경했고, 수십 분 내 Cloudflare 상태가 Active가 됐습니다. 등록은 Porkbun에 유지하고 DNS 관리만 옮긴 것입니다.

## 6. 개인 서버를 Cloudflare Tunnel로 공개

기존에는 Tailscale Funnel 주소로 공개하던 서비스를 showcase, agora, api.aidaon.com으로 나눴습니다. 터널은 하나를 사용하고 서브도메인별로 개인 서버의 서비스에 연결했습니다. 별도의 포트 개방 없이 공개하는 구성입니다.

주소를 연결한 뒤에는 앱 설정도 바꿨습니다. 공개 주소, OAuth 콜백과 웹훅 URL을 새 주소에 맞췄습니다. 도메인이 바뀌면서 패스키도 다시 등록해야 했습니다. 패스키의 RP ID, 즉 인증 대상 사이트를 식별하는 값이 도메인에 묶이기 때문입니다.

DNS 변경만으로 모든 이전 작업이 끝나지는 않았습니다. 브라우저에 보이는 주소뿐 아니라 로그인과 외부 연동에 등록된 주소까지 함께 살피는 일이 필요했습니다.

새 서브도메인이 집에서만 열리지 않은 문제는 DNS 서버별 응답을 비교해 네거티브 캐시로 진단했습니다. → [트러블슈팅 3 참고](#troubleshooting-dns)

## AI 에이전트와 역할을 나눈 방식

Claude Code와 ego lite 브라우저 자동화를 함께 사용해 설정 작업을 진행했습니다. 사람이 담당한 단계와 에이전트가 관여한 범위는 다음처럼 구분했습니다.

<div class="table-scroll" tabindex="0" role="region" aria-label="사람과 AI 에이전트의 작업 역할">

| 담당 | 작업 범위 |
|---|---|
| 사람 | 로그인, 결제, 비밀번호 입력 |
| AI 에이전트 | 로그인 이후 설정 화면 조작과 구성·점검 작업을 보조 |

</div>

여기서는 개별 클릭을 모두 재현하기보다, 실제 완성된 연결 구조와 막혔던 지점을 중심으로 기록했습니다. 비밀 값이나 관리자 접근 정보는 설명을 위해서도 공개하지 않았습니다.

## 트러블슈팅

<div class="table-scroll" tabindex="0" role="region" aria-label="개인 인프라 구축 트러블슈팅 요약">

| 문제 | 원인 | 해결 |
|---|---|---|
| 프로젝트 주소가 블로그 아래로 이동하고 CSS·JS가 404 | 사용자 사이트의 도메인 적용과 기존 프로젝트 base 경로 | 서브도메인 분리, base를 `/`로 수정 후 재배포 |
| NAS 인증서 발급 불가·갱신 스크립트 실행 거부 | HTTP 인증에 필요한 포트 차단, `/tmp`의 noexec 설정 | DNS-01 인증, 볼륨 안에서 풀고 `sh`로 실행 |
| 새 서브도메인이 집에서만 NXDOMAIN | 통신사 DNS에 남은 ‘이름 없음’ 응답 캐시 | 캐시 만료 대기 또는 공유기 WAN DNS 변경 |

</div>

<h3 id="troubleshooting-pages">1. 프로젝트 사이트가 blog 주소 아래로 이동하고 화면이 깨짐</h3>

**증상:** 사용자 사이트에 커스텀 도메인을 걸자 다른 프로젝트 Pages도 `blog.aidaon.com/<repo>/`로 이동했습니다. 별도 서브도메인으로 옮기니 CSS·JS 요청이 404로 실패했습니다.<br>
**원인:** 주소가 따라간 것은 사용자 사이트의 커스텀 도메인 적용에 따른 동작이었고, 화면이 깨진 것은 빌드 base가 `/<repo>/`로 고정돼 있었기 때문입니다.<br>
**해결:** base를 `/`로 바꿔 배포한 뒤 도메인을 지정했습니다. 인증서가 발급될 때까지 수 분에서 1시간 정도 기다린 뒤 Enforce HTTPS를 켰습니다.<br>
상대 경로만 사용하는 정적 사이트는 base 수정 없이 바로 이전할 수 있었습니다.<br>
**교훈:** 도메인 연결과 앱의 리소스 기준 경로를 함께 확인해야 합니다. 주소가 열려도 CSS·JS가 정상적으로 로드되는지까지 점검합니다.

<h3 id="troubleshooting-nas">2. NAS 인증서 발급 불가와 Permission denied</h3>

**증상:** DSM 기본 Let's Encrypt 인증서 발급이 실패했고, 자동 갱신 스크립트의 첫 실행에서는 `Permission denied`가 발생했습니다.<br>
**원인:** 기본 발급은 HTTP 인증을 사용하는데 필요한 포트가 닫혀 있었습니다. 스크립트 실행은 DSM의 `/tmp`가 실행 금지인 noexec 환경이어서 막혔습니다.<br>
**해결:** DNS 레코드로 소유를 증명하는 DNS-01 방식으로 발급하고 DSM에 인증서를 가져왔습니다.<br>
역방향 프록시 규칙에서 nas.aidaon.com 호스트에만 새 인증서를 지정해 기존 Synology 제공 주소는 유지했습니다.<br>
스크립트는 볼륨 안에서 풀고 `sh`로 실행했습니다. 작업 스케줄러의 ‘출력 결과 저장’을 켜 로그로 원인을 확인했습니다.<br>
**교훈:** 인증서 발급 실패와 스크립트 실행 실패는 원인이 다릅니다. 필요한 인증 방식과 실행 경로의 제한을 나눠 확인합니다.

<h3 id="troubleshooting-dns">3. 새 서브도메인이 집에서만 안 열림: DNS 네거티브 캐시</h3>

**증상:** showcase·agora·api.aidaon.com은 외부에서 정상이지만 집 공유기를 거치면 NXDOMAIN, 즉 ‘해당 이름 없음’ 응답이 나왔습니다. 기존 서브도메인은 정상이었습니다.<br>
**진단:** 같은 이름을 DNS 서버별로 조회하니 아래처럼 결과가 달랐습니다. 공유기 WAN DNS는 ‘ISP 자동’이었고, DNS Rebind 보호와 DNSSEC은 꺼져 있어 이번 원인이 아니었습니다.<br>
**원인:** 레코드를 만들기 전에 조회한 ‘없음’ 응답이 통신사 DNS에 남아 있었습니다. 당시 확인한 Cloudflare SOA의 네거티브 TTL은 1,800초, 즉 30분이었으며 1차·2차 서버의 캐시 상태가 달랐습니다.<br>
**해결:** 캐시 만료를 기다리거나 공유기 WAN DNS를 1.1.1.1과 8.8.8.8로 바꿨습니다. ASUS 설정 경로는 WAN → 인터넷 연결 → DNS 서버 ‘할당’ → 수동 설정 → 저장 → 적용입니다. 같은 화면에서 ‘ISP’를 선택하면 되돌릴 수 있습니다.<br>
PC 캐시도 아래 명령으로 비울 수 있습니다. 다만 PC의 캐시 삭제만으로 통신사 DNS에 남은 캐시까지 지워지지는 않습니다.<br>
**교훈:** 레코드를 먼저 만들고 조회합니다. 확인할 때는 1.1.1.1·8.8.8.8을 직접 지정하거나 DoH(DNS 질의를 HTTPS로 보내는 방식)를 사용합니다.

다음은 공개 DNS 서버별 조회 명령입니다. `<공유기>`는 실제 주소를 싣지 않은 자리표시자이므로 그대로 실행하는 명령이 아닙니다.

```text
nslookup showcase.aidaon.com <공유기>     → NXDOMAIN
nslookup showcase.aidaon.com 168.126.63.1 → NXDOMAIN (KT 1차)
nslookup showcase.aidaon.com 168.126.63.2 → 정상 (KT 2차)
nslookup showcase.aidaon.com 1.1.1.1      → 정상
nslookup showcase.aidaon.com 8.8.8.8      → 정상
```

Windows에서 PC의 DNS 캐시를 비우는 명령입니다.

```shell
ipconfig /flushdns
```

macOS에서는 다음 명령을 사용합니다. 관리자 비밀번호는 본인이 직접 입력합니다.

```shell
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

## 이번 구성의 비용

<div class="table-scroll" tabindex="0" role="region" aria-label="개인 인프라 구성 서비스 비용">

| 항목 | 이번 구성에 적용한 비용 |
|---|---|
| aidaon.com 도메인 1년 등록 | $11.81 |
| GitHub Pages | 0원 |
| Cloudflare 무료 플랜·Tunnel | 0원 |
| Let's Encrypt 인증서 | 0원 |

</div>

사용한 서비스 요금은 도메인 등록비 외에 0원입니다. 표는 기존 NAS와 Mac의 구입비나 운영비를 계산한 총소유비용 표가 아닙니다. 도메인 연장가와 실제 카드 청구액도 이번 등록 금액과 구분해서 확인할 항목입니다.

## 다음 할 일

- ‘준비 중’ 스튜디오 랜딩을 정식 페이지로 만듭니다.
- 대표 메일을 Gmail과 연동하는 구성을 검토합니다.
- 기존 Funnel 공개를 종료합니다.
- 제품이 늘어나면 제품별 서브도메인을 확장합니다.

도메인 하나로 모든 서비스를 같은 곳에 옮긴 것은 아닙니다. 각 서비스의 운영 위치는 유지하면서, 외부에 보여 주는 주소와 관리 역할을 정리했습니다. 다음에는 이 주소들 위에 실제 콘텐츠와 제품 페이지를 채울 차례입니다.

> **기록 범위**  
> 이 글은 제공된 구축 기록을 정리한 사례이며, 모든 환경에 그대로 적용하는 설치 매뉴얼은 아닙니다. 요금과 서비스 정책은 달라질 수 있습니다. 인증서 갱신과 접근 권한 설정은 각자의 운영 환경에서 확인해야 합니다.
