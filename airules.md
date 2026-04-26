# Meme-Generator AI Rules

## 1. 아키텍처 및 기술 스택
- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS
- **Database/Auth:** Supabase (PostgreSQL), NextAuth
- **State/Real-time:** Upstash Redis (스태미나 시스템)
- **Storage:** AWS S3 / R2 (공유 에셋용)

## 2. 코드 구조 및 폴더 컨벤션
- 단일 모노레포 구조(Monorepo), `src/` 디렉토리 없이 `app/`, `components/`, `lib/`, `types/`, `hooks/` 등을 루트 레벨에서 관리.
- API는 `app/api/` (Next.js Route Handlers)를 사용.
- **컴포넌트 설계:** 모든 컴포넌트는 재사용 가능하도록 설계하며, UI는 Tailwind CSS 기반 유틸리티 클래스로 스타일링.

## 3. 핵심 규칙 (Core Principles)
- **"On-the-fly" 지향:** 이미지 원본을 매번 저장하기보다, `[배경ID, 문구ID, 스티커ID, 위치값]`을 담은 Recipe JSON 기반으로 On-the-fly 렌더링.
- **B급 감성 및 투박한 힙(Hip)함:** 세련되고 정제된 디자인보다는, 강렬한 색상과 특이한 폰트, 직관적인 UI(큰 텍스트, 원색 계열 등) 지향. SNS 공유하기 편한 1:1, 9:16 비율 지원.
- **스태미나 (하트) 시스템:** 최대 5개의 하트를 가지며, 랜덤 생성 시 1개 소모. 매 5분마다 1개씩 자동 충전. 클라이언트 단 로컬 스토리지/타이머와 서버단 Redis 동기화를 동시에 고려하여 훅 설계.
- **의존성(Dependencies):** 새로운 패키지 설치 시, 항상 프로젝트의 방향성(인스턴트, 가벼운 성능)에 부합하는지 검토 후 최소한으로 추가.

## 4. 작업 단계별 체크리스트
1. **Mock Data 우선 구성:** 실제 API/DB가 연결되기 전에 프론트엔드가 독립적으로 구동될 수 있도록 Mock 데이터를 먼저 구현 (`lib/mock-data.ts`).
2. **Hook 기반 로직 분리:** 스태미나, 밈 조합 엔진 등 핵심 비즈니스 로직은 Hook 또는 분리된 함수 모듈(`lib/`)로 관리하여 테스트 용이성 확보.
3. **Responsive & Shareable:** 모바일에 최적화된 화면 배치를 최우선으로 하고, Web Share API 등을 통해 즉각적인 공유 기능을 지원.
