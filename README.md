# MP Groupbot V3

Roblox 그룹 [Republic of Korea Army](https://www.roblox.com/groups/3828960/Republic-of-Korea-Army#!/about)에서 사용하기 위해 제작된 그룹봇.

## 주의사항

### I. 사용 전 config.json을 설정해야 합니다
  1. 프로젝트 폴더 내에 config.json 파일 추가
  2. 아래와 같이 작성 후 값 입력
  
  ```json
  {
  "clientId":"0",
  "logChannelID":"0",
  "token":"0",
  "role":"0",
  "groupId":0,
  "ROKAGroupID":0,
  "cookie":"0",
  "ownerId":"0"
  }
  ```
  clientId, token -> 디스코드 봇 애플리케이션 ID, 토큰
  
  logChannelID, role -> 봇 실행 이후 `/설정` 명령어 이용해서 설정 (로그 채널, 그룹관리 역할)
  
  groupId, ROKAGroupID -> 각각 관리의 대상이 되는 부대 그룹 ID와 계급을 표시할 메인 그룹 ID
  
  cookie -> 봇 로블록스 계정 쿠키
  
  ownerId -> 봇 소유자 디스코드 ID (그룹관리 역할을 보유하지 않아도 명령어 사용 가능)

  **주의 : groupID, ROKAGroupID 제외한 모든 숫자로 된 값은 문자로 기록해야 함**
  
---

  ### II. `npm install` 이용해서 필요한 라이브러리 설치

    
    "discord.js": "^14.16.3",
    "noblox.js": "^6.0.2"
  
  
