# 다음 작업 가이드 (Next Session Guide)

## 현재 상태
- **프론트엔드**: 로그인, 회원가입, 추가 정보 입력(`SignUpInfoModal`) 구현 완료.
- **백엔드**: 인증 및 프로필 업데이트 API 구현 완료.
- **문제점**: 데이터베이스(PostgreSQL)가 실행되지 않아 회원가입/로그인이 불가능함.

## 다음 작업 목표: 데이터베이스 설정
회원가입 및 로그인 기능을 정상적으로 사용하기 위해 데이터베이스를 준비해야 합니다.

### 1. PostgreSQL 설치 및 실행
- PC에 PostgreSQL이 설치되어 있는지 확인하세요.
- 설치되어 있지 않다면 [PostgreSQL 공식 홈페이지](https://www.postgresql.org/download/)에서 다운로드하여 설치하세요.
- 설치 후 PostgreSQL 서버를 실행하세요.

### 2. 데이터베이스 생성
터미널(또는 pgAdmin)에서 다음 명령어로 데이터베이스를 생성하세요.
```sql
CREATE DATABASE forever_love;
```
*(참고: `.env` 파일의 `DB_NAME` 설정값과 일치해야 합니다.)*

### 3. 테이블 생성
`database/schema.sql` 파일의 내용을 실행하여 필요한 테이블을 생성하세요.
터미널에서 다음 명령어를 사용할 수 있습니다 (Postgres 설치 경로의 `psql` 사용):
```bash
psql -U postgres -d forever_love -f database/schema.sql
```
또는 pgAdmin 등의 도구에서 `database/schema.sql` 파일의 내용을 복사하여 실행하세요.

### 4. 연결 확인
모든 설정이 완료되면 다음 명령어로 연결을 테스트하세요:
```bash
npx ts-node src/check-db.ts
```
성공 시 "Connected successfully" 및 테이블 목록이 출력됩니다.

---
**이 작업이 완료되면 회원가입 및 로그인 기능을 테스트할 수 있습니다.**
