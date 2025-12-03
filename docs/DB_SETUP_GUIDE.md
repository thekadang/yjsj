# PostgreSQL 설치 및 설정 가이드

현재 "서버 연결"이 실패하는 이유는 **PostgreSQL 데이터베이스가 컴퓨터에 설치되어 있지 않거나 실행 중이지 않기 때문**입니다.
다음 단계를 따라 설치를 진행해 주세요.

## 1. PostgreSQL 다운로드 및 설치
1. [PostgreSQL 공식 다운로드 페이지](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)로 이동합니다.
2. **Windows x86-64** 버전의 **Download** 버튼을 클릭하여 설치 파일을 받습니다.
3. 설치 파일을 실행하고 `Next`를 계속 누릅니다.
4. **중요**: 설치 중 비밀번호 설정 화면이 나오면 비밀번호를 **`password`** 로 설정해 주세요.
   - (만약 다른 비밀번호를 설정했다면, 프로젝트 폴더의 `.env` 파일에서 `DB_PASSWORD`를 해당 비밀번호로 변경해야 합니다.)
5. Port는 기본값 **`5432`** 를 유지합니다.
6. 설치를 완료합니다.

## 2. 데이터베이스 생성
설치가 완료되면 `pgAdmin 4` (설치 시 같이 설치됨) 또는 터미널을 엽니다.

### 방법 A: pgAdmin 사용 (권장)
1. 윈도우 시작 메뉴에서 **pgAdmin 4**를 실행합니다.
2. 좌측 메뉴에서 `Servers` > `PostgreSQL 16` (버전별 상이)을 클릭하고 비밀번호를 입력해 연결합니다.
3. `Databases` 우클릭 > `Create` > `Database...` 선택.
4. Database 이름에 **`forever_love`** 입력 후 `Save`.

### 방법 B: SQL Shell (psql) 사용
1. 윈도우 시작 메뉴에서 **SQL Shell (psql)** 을 실행합니다.
2. Server, Database, Port, Username은 엔터를 쳐서 기본값을 사용합니다.
3. Password에 설정한 비밀번호를 입력합니다.
4. 다음 명령어를 입력합니다 (세미콜론 필수):
   ```sql
   CREATE DATABASE forever_love;
   ```

## 3. 테이블 생성 (초기화)
데이터베이스가 준비되면, 프로젝트 폴더의 터미널에서 다음 명령어를 실행하여 테이블을 만듭니다.

1. VS Code 터미널을 엽니다.
2. 다음 명령어를 입력하여 스키마를 적용합니다:
   ```bash
   npx ts-node src/check-db.ts
   ```
   *(아직 스키마 적용 스크립트가 자동화되지 않았으므로, 우선 연결이 되는지부터 확인합니다.)*

   연결이 성공하면("Connected successfully"), 제가 테이블 생성 작업을 진행해 드리겠습니다.

---
**설치가 완료되고 데이터베이스(`forever_love`)를 만드셨다면 다시 말씀해 주세요!**
