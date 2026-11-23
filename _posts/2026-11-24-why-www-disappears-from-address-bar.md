---
layout: post
title: "www는 사라진 게 아니라 숨겨진 것이었다"
date: "2026-11-24T00:00:00+09:00"
author: picsen
categories: [tutorial]
tags: [dns, web, browser, domain, GitHub Pages, Chrome]
description: "주소창에서 www가 안 보이는 이유는 리다이렉트와 표시 생략 두 가지입니다. 직접 확인한 응답과 대표 주소 선택, 전체 URL 표시 방법을 정리합니다."
ai_assisted: true
updated_at: "2026-11-24T00:00:00+09:00"
---

**확인 기준일: 2026년 11월 24일**

> **AI 활용 안내**  
> 이 글은 AI 에이전트(Codex)와 함께 HTTP 응답과 공식 자료를 확인해 작성했습니다. 사이트 응답과 브라우저 설정은 확인 시점·버전에 따라 달라질 수 있습니다.

## 내 도메인에서 www가 빠졌다

`https://www.aidaon.com`에 접속했는데 aidaon.com만 남았습니다. 요즘은 www를 안 쓰는 것인지 궁금했습니다.

**서버의 주소 이동과 브라우저의 표시 생략은 다릅니다.** 내 사이트는 실제 이동이었지만, www를 쓰면서도 주소창에는 안 보이는 사이트가 있었습니다.

## 실제 이동과 화면 표시를 구분하기

301 리다이렉트는 영구 이동이며 목적지는 응답의 `Location`에 담깁니다. 표시 생략은 접속 주소를 유지하면서 화면의 문자열만 줄입니다.

<div class="table-scroll" tabindex="0" role="region" aria-label="사이트별 대표 주소 확인 결과">

| 조회한 주소 | 첫 응답 | 이동 목적지 |
|---|---|---|
| https://www.aidaon.com | 301 | https://aidaon.com/ |
| http://www.aidaon.com | 301 | https://aidaon.com/ |
| https://aidaon.com | 200 | 이동 없음 |
| https://google.com | 301 | https://www.google.com/ |
| https://amazon.com | 301 | https://www.amazon.com/ |
| https://naver.com | 301 | https://www.naver.com/ |
| https://github.com | 200 | 이동 없음 |
| https://stripe.com | 200 | 이동 없음 |

</div>

표는 작성 시점에 curl로 첫 응답을 직접 조회한 결과입니다. Google·Amazon·Naver는 지금도 www로 이동합니다.

Chrome은 평상시 주소창에서 `https://`와 `www.`를 생략할 수 있습니다. 주소창 전체를 복사해 일반 텍스트에 붙여 넣거나 응답을 확인하면 구분하기 쉽습니다. 클릭 시 펼쳐지는 범위는 버전에 따라 다릅니다.

macOS·Linux에서는 다음처럼 목적지만 볼 수 있습니다. `-L`을 넣지 않아 첫 응답을 확인합니다.

```shell
curl -sI https://google.com | grep -i location
```

Windows PowerShell에서는 별칭과 혼동하지 않도록 `curl.exe`를 사용합니다.

```shell
curl.exe -sI https://google.com | Select-String -Pattern '^location:'
```

## www의 짧은 역사

www는 World Wide Web의 줄임말로 웹 서비스의 호스트 이름 관례였으며, 필수 접두사는 아닙니다.

<div class="table-scroll" tabindex="0" role="region" aria-label="www와 주소 표시의 변화">

| 시기 | 변화 |
|---|---|
| 1990년대 | FTP는 ftp, 메일은 mail처럼 역할별 별칭을 쓰던 관례에 따라 웹에 www를 사용했습니다. |
| 2003년 무렵 | no-www.org는 www 없는 접속과 루트 주소로의 이동을 주장했습니다. 웹 표준에서 www를 폐기했다는 뜻은 아닙니다. |
| 2018~2019년 | Chrome 69에서 일부 접두사 생략을 도입했다가 되돌렸고, Chrome 76에서 www와 HTTPS 생략을 다시 적용했습니다. |
| 2020년 | Chromium은 도메인에 시선을 모으는 주소 표시 실험과 전체 URL 표시 옵션을 설명했습니다. |

</div>

역할별 이름의 배경은 <a href="https://www.w3.org/Provider/Style/www.html">W3C의 「Why www.?」</a>, 2003년 주장은 <a href="https://no-www.org/">no-www.org의 당시 기록</a>에서 확인했습니다. W3C는 1999년에도 양쪽 중 하나로 이동시키는 방법을 설명했습니다.

Chrome 변경 이력은 <a href="https://lists.w3.org/Archives/Public/public-webapps-github/2021Jan/0053.html">WHATWG URL 논의 기록</a>, 표시 실험의 목적은 <a href="https://blog.chromium.org/2020/08/helping-people-spot-spoofs-url.html">Chromium 공식 글</a>을 참고했습니다. 목적은 실제 도메인을 알아보기 쉽게 하는 것이지만 필요한 정보가 감춰질 수도 있습니다.

모바일에서 짧은 주소가 편리해도, www가 사라졌다는 뜻은 아닙니다. 두 방식은 공존합니다.

## 예전에 www를 붙이면 편했던 이유

**DNS 연결:** 일반 CNAME은 같은 이름의 다른 레코드와 함께 둘 수 없습니다. SOA·NS가 필요한 루트에는 그대로 쓸 수 없어, CDN·호스팅의 별칭 연결에 www가 편리했습니다. 현재는 CNAME flattening, ALIAS·ANAME 같은 제공사 기능이나 호스팅의 A 레코드로 대응할 수 있습니다. 지원 방식은 업체마다 다릅니다. <a href="https://developers.cloudflare.com/dns/cname-flattening/">Cloudflare 설명</a>

**쿠키 범위:** `Domain=example.com`을 지정한 쿠키는 서브도메인에도 전송될 수 있습니다. www에서 Domain을 생략한 호스트 전용 쿠키를 쓰면 다른 서비스와 범위를 나누기 쉽습니다. 다만 **루트에서도 Domain을 생략하면 그 호스트에만 전송**됩니다. www 유무보다 쿠키 속성이 중요합니다. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie">MDN 설명</a>

**익숙한 표기:** www는 웹 주소라는 신호이기도 했습니다. 선택에는 기술과 관례가 작용하며, 어느 쪽이 무조건 빠르거나 안전하지는 않습니다.

## 내 사이트는 루트를 대표 주소로 정했다

aidaon.com은 GitHub Pages의 커스텀 도메인을 루트로 지정하고 www CNAME도 설정했습니다. 그 결과 www 요청은 루트로 301 이동합니다. DNS의 CNAME 자체가 HTTP 이동 명령인 것은 아니며, 리다이렉트는 GitHub Pages가 처리합니다.

<a href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain-and-the-www-subdomain-variant">GitHub 공식 문서</a>도 양쪽 DNS 레코드를 올바르게 설정하면 자동 이동한다고 설명합니다. www를 대표로 지정하면 반대로 루트에서 www로 이동합니다.

저는 blog·etf처럼 서비스별 서브도메인을 나누고 있어 루트를 짧은 대표 주소로 유지했습니다. 실제 연결 과정은 [aidaon.com 구축기의 www 연결 부분](/personal-infrastructure-with-one-domain/#www-redirect)에서 이어집니다.

## 전체 URL을 표시하려면

아래는 데스크톱 기준입니다. 모바일과 다른 Chromium 파생 브라우저에는 같은 메뉴가 없을 수 있습니다.

- **Chrome:** 주소창을 오른쪽 클릭해 **‘전체 URL 항상 표시’**를 켭니다. Chromium의 <a href="https://chromium.googlesource.com/chromium/src/+/refs/heads/main/chrome/app/resources/generated_resources_ko.xtb">현재 한국어 메뉴 리소스</a>에서 확인한 표기이며, 영문은 `Always show full URLs`입니다.
- **Edge 등 Chromium 계열:** 같은 메뉴의 제공 여부와 이름은 제품·버전별로 확인해야 합니다. Chrome과 같은 엔진이라고 표시 정책까지 같지는 않습니다. 메뉴가 없다면 주소창 전체를 선택·복사해 확인합니다.
- **Safari(macOS):** Safari → 설정 → 고급 → **‘전체 웹 사이트 주소 보기’**를 켭니다. 영문 옵션은 `Show full website address`입니다. <a href="https://support.apple.com/en-ie/guide/safari/ibrw1075/mac">Apple 안내</a>
- **Firefox:** 일반적으로 www는 표시합니다. `about:config`에서 `browser.urlbar.trimURLs`를 `false`로 바꾸면 주소 정리를 끌 수 있습니다. HTTPS 생략과 관련된 `browser.urlbar.trimHttps`도 버전에 따라 존재합니다. 이미 있는 항목만 확인하며, 필요하면 `false`로 설정합니다. <a href="https://firefox-source-docs.mozilla.org/browser/urlbar/preferences.html">공식 설정 문서</a> · <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1067293">HTTPS 관련 구현 기록</a>

전체 주소는 서브도메인과 이동 목적지를 확인하는 데 유용하지만, 피싱을 자동 판별하지는 않습니다. `www`나 HTTPS 표시만 보지 말고 실제 등록 도메인까지 읽어야 합니다.

## 대표는 하나, 다른 주소는 리다이렉트

www와 루트 중 정답이 하나인 것은 아닙니다. 하나를 대표로 정하고 다른 쪽을 301로 보내며 내부 링크·canonical·사이트맵도 대표 주소에 맞추는 것이 핵심입니다. Google도 리다이렉트를 <a href="https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls">대표 URL을 알리는 강한 신호</a>로 설명합니다. ‘www를 빼면 검색 순위가 오른다’는 뜻은 아닙니다.

주소창에서 www가 안 보이면 먼저 확인할 것은 두 가지입니다. **서버가 이동시켰는가, 브라우저가 표시만 줄였는가.** 내 사이트의 대표 주소를 정하는 일은 그다음입니다.
