---
layout: post
title: "Tailscale Funnel에서 Cloudflare Tunnel로: 맥 미니 서비스에 내 도메인 연결하기"
date: "2026-11-24T00:00:00+09:00"
author: picsen
categories: [tutorial]
tags: [Tailscale, Cloudflare, Tunnel, DNS, 패스키, 웹훅]
description: "포트가 붙은 Funnel 주소를 서비스별 도메인으로 옮겼습니다. 내부 Serve는 유지하고 SSO·패스키·웹훅을 점검한 과정, 그리고 DNS 캐시라는 초기 판단을 수정한 기록입니다."
published: false
ai_assisted: true
updated_at: "2026-11-24"
last_verified_at: "2026-11-24"
review_status: partial
---

맥 미니에서 운영하는 서비스를 Tailscale Funnel로 공개해 쓰고 있었다. 주소 하나에 포트를 달리 붙여 서비스에 들어가는 방식이었다. 내 도메인을 마련한 뒤에는 서비스마다 알아보기 쉬운 주소를 붙이고 싶었다.

이번에는 공개 입구를 **Cloudflare Tunnel로 옮기고, Tailscale Serve의 내부 접속은 유지**했다. HTTPS 응답과 로그인은 확인했지만, 다른 PC에서는 주소를 찾지 못하는 일이 이어졌다. 서버가 응답한다는 사실과 모든 사용자가 그 서버의 주소를 알아낸다는 사실은 별개였다.

> **작성 기준과 AI 활용 안내**
>
> 2026년 11월 24일 운영 인계 기록과 공식 문서를 바탕으로 AI의 도움을 받아 정리한 사례다. 글 작성 중 운영 설정을 다시 변경하지는 않았다. 공개 서비스 주소는 실제 운영 도메인인 aidaon.com을 사용했다. 기존 기기 호스트명은 생략하고 터널 식별자는 자리표시자로 바꿨다. 개인 계정, 비밀 값, 원본 화면은 공개하지 않는다. 실제 작업에서 확인한 결과와 원리 설명, 아직 확인하지 못한 부분을 구분한다.

## 포트별 주소에서 서비스별 주소로

먼저 용어를 나눠 보자. **tailnet**은 내 Tailscale 기기들이 속한 사설 네트워크다. **Serve**는 이 네트워크 안에 서비스를 제공하고, **Funnel**은 인터넷 사용자도 접근할 수 있게 공개한다. 확인한 공식 문서에서 Funnel은 tailnet의 `ts.net` 이름과 공개 포트 `443`, `8443`, `10000`을 사용한다. 이번 전환의 이유는 속도 비교가 아니라 **소유한 도메인으로 공개 주소를 정리하기 위해서**였다. [Tailscale Funnel 문서](https://tailscale.com/docs/features/tailscale-funnel), [Serve 문서](https://tailscale.com/docs/reference/tailscale-cli/serve)

아래의 ‘기존 공개 호스트’는 실제 기기 이름을 생략한 표기다. 새 주소는 실제 운영 중인 `aidaon.com`의 서비스별 도메인이다.

<div class="table-scroll" tabindex="0" role="region" aria-label="Funnel에서 Cloudflare Tunnel로 이전한 공개 주소와 로컬 대상">

| 용도 | 이전 공개 입구 | 새 공개 입구 | 맥 안의 대상 |
|---|---|---|---|
| 서비스 소개·로그인 | 기존 공개 호스트의 HTTPS 443 | `https://showcase.aidaon.com` | `127.0.0.1:18400` |
| 커뮤니티 | 기존 공개 호스트의 HTTPS 8443 | `https://agora.aidaon.com` | `127.0.0.1:8130` |
| GitHub 피드백 웹훅 | HTTPS 10000의 `/webhooks/github/feedback` | `https://api.aidaon.com/webhooks/github/feedback` | `127.0.0.1:8111` |

</div>

**공개 포트와 앱의 로컬 포트는 같지 않다.** 예전의 공개 8443은 맥 안의 8130으로 전달됐다. 새 주소는 외부에서 기본 HTTPS 포트 443으로 접속하지만, 앱은 계속 같은 로컬 포트에서 실행된다.

이전 구성에는 별도 문제도 있었다. 공개 10000의 웹훅 경로는 웹훅 입구로 연결됐지만, 기본 `/`는 꺼진 구 서비스의 로컬 3011로 이어져 502를 반환했다. 이를 새 터널 전체의 실패로 해석하거나, 필요 없는 구 서비스를 다시 켜지는 않았다. 포트 하나 안에서도 **경로별 전달 대상**을 확인해야 했다.

연결 구조를 단순화하면 다음과 같다.

```text
이전 공개 경로
인터넷 → Funnel 릴레이 → 맥의 포트·경로별 전달 → 로컬 앱

이후 공개 경로
인터넷 → 서비스별 도메인 → Cloudflare → 터널 → 로컬 앱

유지한 내부 경로
tailnet 기기 → Tailscale Serve → 기존 로컬 앱
```

Cloudflare Tunnel은 맥에서 실행하는 `cloudflared`가 Cloudflare 쪽으로 연결을 만드는 방식이다. 이번에는 공유기에서 새 수신 포트를 열지 않았다. 터널이 연결된다는 것과 앱 이용자가 인증됐다는 것은 다르므로, 앱 로그인과 접근 제어는 계속 필요하다. [Cloudflare Tunnel 개요](https://developers.cloudflare.com/tunnel/), [연결 방식 설명](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)

## DNS 세 개와 터널 하나를 연결했다

이번 작업은 도메인의 DNS 관리가 이미 Cloudflare로 옮겨진 상태에서 시작했다. DNS는 이름을 연결할 주소 정보로 바꿔 주는 체계다. 기존 GitHub Pages·NAS·메일의 MX·SPF 레코드는 건드리지 않고, 터널용 **Proxied CNAME 세 개**를 추가했다. Proxied는 요청이 Cloudflare를 거치도록 하는 설정이다.

터널 설정은 파일로 관리하는 로컬 관리형을 사용했다. 다만 이는 이번 설치 방식이다. 현재 공식 문서는 대부분의 사용 사례에 원격 관리형 터널을 권장하므로, 새 설치에서 로컬 관리형이 언제나 기본 선택이라고 받아들일 필요는 없다. [로컬 관리형 터널 안내](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/)

아래는 실제 운영 도메인과 로컬 전달 대상을 반영한 설정 예시다. `<TUNNEL-UUID>`는 실행 가능한 식별자가 아니며, 실제 자격 증명 파일을 뜻하는 자리표시자다.

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: /etc/cloudflared/<TUNNEL-UUID>.json

ingress:
  - hostname: showcase.aidaon.com
    service: http://127.0.0.1:18400
  - hostname: agora.aidaon.com
    service: http://127.0.0.1:8130
  - hostname: api.aidaon.com
    service: http://127.0.0.1:8111
  - service: http_status:404
```

`ingress`는 요청을 어디로 보낼지 정하는 입구 규칙이다. 마지막 404는 앞의 호스트명과 맞지 않는 요청을 처리한다. 공식 문서도 이런 설정의 마지막에 모든 나머지 요청을 받는 규칙을 요구한다. [설정 파일 문서](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/configuration-file/)

이 규칙만으로 `api.aidaon.com`의 모든 경로가 보호되는 것은 아니다. 해당 호스트로 온 요청은 일단 로컬 8111로 전달된다. **그 뒤의 Caddy가 허용한 웹훅 경로만 내부 API 8110으로 넘기도록** 구성했다. API 전체를 외부에 공개한 것이 아니며, 루트나 허용하지 않은 경로의 GET 404, 서명 없는 웹훅 POST 403은 의도한 거부였다.

## 맥의 상시 실행과 자격 증명 범위

`cloudflared`는 macOS의 **LaunchDaemon**, 즉 시스템이 관리하는 백그라운드 서비스로 등록했다. 이번에 설치된 `cloudflared 2026.3.0`에서는 서비스 설치 후 명시적인 설정 파일 인자가 빠져 있었다. 등록된 `ProgramArguments`를 다음 실행 형태에 맞춰 고친 뒤 정상 동작을 확인했다.

```sh
cloudflared --config /etc/cloudflared/config.yml tunnel run
```

이는 이번 설치에서 확인한 문제와 보완이다. 모든 버전의 설치 도구가 같은 문제를 낸다는 뜻은 아니다. 시스템 서비스에서 연결 네 개를 관찰했고, 사용자 터미널의 시험 프로세스를 종료한 뒤에도 새 주소가 응답했다. **실제 맥 재부팅 후 자동 복구되는지는 시험하지 않았다.**

파일의 역할도 나눴다. 계정 인증서 `cert.pem`은 터널을 관리할 수 있는 범위가 넓고, 터널 JSON 자격 증명은 특정 터널을 실행하는 데 사용된다. 실행 서비스에는 필요한 설정과 해당 터널 자격 증명만 두고 계정 인증서는 복사하지 않았다. [Cloudflare 터널 권한 문서](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/tunnel-permissions/)

이 사례에서는 자격 증명 파일을 Git에서 제외하고 파일 권한을 `0600`, 디렉터리를 `0700`으로 제한했다. 각각 소유자만 읽고 쓸 수 있는 파일, 소유자만 접근할 수 있는 디렉터리라는 뜻이다. 이 글에는 실제 파일 내용이나 터널 식별자를 싣지 않는다.

## 앱 주소만 바꾸면 로그인이 따라올까

주소가 바뀌니 앱의 공개 기준 주소뿐 아니라 **SSO 공급자 주소와 콜백 주소**도 함께 바꿔야 했다. SSO는 한 번 로그인한 계정으로 다른 서비스에 들어가는 흐름이고, 콜백은 외부 로그인 후 앱으로 돌아오는 주소다.

GitHub·Kakao·Naver 개발자 설정에 새 콜백을 추가하고, 전환 중에는 기존 콜백도 유지했다. 저장 후 다시 열어 등록 결과를 확인하고, 앱이 로그인 요청에 넣는 `redirect_uri`가 새 주소인지도 확인했다. 실제 GitHub 로그인과 커뮤니티 SSO는 성공했다. **Kakao·Naver는 설정과 이동 주소 확인까지였고, 실제 사용자 로그인 완료까지 검증한 것은 아니다.**

여러 콜백을 보존할 수 있는지는 제공자와 앱 종류, 현재 정책을 확인해야 한다. GitHub는 2026년 8월 OAuth 앱의 다중 콜백 지원을 공지했다. 따라서 예전의 “OAuth 앱은 콜백 하나만 가능하다”는 설명을 그대로 적용하지 않았다. 다른 제공자의 제한까지 같다고 보지는 않는다. [GitHub 변경 공지](https://github.blog/changelog/2026-08-14-multiple-redirect-uris-and-token-refresh-for-oauth-apps/), [GitHub 인증 흐름](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [Kakao 설정](https://developers.kakao.com/docs/ko/kakaologin/prerequisite), [Naver 개발 가이드](https://developers.naver.com/docs/login/devguide/devguide.md)

### 패스키는 기존 계정으로 로그인한 뒤 다시 등록

패스키에는 **RP ID**, 즉 어느 사이트용 인증 정보인지를 구분하는 값이 있다. 이번에는 기존 주소와 새 주소의 RP ID가 달라졌으므로 예전 패스키를 새 주소에서 그대로 사용할 수 없었다. 모든 주소 변경에 무조건 같은 결론을 내리기보다 실제 RP ID와 인증 범위를 확인해야 한다. [W3C WebAuthn의 RP ID 설명](https://www.w3.org/TR/2026/REC-webauthn-3-20260825/#relying-party-identifier)

전환 전에는 패스키만 있고 다른 로그인 수단이 없는 계정이 있는지 먼저 살폈다. 안내할 순서는 다음과 같다.

1. **기존 계정에 이미 연결된 소셜 로그인 수단**으로 들어간다.
2. 기존 자료가 있는 내 계정인지 확인한다.
3. 계정 설정에서 새 주소용 패스키를 추가한다.
4. 새 패스키 로그인을 확인하기 전에는 마지막 로그인 수단을 해제하지 않는다.

새 소셜 계정을 만들어 들어가면 기존 자료와 분리된 별도 계정이 될 수 있다. 이번 기록은 새 패스키 등록까지 성공했다는 보고가 아니며, 해당 단계는 사용자 확인 사항으로 남았다.

### 웹훅은 설정 변경과 실제 전송을 따로 확인

GitHub 웹훅은 저장소 설정에 있는 hook이 아니라 **GitHub App의 전역 설정**에 있었다. 따라서 저장소 hook 목록만 확인해서는 실제 발송 주소를 찾을 수 없었다. App의 Payload URL을 새 API 도메인으로 바꾸고 기존 서명키는 유지했다. GitHub App 웹훅과 저장소 웹훅은 별도 설정이다. [GitHub App 웹훅 문서](https://docs.github.com/en/rest/apps/webhooks)

App의 최근 전송 기록이 비어 있어, 별도 승인을 받은 뒤 임시 저장소 hook으로 실제 GitHub `ping`을 보냈다. 새 입구에서 서명 검증을 통과하고 HTTP 200이 반환됐으며 API 로그에도 도착이 남았다. 시험 후 임시 hook은 삭제했다.

이 결과가 증명하는 것은 **GitHub가 보낸 서명 있는 ping이 새 입구에 도착했다는 것**이다. 응답의 `ignored`는 ping을 업무 이벤트로 처리하지 않았다는 정상 결과였다. App 자체의 delivery나 실제 이슈·댓글 처리까지 검증한 것으로 확대하지 않았다. 웹훅 시험과 delivery 확인 방법은 [GitHub 테스트 문서](https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/testing-webhooks)를 참고했다.

클라이언트 IP 전달도 확인했다. 시험한 경로에서는 앱이 실제 접속 IP를 기록했고 위조한 `X-Forwarded-For` 값이 그대로 채택되지는 않았다. 다만 이는 이번 경로의 검증이다. 외부에서 보내는 헤더를 무조건 신뢰하도록 앱 설정을 바꾸는 근거가 되지는 않는다.

## 공개 Funnel만 내리고 내부 Serve는 유지했다

새 경로의 검증 후 별도 승인을 받아 기존 Funnel의 공개 포트 443·8443·10000을 내부 전용 Serve로 전환했다. 핵심은 **전달 대상과 경로를 보존하고 공개 여부만 바꾸는 것**이었다.

아래는 단일 루트 대상의 형태를 보여 주는 예시다. 이 명령을 세 포트에 그대로 반복하는 절차는 아니다. 여러 경로가 있던 포트는 백업과 대조해 각 경로가 유지되는지 따로 확인했다.

```sh
# 단일 루트 서비스의 예: 인터넷 공개에서 tailnet 내부 전용으로
tailscale serve --bg --yes --https=443 http://127.0.0.1:18400

# 같은 단일 루트 서비스를 다시 공개해야 할 때의 복귀 형태
tailscale funnel --bg --https=443 http://127.0.0.1:18400
```

같은 포트의 Serve와 Funnel 공개 모드는 동시에 별개로 유지되는 설정이 아니다. 이번에는 적용 전후 TCP·Web 설정이 같은지, 공개 허용을 나타내던 `AllowFunnel`이 비었는지를 비교했다. 내부 Serve의 다른 경로를 함께 지우는 `serve reset`이나 `funnel reset`은 사용하지 않았다. [Serve와 Funnel의 범위·포트 제약](https://tailscale.com/docs/features/tailscale-funnel), [Serve CLI](https://tailscale.com/docs/reference/tailscale-cli/serve)

전환 뒤 두 웹 서비스는 200, API의 차단 대상 GET은 예상대로 404였다. 기존 Funnel 공개 릴레이 IP의 세 포트에 연결한 시험에서는 SSL timeout을 관찰했다. 이는 해당 맥에서 수행한 확인이며 모든 외부망의 접속 결과를 조사한 것은 아니다. DNS 문제가 남았다는 이유만으로 이전 Funnel을 자동 재공개하지는 않았다.

## HTTPS는 정상이었는데 다른 PC는 주소를 못 찾았다

이후 Windows PC에서 `ERR_NAME_NOT_RESOLVED`가 나타났다. 브라우저가 도메인을 IP 주소로 바꾸지 못했다는 오류다. 처음에는 서버와 여러 DNS 조회가 정상이어서 PC 캐시 문제로 범위를 좁혔다. 그러나 추가 결과는 그 판단과 맞지 않았다.

**서버에서 HTTPS 200을 받았다고, 다른 PC의 DNS 조회도 성공하는 것은 아니었다.** 관찰을 다시 정리했다.

<div class="table-scroll" tabindex="0" role="region" aria-label="DNS 조회 경로별로 달랐던 응답 관찰">

| 확인 경로 | 당시 관찰 | 여기서 말할 수 있는 범위 |
|---|---|---|
| 새 권한 DNS와 `.com` 상위 위임 | 새 NS와 주소 정보가 정상 | 확인한 위임·권한 응답은 정상 |
| 같은 맥에서 `1.1.1.1`·`1.0.0.1` 조회 | 일부 성공, 일부 `NXDOMAIN` | PC 하나의 캐시만으로 설명하기 어려움 |
| 실패 응답의 SOA | 이전 DNS 사업자의 NS와 약 1,793초 TTL | 이전 정보·음수 캐시 잔존을 의심할 근거 |
| UDP·TCP 및 DoH 비교 | 서로 다른 결과, Cloudflare DoH에서 한 번 Status 3, Google DoH에서 Status 0 | 조회 방식·경로에 따라 응답이 달랐음 |
| 사용자 Windows의 기본 공유기 DNS | PC 캐시 삭제 뒤에도 Non-existent domain | PC 캐시 삭제만으로 해소되지 않음 |
| 같은 Windows에서 명시한 `1.1.1.1` | 정상 주소 반환 | 그 시점의 해당 명시적 조회는 성공 |

</div>

**권한 DNS**는 도메인의 원본 정보를 제공하고, **재귀 DNS**는 사용자를 대신해 답을 찾고 저장한다. SOA는 DNS 영역의 관리 정보를 담는 레코드다. DoH는 DNS를 HTTPS로 조회하는 방식이다. 여기서 `NXDOMAIN`과 DoH Status 3은 이름이 없다는 응답을 뜻한다.

DNS에는 정상 주소뿐 아니라 **“그 이름은 없다”는 응답을 저장하는 음수 캐시**도 있다. 그 응답의 보관 시간은 TTL과 관련된다. RFC 2308은 SOA를 이용한 음수 응답의 캐시 수명과 만료를 설명한다. [RFC 2308, 3·5·6절](https://www.rfc-editor.org/rfc/rfc2308.html)

이번에는 실패 응답에 이전 DNS 사업자의 정보가 남아 있었다. **이전 NS 정보나 음수 캐시가 조회 경로에 남아 있다는 것이 유력한 해석**이었다. 하지만 실패한 모든 재귀 서버의 내부 상태나 공유기가 실제로 사용하는 상위 DNS는 확인하지 못했다. 공유기 고장이나 Cloudflare 전체 장애로 확정할 수는 없었다.

관찰한 TTL 약 1,793초도 “정확히 30분 후 전 세계에서 해결된다”는 약속이 아니다. 특정 응답에서 본 값과 모든 조회 경로의 해소 시점은 구분해야 한다. Cloudflare가 권한 DNS를 맡는다는 것과 모든 재귀 DNS의 응답이 즉시 같아진다는 것도 다르다. [Cloudflare DNS FAQ](https://developers.cloudflare.com/dns/faq/)

맥의 브라우저에서는 실제 서비스 화면이 정상으로 보였다. Windows PC는 직접 원격 접속해 시험한 것이 아니라 **사용자가 제공한 명령 결과를 분석**했다. Windows의 DNS 설정이나 캐시를 대신 변경했다고 기록하지 않는다.

### 같은 오류라면 조회 경로부터 비교한다

처음에는 다음 세 조회의 결과를 나란히 놓을 수 있다. 도메인은 자신의 주소로 바꾸되, 명령은 DNS 조회만 수행한다.

```sh
nslookup showcase.aidaon.com
nslookup showcase.aidaon.com 1.1.1.1
nslookup showcase.aidaon.com 8.8.8.8
```

이후에는 새 권한 NS와 상위 도메인의 위임을 비교하고, 필요하면 DoH 응답도 확인한다. 다음 흐름은 이번 사례의 진단 순서를 단순화한 것이다.

```text
브라우저에서 이름 해석 실패
  → 기본 DNS와 명시적 DNS의 응답 비교
  → 권한 DNS·상위 위임 확인
  → 응답의 이전 NS·SOA·TTL 확인
  → 정상 응답 경로로 임시 우회한 뒤 재검증
```

Windows의 `ipconfig /flushdns`는 PC의 DNS 캐시를 비우는 명령이다. 공유기나 상위 DNS의 캐시까지 지우는 것은 아니다. [Microsoft의 ipconfig 설명](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig)

정상 응답하는 DNS 서버나 브라우저의 보안 DNS를 임시 우회로로 검토할 수 있지만, 설정을 바꿨다면 원래 값과 변경 범위를 기록하고 시간이 지난 뒤 다시 확인해야 한다. CDN의 IP를 `hosts`에 영구 고정하는 방법은 이번 해결책으로 삼지 않았다.

## 다음 전환 때 사용할 확인 목록

이번에는 주소 연결, 인증 이전, 공개 종료, DNS 진단을 한 번에 “완료”로 묶지 않는 것이 중요했다.

- **전환 전:** 기존 포트·경로별 대상과 설정을 보존한다. 다른 로그인 수단이 없는 계정이 있는지 확인한다.
- **새 입구:** DNS·터널과 실제 앱 응답을 확인한다. 허용하지 않은 API 경로와 잘못된 서명도 의도대로 거부되는지 본다.
- **인증·연동:** 앱 공개 주소, SSO 공급자, 콜백, RP ID와 웹훅 발송 설정을 대조한다. 설정 저장과 실제 로그인·전송 성공을 구분한다.
- **공개 종료:** 새 경로 검증과 승인 뒤 대상 Funnel만 전환한다. 내부 Serve 경로와 공개 허용 여부를 전후 비교한다.
- **클라이언트 확인:** 서버 측 HTTP 결과에 더해 다른 기기의 DNS 조회와 실제 화면을 확인한다. 실패 경로의 응답도 남긴다.
- **복귀 준비:** 앱 주소·SSO·콜백·웹훅과 기존 경로 구성을 함께 되돌릴 수 있도록 한다. 공개 범위가 다시 넓어지는 복귀는 의도한 작업일 때만 실행한다.

작성 기준으로 남은 검증은 실제 맥 재부팅, Kakao·Naver 사용자 로그인 완료, 새 패스키 등록, GitHub App 자체 delivery와 실제 이슈·댓글 처리다. 모든 DNS 경로에서 장애가 해소됐다는 확인도 이 기록에는 없다.

Funnel과 Tunnel 중 하나가 언제나 더 낫다는 결론은 내리지 않았다. 이번에 바꾼 것은 공개 주소와 입구였고, 유지한 것은 내부 접속과 앱의 인증 책임이었다. HTTPS가 정상인 뒤에도 DNS 조회 경로를 다시 봐야 했던 일이 가장 큰 교훈으로 남았다.

## 근거와 기록의 범위

운영 경과는 2026-11-24 인계 기록을 기준으로 했다. 내부 운영 문서의 초기 기록에는 웹훅 실전송과 Funnel 종료가 대기 상태였지만, 후속 인계에는 승인 뒤 ping 시험과 공개 종료 결과가 추가되어 있다. 이 글은 후속 결과까지 반영하되, 그 시험으로 확인하지 못한 항목은 완료로 쓰지 않았다.

공식 자료는 본문의 해당 설명 옆에 연결했다. Tailscale·Cloudflare의 이전 문서 주소 중 이동된 것은 확인 시점의 경로로 연결했다. 서비스 정책과 명령 형식은 바뀔 수 있으며, 설정 예시는 실제 공개 도메인을 사용하되 터널 식별자를 생략했으며, 운영 파일을 그대로 복사한 설치 절차는 아니다.
