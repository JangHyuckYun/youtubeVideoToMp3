# youtube Video to MP3

기존에는 유튜브에 직접 들어가서 영상을 찾고 -> 링크를 복사해서 -> 변환 사이트에 들어가 복사를 하고 대기 후 다운로드를 해야 한다.
이 과정이 번거로워, 한 사이트 안에서 유튜브 검색을 하고, 변환 작업까지 한 번에 하도록 만들었다.

## 링크
[Youtube To Mp3](https://youtubetomp3.sodiapp.com/)

## 흐름
1. 검색창에 찾고자 하는 음악 이름 검색 후 Enter
2. 검색해서 나온 결과 중에 마음에 드는 영상 다중 선택 ( 1개 이상 )
3. 상단의 버튼 클릭 시 로딩창이 나타나고, 변환 수행
4. 로딩이 끝나고, 자동 다운로드

## 주의할 점
 - 음원으로 바꾸기 위해 빠르게 기능 구현을 하느라, 크기 제한, 개수 제한, 안 되었을 때의 로직이 많이 구현되어 있지 않음.
 - 때때로 실패할 때가 있음 / 사이트를 오래 켜두거나, 특정 조건의 경우 기능이 동작하지 않는 경우가 존재
 - 추 후 여유로울 때 수정할 예정


## 기술 스택
 - Front-End
   - HTML
   - CSS
   - JavaScript Library
     - React
     - Design Library - MUI
 - Back-End
   - Node.JS
     - Express.js
     - Typescript
     - 유튜브 mp4 다운로더: **'ytdl-core'**
     - 유튜브 영상 검색: **'youtube-search-api'**
     - mp4 to mp3: **'ffmpeg'**
