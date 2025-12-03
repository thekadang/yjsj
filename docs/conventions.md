# 코딩 컨벤션

> 📐 **이 파일은 상세한 코딩 규칙을 담습니다. claude.md의 핵심 원칙을 구체적인 예시와 함께 설명합니다.**

---

## 🎨 코드 스타일

### Python 스타일 가이드
- **기본**: PEP 8 준수
- **줄 길이**: 최대 100자 (가독성이 더 좋으면 예외 허용)
- **들여쓰기**: 스페이스 4칸
- **따옴표**: 작은따옴표 `'` 우선, 문자열 내 작은따옴표 있으면 큰따옴표 `"`

### Import 순서
```python
# 1. 표준 라이브러리
import os
import sys
from datetime import datetime

# 2. 서드파티 라이브러리
import requests
from flask import Flask

# 3. 로컬 모듈
from src.models.user import User
from src.utils.validators import validate_email
```

---

## 📝 명명 규칙

### 변수명
```python
# ✅ 좋은 예 - 명확하고 설명적
user_email = "user@example.com"
total_price = 1000
is_authenticated = True
has_permission = False
can_edit = True

# ❌ 나쁜 예 - 모호하거나 축약
e = "user@example.com"
tot = 1000
flag = True
x = False
```

### 함수명
```python
# ✅ 좋은 예 - 동사로 시작, 의도 명확
def calculate_total_price(items):
    pass

def validate_user_input(data):
    pass

def get_user_by_email(email):
    pass

def send_welcome_email(user):
    pass

# ❌ 나쁜 예 - 모호하거나 너무 간결
def calc(items):
    pass

def check(data):
    pass

def user(email):
    pass
```

### 클래스명
```python
# ✅ 좋은 예 - PascalCase, 명사
class UserService:
    pass

class PaymentProcessor:
    pass

class EmailValidator:
    pass

# ❌ 나쁜 예
class user_service:  # snake_case 사용 X
    pass

class Process:  # 너무 일반적
    pass
```

### 상수
```python
# ✅ 좋은 예 - UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3
DEFAULT_TIMEOUT = 30
API_BASE_URL = "https://api.example.com"

# ❌ 나쁜 예
max_retry = 3  # 변수처럼 보임
MaxRetry = 3   # 클래스처럼 보임
```

---

## 🏗️ 함수 작성 규칙

### 단일 책임 원칙
```python
# ❌ 나쁜 예 - 여러 책임
def process_order_and_send_email_and_update_inventory(order):
    # 주문 처리
    order.status = "processed"
    
    # 이메일 발송
    send_email(order.user.email)
    
    # 재고 업데이트
    update_inventory(order.items)

# ✅ 좋은 예 - 각각 분리
def process_order(order):
    order.status = "processed"
    return order

def send_order_confirmation_email(order):
    send_email(order.user.email, "order_confirmation")

def update_inventory_for_order(order):
    for item in order.items:
        decrease_stock(item.product_id, item.quantity)
```

### 함수 길이
- **목표**: 20줄 이하
- **최대**: 50줄
- 50줄 초과 시 분리 고려

### 매개변수
```python
# ✅ 좋은 예 - 3개 이하 권장
def create_user(name, email, password):
    pass

# ⚠️ 주의 - 4개 이상이면 객체로 묶기 고려
def create_user(name, email, password, phone, address, age):  # 너무 많음
    pass

# ✅ 개선 - 데이터 클래스 사용
@dataclass
class UserData:
    name: str
    email: str
    password: str
    phone: str
    address: str
    age: int

def create_user(user_data: UserData):
    pass
```

### 반환값
```python
# ✅ 좋은 예 - 명확한 타입 힌트
def get_user_by_id(user_id: int) -> Optional[User]:
    pass

def calculate_price(quantity: int, unit_price: float) -> float:
    return quantity * unit_price

# ❌ 나쁜 예 - 타입 힌트 없음
def get_user(id):
    pass
```

---

## 🛡️ 에러 처리

### 예외 처리 패턴
```python
# ✅ 좋은 예 - 구체적 예외, 명확한 메시지
def read_config_file(file_path: str) -> dict:
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"설정 파일을 찾을 수 없습니다: {file_path}")
        raise ConfigError(f"'{file_path}' 파일이 존재하지 않습니다. config.example.json을 복사하여 생성하세요.")
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 실패: {e}")
        raise ConfigError(f"'{file_path}' 파일의 JSON 형식이 올바르지 않습니다: {e}")

# ❌ 나쁜 예 - 너무 광범위한 예외
def read_config_file(file_path):
    try:
        with open(file_path) as f:
            return json.load(f)
    except Exception as e:  # 모든 예외를 잡음
        print("에러 발생")  # 메시지가 불명확
        return {}  # 조용히 실패
```

### 커스텀 예외
```python
# ✅ 좋은 예 - 의미 있는 커스텀 예외
class ValidationError(Exception):
    """입력 검증 실패 시 발생"""
    pass

class AuthenticationError(Exception):
    """인증 실패 시 발생"""
    pass

class DatabaseError(Exception):
    """데이터베이스 작업 실패 시 발생"""
    pass

# 사용
def validate_email(email: str):
    if "@" not in email:
        raise ValidationError(f"유효하지 않은 이메일 형식입니다: {email}")
```

---

---

## 🌏 한글화 원칙

### 기본 규칙
- **문서(md 파일)**: 모두 한글로 작성
- **코드 주석**: 모두 한글로 작성
- **함수명/변수명/클래스명**: 영어로 작성 (코드의 일부이므로)
- **에러 메시지**: 한글로 작성 (사용자가 이해하기 쉽게)
- **로그 메시지**: 한글로 작성

### 코드 작성 예시

```python
# ✅ 좋은 예 - 주석은 한글, 코드는 영어
def calculate_total_price(items: list) -> float:
    """
    장바구니 아이템들의 총 가격을 계산합니다.
    
    Args:
        items: 장바구니 아이템 리스트
        
    Returns:
        할인이 적용된 총 가격
    """
    total = 0
    
    # 각 아이템의 가격을 합산
    for item in items:
        total += item.price * item.quantity
    
    # 10% 할인 적용
    discount_rate = 0.1
    final_price = total * (1 - discount_rate)
    
    return final_price

# ❌ 나쁜 예 1 - 함수명이 한글
def 총가격계산(items: list) -> float:  # 함수명은 영어로!
    pass

# ❌ 나쁜 예 2 - 주석이 영어
def calculate_total_price(items: list) -> float:
    # Calculate total price  # 주석은 한글로!
    pass
```

### 에러 메시지

```python
# ✅ 좋은 예 - 한글 에러 메시지
if price < 0:
    raise ValueError("가격은 0보다 작을 수 없습니다")

if not user.is_authenticated:
    raise AuthenticationError("로그인이 필요한 서비스입니다. /login 페이지로 이동하세요.")

# ❌ 나쁜 예 - 영어 에러 메시지
if price < 0:
    raise ValueError("Price cannot be negative")
```

### 로그 메시지

```python
# ✅ 좋은 예
logger.info("사용자 로그인 성공", extra={"user_id": user.id})
logger.error("데이터베이스 연결 실패: 타임아웃 발생")
logger.warning("API 호출 제한 임박: 현재 95/100 요청")

# ❌ 나쁜 예
logger.info("User login successful")
logger.error("Database connection failed")
```

### 문서 작성

```markdown
# ✅ 좋은 예 - 한글 문서

## API 엔드포인트

### POST /api/users
새로운 사용자를 생성합니다.

**요청 본문**:
- name: 사용자 이름 (필수)
- email: 이메일 주소 (필수)

**응답**:
- 201: 사용자 생성 성공
- 400: 잘못된 요청 형식

# ❌ 나쁜 예 - 영어 문서

## API Endpoints

### POST /api/users
Creates a new user.
```

### 변수명 가이드

```python
# ✅ 좋은 예 - 영어 변수명 + 한글 주석
user_name = "홍길동"  # 사용자 이름
total_price = 10000   # 총 가격
is_valid = True       # 유효성 검사 결과

# ❌ 나쁜 예 - 한글 변수명
사용자이름 = "홍길동"  # 변수명은 영어로!
총가격 = 10000
```

### 클래스와 메서드

```python
# ✅ 좋은 예
class UserService:
    """사용자 관련 비즈니스 로직을 처리하는 서비스 클래스"""
    
    def create_user(self, user_data: dict) -> User:
        """
        새로운 사용자를 생성합니다.
        
        Args:
            user_data: 사용자 정보가 담긴 딕셔너리
            
        Returns:
            생성된 User 객체
            
        Raises:
            ValidationError: 유효하지 않은 사용자 정보
        """
        # 이메일 중복 확인
        if self._is_email_exists(user_data['email']):
            raise ValidationError("이미 사용 중인 이메일입니다")
        
        # 사용자 생성
        user = User(**user_data)
        return user

# ❌ 나쁜 예
class 사용자서비스:  # 클래스명은 영어로!
    def 사용자생성(self, 사용자정보):  # 메서드명도 영어로!
        pass
```

### 상수 정의

```python
# ✅ 좋은 예
# 상수는 영어로, 설명은 주석으로 한글로
MAX_LOGIN_ATTEMPTS = 5      # 최대 로그인 시도 횟수
DEFAULT_TIMEOUT = 30        # 기본 타임아웃 (초)
ADULT_AGE = 19             # 성인 기준 나이

# ❌ 나쁜 예
최대로그인시도 = 5  # 상수명도 영어로!
```

### 예외 처리

```python
# ✅ 좋은 예
try:
    result = process_payment(order)
except PaymentError as e:
    # 결제 처리 중 에러 발생
    logger.error(f"결제 실패: {e}")
    raise HTTPException(
        status_code=400,
        detail="결제 처리에 실패했습니다. 카드 정보를 확인해주세요."
    )
except NetworkError as e:
    # 네트워크 연결 문제
    logger.error(f"네트워크 오류: {e}")
    raise HTTPException(
        status_code=503,
        detail="일시적인 네트워크 오류입니다. 잠시 후 다시 시도해주세요."
    )
```

### 테스트 코드

```python
# ✅ 좋은 예 - 테스트 함수명은 영어, 주석은 한글
def test_user_creation_with_valid_data():
    """유효한 데이터로 사용자 생성 시 성공해야 함"""
    # Given: 유효한 사용자 데이터 준비
    user_data = {
        "name": "홍길동",
        "email": "hong@example.com"
    }
    
    # When: 사용자 생성 실행
    user = create_user(user_data)
    
    # Then: 사용자가 정상적으로 생성되어야 함
    assert user.name == "홍길동"
    assert user.email == "hong@example.com"
    assert user.is_active is True

def test_user_creation_fails_with_duplicate_email():
    """중복된 이메일로 사용자 생성 시 실패해야 함"""
    # 테스트 로직...
```

### 예외 상황

**영어가 필요한 경우**:
- 외부 API 응답 메시지 (외부 시스템이 영어를 요구하는 경우)
- 국제 표준 에러 코드
- 데이터베이스 컬럼명 (기술적 제약)

```python
# 외부 API 호출 시
response = {
    "status": "success",  # 외부 API 스펙에 맞춤
    "message": "결제가 완료되었습니다"  # 내부 메시지는 한글
}
```

---

## 💬 주석 및 문서화

### Docstring
```python
# ✅ 좋은 예 - 명확한 설명
def calculate_discount(price: float, discount_rate: float) -> float:
    """
    할인율을 적용하여 최종 가격을 계산합니다.
    
    Args:
        price: 원래 가격 (양수)
        discount_rate: 할인율 (0.0 ~ 1.0)
        
    Returns:
        할인이 적용된 최종 가격
        
    Raises:
        ValueError: price가 음수이거나 discount_rate가 범위를 벗어난 경우
        
    Example:
        >>> calculate_discount(100.0, 0.2)
        80.0
    """
    if price < 0:
        raise ValueError("가격은 음수일 수 없습니다")
    if not 0 <= discount_rate <= 1:
        raise ValueError("할인율은 0과 1 사이여야 합니다")
    
    return price * (1 - discount_rate)
```

### 인라인 주석
```python
# ✅ 좋은 예 - 복잡한 로직 설명
# 사용자가 최근 30일 내에 3번 이상 구매한 경우 VIP로 분류
if purchase_count >= 3 and days_since_last_purchase <= 30:
    user.tier = "VIP"

# ❌ 나쁜 예 - 자명한 내용 반복
# 나이를 1 증가시킴
age = age + 1
```

### TODO 주석
```python
# TODO: 성능 최적화 필요 - 데이터베이스 쿼리를 배치로 변경
# FIXME: 동시성 문제 - 여러 요청이 동시에 들어올 때 충돌 가능
# HACK: 임시 해결책 - API 응답이 느려서 타임아웃 2배로 증가
# NOTE: 이 로직은 레거시 시스템과의 호환성을 위해 유지됨
```

---

## 🧪 테스트 코드

### 테스트 함수명
```python
# ✅ 좋은 예 - 무엇을 테스트하는지 명확
def test_calculate_discount_returns_correct_value_for_valid_input():
    assert calculate_discount(100.0, 0.2) == 80.0

def test_calculate_discount_raises_error_for_negative_price():
    with pytest.raises(ValueError):
        calculate_discount(-100.0, 0.2)

def test_user_authentication_succeeds_with_correct_credentials():
    pass

# ❌ 나쁜 예 - 모호한 이름
def test_discount():
    pass

def test_user():
    pass
```

### 테스트 구조 (AAA 패턴)
```python
def test_create_user_with_valid_data():
    # Arrange - 준비
    user_data = {
        "name": "홍길동",
        "email": "hong@example.com",
        "password": "secure123"
    }
    
    # Act - 실행
    user = create_user(user_data)
    
    # Assert - 검증
    assert user.name == "홍길동"
    assert user.email == "hong@example.com"
    assert user.is_active is True
```

---

## 🔐 보안 규칙

### 절대 금지
```python
# ❌ 절대 금지 - 하드코딩된 비밀정보
API_KEY = "abc123xyz789"
DATABASE_PASSWORD = "admin123"
SECRET_TOKEN = "my-secret-token"

# ✅ 올바른 방법 - 환경변수 사용
import os
API_KEY = os.getenv("API_KEY")
DATABASE_PASSWORD = os.getenv("DB_PASSWORD")
SECRET_TOKEN = os.getenv("SECRET_TOKEN")

# ✅ 더 나은 방법 - 타입 체크와 기본값
from typing import Optional

def get_env_variable(key: str, default: Optional[str] = None) -> str:
    value = os.getenv(key, default)
    if value is None:
        raise EnvironmentError(f"필수 환경변수 {key}가 설정되지 않았습니다")
    return value

API_KEY = get_env_variable("API_KEY")
```

### 로깅 주의
```python
# ❌ 위험 - 민감 정보 로깅
logger.info(f"사용자 로그인: {email}, 비밀번호: {password}")

# ✅ 안전 - 민감 정보 제외
logger.info(f"사용자 로그인 시도: {email}")
```

---

## 📦 의존성 관리

### requirements.txt
```txt
# 버전 명시 (보안 및 재현성)
flask==2.3.0
requests==2.31.0
sqlalchemy==2.0.0

# 개발 의존성은 별도 파일
# requirements-dev.txt
pytest==7.4.0
black==23.3.0
```

### 임포트 최소화
```python
# ❌ 나쁜 예 - 사용하지 않는 임포트
import os
import sys
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# ✅ 좋은 예 - 필요한 것만
from datetime import datetime
from typing import Optional
```

---

## 💡 추가 권장사항

### 매직 넘버 제거
```python
# ❌ 나쁜 예
if age > 18:
    pass

if retry_count < 3:
    pass

# ✅ 좋은 예
ADULT_AGE = 18
MAX_RETRY_COUNT = 3

if age > ADULT_AGE:
    pass

if retry_count < MAX_RETRY_COUNT:
    pass
```

### 조기 반환 (Early Return)
```python
# ❌ 나쁜 예 - 중첩된 조건
def process_payment(user, amount):
    if user is not None:
        if user.is_active:
            if amount > 0:
                # 실제 로직
                return True
    return False

# ✅ 좋은 예 - 조기 반환
def process_payment(user, amount):
    if user is None:
        return False
    if not user.is_active:
        return False
    if amount <= 0:
        return False
    
    # 실제 로직
    return True
```

---

**※ 이 컨벤션은 팀의 합의에 따라 조정 가능합니다. 변경 시 이 문서를 업데이트하세요.**
