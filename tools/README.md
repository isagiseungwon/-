# tools

## competitor_analysis.py (경쟁 글 분석)

네이버 블로그 검색 결과 상위 글의 제목 패턴, 자주 쓰는 단어, 날짜를 분석해 `reports/`에 저장한다.

### 네이버 검색 API 키 발급 (한 번만, 무료)
1. https://developers.naver.com 접속 후 로그인
2. 애플리케이션 등록 → 사용 API에서 **검색** 선택
3. 환경(Android/웹 등) 중 **WEB 설정**을 고르고 URL에 `http://localhost` 입력
4. 발급된 Client ID, Client Secret을 복사

### 실행 (PowerShell)
```
$env:NAVER_CLIENT_ID="발급받은ID"
$env:NAVER_CLIENT_SECRET="발급받은SECRET"
python tools/competitor_analysis.py "쌍문 스터디카페" "쌍문역 무인 스터디카페"
```

키는 이 창에서만 유지되고 파일에는 저장되지 않는다. 키를 파일이나 GitHub에 올리지 말 것.
