# 문제 해결 가이드

> 🔧 **자주 발생하는 문제와 해결 방법을 정리합니다. 에러 발생 시 여기를 먼저 확인하세요!**

**마지막 업데이트**: 2025-12-13

---

## 📋 빠른 문제 찾기

| 카테고리 | 바로가기 |
|---------|---------|
| 개발 환경 설정 | [→](#-개발-환경-설정) |
| 데이터베이스 | [→](#-데이터베이스) |
| API / 네트워크 | [→](#-api--네트워크) |
| 인증 / 권한 | [→](#-인증--권한) |
| 빌드 / 배포 | [→](#-빌드--배포) |
| 성능 문제 | [→](#-성능-문제) |

---

## 🛠️ 개발 환경 설정

### ❌ 문제: 패키지 설치 실패
```bash
ERROR: Could not find a version that satisfies the requirement...
```

#### 해결 방법
1. **Python 버전 확인**
   ```bash
   python --version  # Python 3.11 이상 필요
   ```

2. **pip 업그레이드**
   ```bash
   pip install --upgrade pip
   ```

3. **가상환경 재생성**
   ```bash
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

---

### ❌ 문제: 환경변수 로드 안 됨
```
KeyError: 'DATABASE_URL'
```

#### 해결 방법
1. **`.env` 파일 존재 확인**
   ```bash
   ls -la .env
   ```

2. **`.env.example`에서 복사**
   ```bash
   cp .env.example .env
   # 이후 실제 값으로 수정
   ```

3. **환경변수 형식 확인**
   ```bash
   # .env 파일 내용 예시
   DATABASE_URL=postgresql://user:pass@localhost/dbname
   API_KEY=your-api-key-here
   # 주의: 따옴표 사용 X, 공백 X
   ```

4. **로드 코드 확인**
   ```python
   from dotenv import load_dotenv
   load_dotenv()  # 이 줄이 있는지 확인
   ```

---

### ❌ 문제: 모듈을 찾을 수 없음
```
ModuleNotFoundError: No module named 'src'
```

#### 해결 방법
1. **PYTHONPATH 설정**
   ```bash
   # Linux/Mac
   export PYTHONPATH="${PYTHONPATH}:${PWD}"
   
   # Windows
   set PYTHONPATH=%PYTHONPATH%;%CD%
   ```

2. **프로젝트 루트에서 실행**
   ```bash
   # ❌ 잘못된 실행
   cd src
   python main.py
   
   # ✅ 올바른 실행
   python -m src.main
   # 또는
   python src/main.py
   ```

3. **`__init__.py` 파일 확인**
   - 모든 패키지 폴더에 `__init__.py` 있는지 확인

---

## 💾 데이터베이스

### ❌ 문제: PostgreSQL 설치 시 "Illegal characters in path" 오류
```
Error running PowerShell... Processing -File 'C:\Users\???\...' failed: Illegal characters in path
```

#### 원인
Windows 사용자 이름에 한글이 포함되어 있으면 TEMP 폴더 경로를 인식하지 못함

#### 해결 방법
1. **영문 TEMP 폴더 생성**
   ```cmd
   mkdir C:\Temp
   ```

2. **환경 변수 변경**
   - `Win + R` → `sysdm.cpl` → 고급 → 환경 변수
   - 사용자 변수에서 `TEMP`와 `TMP` 값을 `C:\Temp`로 변경

3. **컴퓨터 재시작 또는 로그아웃/로그인**

4. **PostgreSQL 설치 재시도**

---

### ❌ 문제: 데이터베이스 연결 실패
```
OperationalError: could not connect to server
```

#### 해결 방법
1. **DB 서버 실행 확인**
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   
   # MySQL
   sudo systemctl status mysql
   sudo systemctl start mysql
   ```

2. **연결 정보 확인**
   ```python
   # 연결 문자열 디버깅
   print(f"DB URL: {DATABASE_URL}")
   # 비밀번호에 특수문자 있으면 URL 인코딩 필요
   ```

3. **방화벽 확인**
   ```bash
   # 포트 열려있는지 확인
   telnet localhost 5432  # PostgreSQL
   telnet localhost 3306  # MySQL
   ```

---

### ❌ 문제: 마이그레이션 에러
```
alembic.util.exc.CommandError: Can't locate revision...
```

#### 해결 방법
1. **마이그레이션 이력 확인**
   ```bash
   alembic current
   alembic history
   ```

2. **DB 초기화 (개발 환경만!)**
   ```bash
   # 주의: 모든 데이터 삭제됨
   alembic downgrade base
   alembic upgrade head
   ```

3. **마이그레이션 파일 재생성**
   ```bash
   alembic revision --autogenerate -m "description"
   alembic upgrade head
   ```

---

### ❌ 문제: 외래 키 제약 위반
```
IntegrityError: foreign key constraint fails
```

#### 해결 방법
1. **참조되는 데이터 먼저 생성**
   ```python
   # ❌ 잘못된 순서
   order = Order(user_id=999)  # user_id=999가 없음
   
   # ✅ 올바른 순서
   user = User(id=999, name="홍길동")
   db.session.add(user)
   db.session.flush()  # ID 생성
   order = Order(user_id=user.id)
   ```

2. **Cascade 옵션 확인**
   ```python
   class User(Base):
       orders = relationship("Order", cascade="all, delete-orphan")
   ```

---

## 🌐 API / 네트워크

### ❌ 문제: CORS 에러
```
Access to fetch blocked by CORS policy
```

#### 해결 방법
1. **CORS 미들웨어 추가 (FastAPI)**
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],  # 프론트엔드 주소
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **프로덕션 환경 설정**
   ```python
   # 개발
   allow_origins=["*"]  # 모든 도메인 허용
   
   # 프로덕션
   allow_origins=["https://yourdomain.com"]  # 특정 도메인만
   ```

---

### ❌ 문제: 500 Internal Server Error + "Unexpected end of JSON input"
```
GET /api/myspace/my 500 (Internal Server Error)
SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
```

#### 원인
- 백엔드 서버가 크래시하여 응답을 보내지 못함
- 빈 응답을 JSON으로 파싱하려고 시도할 때 발생

#### 해결 방법
1. **백엔드 서버 로그 확인**
   ```bash
   # 서버 터미널에서 에러 메시지 확인
   # 또는 nodemon이 실행 중인 터미널 확인
   ```

2. **일반적인 원인: 모듈 로드 실패**
   ```bash
   # 에러 예시
   Cannot find module 'fluent-ffmpeg'

   # 해결: 패키지 설치
   npm install fluent-ffmpeg @types/fluent-ffmpeg
   ```

3. **서버 재시작**
   ```bash
   # 서버 프로세스 종료 후 재시작
   npm run dev:server
   ```

#### 관련 History
- History #21 - FFmpeg 모듈 오류 수정

---

### ❌ 문제: API 응답 느림
```
Request timeout after 30 seconds
```

#### 해결 방법
1. **쿼리 최적화**
   ```python
   # ❌ N+1 문제
   users = User.query.all()
   for user in users:
       print(user.orders)  # 매번 쿼리 실행
   
   # ✅ Eager Loading
   users = User.query.options(joinedload(User.orders)).all()
   ```

2. **타임아웃 늘리기**
   ```python
   import requests
   response = requests.get(url, timeout=60)  # 60초로 증가
   ```

3. **비동기 처리**
   ```python
   # 동기 → 비동기 변환
   async def fetch_data():
       async with httpx.AsyncClient() as client:
           response = await client.get(url)
   ```

---

### ❌ 문제: 401 Unauthorized
```
{"detail": "Not authenticated"}
```

#### 해결 방법
1. **토큰 형식 확인**
   ```bash
   # 올바른 헤더
   Authorization: Bearer your-jwt-token-here
   ```

2. **토큰 만료 확인**
   ```python
   import jwt
   
   try:
       payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
   except jwt.ExpiredSignatureError:
       print("토큰 만료됨 - 재로그인 필요")
   ```

3. **CORS preflight 요청 확인**
   - OPTIONS 요청도 인증 제외 필요
   ```python
   @app.options("/{full_path:path}")
   async def options_handler(full_path: str):
       return {}
   ```

---

## 🔐 인증 / 권한

### ❌ 문제: 비밀번호 해싱 실패
```
ValueError: Invalid salt
```

#### 해결 방법
1. **bcrypt 설치 확인**
   ```bash
   pip install bcrypt
   ```

2. **올바른 해싱 방법**
   ```python
   import bcrypt
   
   # ✅ 올바른 방법
   password = "user_password"
   hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
   
   # 검증
   is_valid = bcrypt.checkpw(password.encode(), hashed)
   ```

---

## 🚀 빌드 / 배포

### ❌ 문제: Docker 빌드 실패
```
ERROR: failed to solve: failed to compute cache key
```

#### 해결 방법
1. **Dockerfile 문법 확인**
   ```dockerfile
   # 올바른 예시
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["python", "main.py"]
   ```

2. **캐시 무시하고 빌드**
   ```bash
   docker build --no-cache -t myapp .
   ```

3. **.dockerignore 확인**
   ```
   # .dockerignore
   venv/
   __pycache__/
   *.pyc
   .env
   .git/
   ```

---

### ❌ 문제: 배포 후 500 에러
```
Internal Server Error
```

#### 해결 방법
1. **로그 확인**
   ```bash
   # Docker
   docker logs container-name
   
   # systemd
   journalctl -u myapp.service -f
   ```

2. **환경변수 설정 확인**
   - 프로덕션 서버에 `.env` 파일 있는지 확인
   - 또는 환경변수 직접 설정

3. **디버그 모드 일시 활성화**
   ```python
   # ⚠️ 프로덕션에선 절대 사용 금지
   app = FastAPI(debug=True)
   ```

---

## ⚡ 성능 문제

### ❌ 문제: 메모리 부족
```
MemoryError: Unable to allocate array
```

#### 해결 방법
1. **대용량 데이터 스트리밍 처리**
   ```python
   # ❌ 전체 로드
   data = list(db.query(Model).all())
   
   # ✅ 배치 처리
   for batch in db.query(Model).yield_per(1000):
       process(batch)
   ```

2. **제너레이터 사용**
   ```python
   # ❌ 리스트 반환
   def get_items():
       return [item for item in large_list]
   
   # ✅ 제너레이터
   def get_items():
       for item in large_list:
           yield item
   ```

---

### ❌ 문제: 동시성 이슈
```
sqlite3.OperationalError: database is locked
```

#### 해결 방법
1. **Connection Pool 사용**
   ```python
   from sqlalchemy import create_engine
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20
   )
   ```

2. **트랜잭션 관리**
   ```python
   with db.begin():
       # 트랜잭션 내에서 작업
       db.add(item)
   # 자동 커밋
   ```

---

## 📝 새 문제 추가하기

문제 해결 후 이 문서에 추가해주세요:

```markdown
### ❌ 문제: [에러 메시지 또는 증상]

#### 해결 방법
1. [첫 번째 해결책]
2. [두 번째 해결책]
```

---

## 🆘 그래도 해결 안 될 때

1. **로그 상세히 확인**
   ```python
   import logging
   logging.basicConfig(level=logging.DEBUG)
   ```

2. **최소 재현 코드 작성**
   - 문제가 발생하는 최소한의 코드만 추출

3. **스택 오버플로우 검색**
   - 에러 메시지 전체를 검색

4. **GitHub Issues 확인**
   - 사용 중인 라이브러리의 이슈 페이지 확인

5. **팀원에게 문의**
   - 재현 방법과 함께 공유

---

## 💡 예방 팁

- **환경 일치**: 개발/프로덕션 환경 최대한 동일하게
- **버전 고정**: requirements.txt에 정확한 버전 명시
- **로그 활용**: 디버그 로그를 충분히 남기기
- **테스트 작성**: 주요 기능은 테스트 코드로 검증
- **정기 업데이트**: 라이브러리 보안 업데이트 적용

---

**※ 새로운 문제를 해결할 때마다 이 문서를 업데이트하세요. 팀의 집단 지식이 됩니다!**
