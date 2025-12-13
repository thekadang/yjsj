# GCP 인프라 구성 계획서

> **프로젝트**: Forever Love Project (영원히 정말 사랑해 진짜로)
> **작성일**: 2025-12-13
> **상태**: 검토 대기

---

## 📋 목차

1. [서비스 개요](#1-서비스-개요)
2. [아키텍처 다이어그램](#2-아키텍처-다이어그램)
3. [GCP 서비스별 상세](#3-gcp-서비스별-상세)
4. [비용 계산](#4-비용-계산)
5. [설정 가이드](#5-설정-가이드)
6. [최적화 전략](#6-최적화-전략)

---

## 1. 서비스 개요

### 프로젝트 요구사항

| 기능 | 설명 | 필요 인프라 |
|------|------|------------|
| 사용자 인증 | 이메일 + 소셜 (카카오, 구글) | Firebase Auth |
| 영정사진 저장 | 고해상도 원본 + 썸네일 | Cloud Storage |
| 음성 일기 | MP3/AAC 오디오 파일 | Cloud Storage |
| API 서버 | Node.js/Express REST API | Cloud Run |
| 데이터베이스 | 사용자, 미디어, 친구관계 | Cloud SQL |
| 프론트엔드 | React SPA | Firebase Hosting |

### 트래픽 예상

| 단계 | 기간 | MAU | 일 방문자 |
|------|------|-----|----------|
| 초기 | 1~6개월 | 500명 | 100~500명 |
| 성장 | 6~12개월 | 5,000명 | 1,000~5,000명 |
| 안정 | 12개월+ | 50,000명 | 10,000+명 |

### 데이터 예상 (초기 1,000명 기준)

| 항목 | 사용자당 | 총 용량 |
|------|---------|--------|
| 영정사진 원본 | 5장 × 10MB = 50MB | 50GB |
| 썸네일 | 5장 × 300KB = 1.5MB | 1.5GB |
| 음성 일기 | 10개 × 1MB = 10MB | 10GB |
| **합계** | 약 60MB | **약 60GB** |

---

## 2. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           사용자 (Browser/Mobile)                         │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Firebase Hosting                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • React SPA (빌드된 정적 파일)                                   │   │
│  │  • 글로벌 CDN 자동 적용                                          │   │
│  │  • SSL/TLS 무료 제공                                             │   │
│  │  • 커스텀 도메인 지원                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │ API 요청
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Cloud Run (서울 리전)                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Node.js/Express API 서버                                      │   │
│  │  • Docker 컨테이너 기반                                          │   │
│  │  • 자동 스케일링 (0 ~ 100 인스턴스)                              │   │
│  │  • 트래픽 없으면 비용 0원                                        │   │
│  │  • 콜드 스타트: ~1초 (최적화 시)                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────┬───────────────────────────────────┬───────────────────────┘
              │                                   │
              ▼                                   ▼
┌─────────────────────────────┐     ┌─────────────────────────────────────┐
│       Cloud SQL             │     │         Cloud Storage                │
│  ┌───────────────────────┐  │     │  ┌─────────────────────────────┐   │
│  │  PostgreSQL 15        │  │     │  │  • 원본 이미지 (Nearline)   │   │
│  │  ────────────────────  │  │     │  │  • 썸네일 (Standard)        │   │
│  │  • users              │  │     │  │  • 음성 일기 (Standard)     │   │
│  │  • media              │  │     │  │  • 자동 라이프사이클 관리    │   │
│  │  • diaries            │  │     │  │  • CDN 연동 가능            │   │
│  │  • friendships        │  │     │  └─────────────────────────────┘   │
│  │  • friend_requests    │  │     │                                      │
│  │  ────────────────────  │  │     │  버킷 구조:                          │
│  │  자동 백업 (7일)      │  │     │  ├── originals/   (원본)            │
│  │  고가용성 옵션        │  │     │  ├── thumbnails/  (썸네일)          │
│  └───────────────────────┘  │     │  └── audio/       (음성)            │
└─────────────────────────────┘     └─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Firebase Authentication                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • 이메일/비밀번호 인증                                          │   │
│  │  • Google OAuth 2.0                                              │   │
│  │  • Kakao OAuth (커스텀 토큰)                                     │   │
│  │  • 세션 관리 및 토큰 갱신                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         모니터링 & 로깅                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Cloud Monitoring │  │  Cloud Logging   │  │  Error Reporting     │  │
│  │  (메트릭 수집)   │  │  (로그 저장)     │  │  (에러 추적)         │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. GCP 서비스별 상세

### 3.1 Firebase Hosting (프론트엔드)

| 항목 | 내용 |
|------|------|
| **용도** | React 빌드 결과물 정적 호스팅 |
| **리전** | 글로벌 CDN (자동 배포) |
| **특징** | SSL 무료, 원클릭 배포, GitHub 연동 |

**무료 티어:**
- 저장: 10GB
- 전송: 360MB/일 (약 10GB/월)

**유료:**
- 저장: $0.026/GB/월
- 전송: $0.15/GB

**설정 예시:**
```json
// firebase.json
{
  "hosting": {
    "public": "client/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=31536000" }]
      }
    ]
  }
}
```

---

### 3.2 Cloud Run (백엔드 API)

| 항목 | 내용 |
|------|------|
| **용도** | Node.js/Express REST API 서버 |
| **리전** | asia-northeast3 (서울) |
| **특징** | 서버리스, 자동 스케일링, Docker 기반 |

**무료 티어 (월간):**
- 요청: 200만 건
- CPU: 180,000 vCPU-초
- 메모리: 360,000 GiB-초
- 네트워크: 1GB 송신

**유료:**
- CPU: $0.00002400/vCPU-초
- 메모리: $0.00000250/GiB-초
- 요청: $0.40/백만 건

**권장 설정:**

| 단계 | vCPU | 메모리 | 최소 인스턴스 | 최대 인스턴스 |
|------|------|--------|--------------|--------------|
| 초기 | 0.5 | 512MB | 0 | 3 |
| 성장 | 1 | 1GB | 1 | 10 |
| 안정 | 2 | 2GB | 2 | 100 |

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
```

---

### 3.3 Cloud SQL for PostgreSQL (데이터베이스)

| 항목 | 내용 |
|------|------|
| **용도** | 관계형 데이터 저장 (사용자, 미디어, 관계) |
| **리전** | asia-northeast3 (서울) |
| **버전** | PostgreSQL 15 |

**인스턴스 옵션:**

| 인스턴스 | vCPU | RAM | 저장소 | 월 비용 |
|----------|------|-----|--------|---------|
| db-f1-micro | 공유 | 614MB | 10GB | ~$7.67 |
| db-g1-small | 공유 | 1.7GB | 10GB | ~$25.55 |
| db-custom-1-3840 | 1 | 3.75GB | 10GB | ~$51.84 |
| db-custom-2-7680 | 2 | 7.5GB | 50GB | ~$103.68 |

**추가 비용:**
- 저장소: $0.17/GB/월 (SSD)
- 백업: $0.08/GB/월
- 네트워크: 동일 리전 무료

**권장:**
- 초기: `db-f1-micro` ($7.67/월)
- 성장: `db-g1-small` ($25.55/월)
- 안정: `db-custom-2-7680` ($103.68/월)

---

### 3.4 Cloud Storage (파일 저장)

| 항목 | 내용 |
|------|------|
| **용도** | 이미지, 오디오 파일 저장 |
| **리전** | asia-northeast3 (서울) |

**스토리지 클래스별 비용:**

| 클래스 | 용도 | 저장 비용 | 검색 비용 |
|--------|------|----------|----------|
| Standard | 썸네일, 오디오 | $0.020/GB | 무료 |
| Nearline | 원본 이미지 | $0.010/GB | $0.01/GB |
| Coldline | 장기 백업 | $0.004/GB | $0.02/GB |

**네트워크 전송:**
- 동일 리전: 무료
- 아시아 내: $0.12/GB
- 글로벌: $0.12~0.23/GB

**권장 버킷 구조:**
```
forever-love-media/
├── originals/           # Nearline (원본, 자주 접근 안함)
│   └── {user_id}/
│       └── {timestamp}_{filename}
├── thumbnails/          # Standard (썸네일, 자주 접근)
│   └── {user_id}/
│       └── thumb_{timestamp}_{filename}.webp
└── audio/               # Standard (음성 일기)
    └── {user_id}/
        └── {timestamp}_{filename}.mp3
```

**라이프사이클 정책:**
```json
{
  "lifecycle": {
    "rule": [
      {
        "action": { "type": "SetStorageClass", "storageClass": "COLDLINE" },
        "condition": { "age": 365, "matchesPrefix": ["originals/"] }
      }
    ]
  }
}
```

---

### 3.5 Firebase Authentication (인증)

| 항목 | 내용 |
|------|------|
| **용도** | 사용자 인증 및 세션 관리 |
| **지원** | 이메일, Google, Kakao (커스텀) |

**무료 티어:**
- MAU: 50,000명
- 전화 인증: 월 10회

**유료 (Blaze 플랜):**
- MAU 50,001+: $0.0055/MAU
- 전화 인증: $0.01~0.06/인증

**지원 제공자:**
- ✅ 이메일/비밀번호 (무료)
- ✅ Google OAuth (무료)
- ✅ 카카오 (커스텀 토큰 방식)
- ⬚ Apple (추후 추가 가능)

---

## 4. 비용 계산

### 4.1 시나리오별 월간 비용

#### 시나리오 1: 초기 단계 (MAU 500명)

| 서비스 | 스펙 | 월 비용 |
|--------|------|---------|
| Firebase Hosting | 무료 티어 | $0 |
| Cloud Run | 무료 티어 (0.5 vCPU, 512MB) | $0~2 |
| Cloud SQL | db-f1-micro | $7.67 |
| Cloud Storage | 10GB (Standard) | $0.20 |
| Firebase Auth | 무료 티어 | $0 |
| **합계** | | **$8~10** |
| **원화** | | **약 10,000~13,000원** |

#### 시나리오 2: 성장 단계 (MAU 5,000명)

| 서비스 | 스펙 | 월 비용 |
|--------|------|---------|
| Firebase Hosting | 50GB 전송 | $5 |
| Cloud Run | 1 vCPU, 1GB, 500만 요청 | $5 |
| Cloud SQL | db-g1-small | $25.55 |
| Cloud Storage | 100GB + 전송 | $8 |
| Firebase Auth | 무료 티어 | $0 |
| **합계** | | **$43.55** |
| **원화** | | **약 57,000원** |

#### 시나리오 3: 안정 단계 (MAU 50,000명)

| 서비스 | 스펙 | 월 비용 |
|--------|------|---------|
| Firebase Hosting | 200GB 전송 | $30 |
| Cloud Run | 2 vCPU, 2GB, 자동스케일 | $50 |
| Cloud SQL | db-custom-2-7680 | $103.68 |
| Cloud Storage | 1TB + 전송 | $80 |
| Firebase Auth | 무료 티어 | $0 |
| Cloud CDN | 추가 | $20 |
| **합계** | | **$283.68** |
| **원화** | | **약 370,000원** |

---

### 4.2 AWS 비교

| 단계 | GCP | AWS | 차이 |
|------|-----|-----|------|
| 초기 (MAU 500) | $8~10 | $25~30 | **GCP 60% 저렴** |
| 성장 (MAU 5,000) | $43 | $80 | **GCP 46% 저렴** |
| 안정 (MAU 50,000) | $284 | $350 | **GCP 19% 저렴** |

**GCP 선택 이유:**
1. **서버리스 이점**: 트래픽 0일 때 Cloud Run 비용 0원
2. **Firebase 통합**: 인증, 호스팅, 모니터링 원스톱
3. **한국 리전**: 서울 리전 완벽 지원
4. **관리 편의성**: 인프라 관리 시간 최소화

---

## 5. 설정 가이드

### 5.1 프로젝트 생성 순서

```bash
# 1. GCP 프로젝트 생성
gcloud projects create forever-love-prod --name="Forever Love Production"

# 2. 결제 계정 연결
gcloud billing accounts list
gcloud billing projects link forever-love-prod --billing-account=XXXXXX-XXXXXX-XXXXXX

# 3. 필요한 API 활성화
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  firebase.googleapis.com

# 4. 서비스 계정 생성
gcloud iam service-accounts create cloud-run-sa \
  --display-name="Cloud Run Service Account"
```

### 5.2 Cloud SQL 생성

```bash
# PostgreSQL 인스턴스 생성
gcloud sql instances create forever-love-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-northeast3 \
  --storage-size=10GB \
  --storage-type=SSD \
  --backup-start-time=04:00

# 데이터베이스 생성
gcloud sql databases create forever_love --instance=forever-love-db

# 사용자 생성
gcloud sql users create app_user \
  --instance=forever-love-db \
  --password=YOUR_SECURE_PASSWORD
```

### 5.3 Cloud Storage 버킷 생성

```bash
# 미디어 버킷 생성
gsutil mb -l asia-northeast3 gs://forever-love-media

# CORS 설정
gsutil cors set cors.json gs://forever-love-media

# 라이프사이클 정책 적용
gsutil lifecycle set lifecycle.json gs://forever-love-media
```

### 5.4 Cloud Run 배포

```bash
# Docker 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/forever-love-prod/api

# Cloud Run 배포
gcloud run deploy forever-love-api \
  --image gcr.io/forever-love-prod/api \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-cloudsql-instances forever-love-prod:asia-northeast3:forever-love-db \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### 5.5 Firebase 설정

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 프로젝트 초기화
firebase init

# 배포
firebase deploy --only hosting
```

---

## 6. 최적화 전략

### 6.1 비용 최적화

| 전략 | 예상 절감 | 적용 방법 |
|------|----------|----------|
| 이미지 WebP 변환 | 저장 70% | Sharp 라이브러리 |
| Nearline 스토리지 | 저장 50% | 원본 이미지용 |
| Cloud Run 최소 0 | 유휴 100% | 설정 변경 |
| CDN 캐싱 | 전송 50% | Cache-Control 헤더 |

### 6.2 성능 최적화

```yaml
Cloud Run 최적화:
  - 콜드 스타트 최소화: 최소 인스턴스 1 설정 (성장 단계)
  - 컨테이너 크기 최소화: Alpine 베이스 이미지
  - 동시성 설정: 요청당 80 동시 처리

이미지 최적화:
  - 업로드 시 즉시 썸네일 생성
  - WebP 포맷 (품질 80%)
  - 지연 로딩 (Lazy Loading)

데이터베이스 최적화:
  - 커넥션 풀링 (max 10)
  - 인덱스 최적화
  - 읽기 전용 복제본 (안정 단계)
```

### 6.3 보안 체크리스트

- [ ] Cloud SQL: Private IP 사용
- [ ] Cloud Run: 서비스 계정 최소 권한
- [ ] Cloud Storage: 서명된 URL 사용
- [ ] 환경 변수: Secret Manager 사용
- [ ] HTTPS: 모든 통신 암호화
- [ ] VPC: 서비스 간 프라이빗 통신

---

## 📎 참고 자료

- [GCP 가격 계산기](https://cloud.google.com/products/calculator)
- [Cloud Run 문서](https://cloud.google.com/run/docs)
- [Cloud SQL 문서](https://cloud.google.com/sql/docs)
- [Firebase 문서](https://firebase.google.com/docs)

---

## ✅ 결론

| 항목 | 권장 |
|------|------|
| **클라우드** | GCP (Google Cloud Platform) |
| **리전** | asia-northeast3 (서울) |
| **초기 비용** | 약 10,000~13,000원/월 |
| **확장성** | 자동 스케일링으로 무제한 |
| **관리** | 서버리스로 최소화 |

**이 구성의 핵심 장점:**
1. 트래픽 없을 때 비용 최소화 (Cloud Run)
2. Firebase 생태계로 빠른 개발
3. 한국 서울 리전으로 저지연
4. 인프라 관리 시간 90% 절감
