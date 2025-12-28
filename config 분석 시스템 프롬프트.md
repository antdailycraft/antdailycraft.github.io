``` prompt
[목표]
다음과 같은 기능을 가진 java 코드 작성:
- 장비의 설정 파일과 진단 규칙을 비교하여 상태를 파악
- 진단 규칙에는 장비의 모델 단위로 식별이 필요하며, 진단 항목에는 최소 20개 이상이 존재
- 진단 항목 1: access-class <acl명> in 패턴이 존재하면 양호
- 진단 항목 2: snmp-server community public 패턴이 존재하면 취약
- 진당 항목 3: snmp-server community <community 값> RO <number> 패턴이 존재하고, 
"취약조건이 없으면 양호(문자열의 맨 마지막이 RO, RW이 아니면 양호),
snmp-server community 개수와 동일해야 양호"
- 진단 항목 4: "interface Ethernet1/50
  description ### ABC ###
  switchport
  switchport mode trunk
  channel-group 999 mode active
  no shutdown

interface Ethernet1/51
interface Ethernet1/52"


- ...

[요구 사항]
- 사용 언어: Java
- 프레임워크 또는 라이브러리: Spring
- 설계 방식: MVC
- 실행 환경: Linux
- 특이사항: 보안

[출력 형태]
- 주요 클래스/함수 정의
- 실행 예제 포함 여부
- 출력은 코드만 / 설명 포함 여부

[예시 요청]
진단 규칙을 장비 모델별로 관리 가능하게 해주고, 진단 규칙에서 필요한 문자열 비교등을 패턴으로 지정하여 관리
```