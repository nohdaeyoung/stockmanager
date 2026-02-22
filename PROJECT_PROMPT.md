# 프로젝트 목표: 미국 주식 데일리 리포트 자동화 시스템 구축

나는 'Prestige Daily Report'라는 미국 주식 포트폴리오 보고 시스템을 구축하고 싶어. 아래 단계에 따라 작업을 한 번에 수행해 줘.

## 1. 환경 설정 및 저장소 연결
- 작업 디렉토리: `/tmp/stockmanager` (또는 워크스페이스)
- GitHub 저장소 연결: `[GitHub 저장소 URL]` (gh-pages 브랜치 사용)
- 필요한 API 키 저장: Finnhub API 키 `[API_KEY_HERE]`를 `.finnhub_key` 파일에 저장해.

## 2. 파일 구조 초기화
- 저장소에 `index.md`가 없다면 생성해. (제목: "Prestige Daily Reports Archive", 내용: 리포트 링크 목록 예정)
- 모든 리포트는 Markdown(`.md`) 형식으로만 관리하며, HTML 파일은 생성하지 않아.

## 3. 자동화 스케줄러 (Cron) 등록
다음 조건으로 OpenClaw Cron 작업을 등록해 줘.

- **작업명**: Daily Stock Report (Mon-Fri Close)
- **일정**: 매주 화, 수, 목, 금, 토요일 오전 07:00 (KST, Asia/Seoul)
- **대상**: 미국 장이 열리는 날(월~금)의 마감 데이터
- **실행 로직 (Payload)**:
  1. **데이터 수집**: `.finnhub_key`를 사용해 아래 티커들의 전일 종가(Close), 변동폭, 고가, 저가를 수집.
     - **티커 목록**: AAPL, DIS, F, NKE, NVDA, TSLA, VOO, GOOGL, AMZN, PLTR, AVGO, CONY, ETN
  2. **뉴스 수집**:
     - 기준: 미국 현지 시간 기준 '해당 일자'에 발행된 기사만 수집.
     - 출처 우선순위: Reuters -> Bloomberg -> WSJ -> CNBC -> NYTimes.
     - 형식: 기사 원문 제목 + 한글 1~2줄 요약 + 원문 링크.
     - 링크 스타일: Markdown 링크 뒤에 반드시 `(새창)` 텍스트를 붙일 것. (예: `[제목](링크) (새창)`)
  3. **리포트 작성 (Markdown)**:
     - 파일 경로: `YYYY-MM/YYYY-MM-DD-portfolio-sample.md`
     - 구조:
       - 헤더 (기준일 포함)
       - 각 회사별 섹션 (헤더: `티커 — 회사명`)
       - 1) 시세 테이블 (종가/변동/고가/저가 - 정확한 수치)
       - 2) 요약 (짧게)
       - 3) 오늘의 뉴스 (최대 5건)
     - **제약 사항**: 문서 하단에 '비고'나 'Note' 섹션은 절대 넣지 말 것.
  4. **배포**:
     - 작성된 `.md` 파일을 `gh-pages` 브랜치에 커밋 & 푸시.
     - `index.md`에 새 리포트 링크 추가 후 푸시.
  5. **알림**:
     - 생성된 리포트의 **GitHub 웹 뷰어 링크**를 텔레그램(`[텔레그램 Chat ID]`)으로 전송.

## 4. 즉시 실행 테스트
- 위 Cron 작업이 잘 등록되었는지 확인하고, 테스트 삼아 **어제 날짜 기준**의 리포트를 하나 생성해서 배포 및 텔레그램 전송까지 완료해 줘.
