-- 소셜 로그인 필드 추가 마이그레이션
-- 실행일: 2025-12-14
-- 목적: 카카오, 구글, 네이버 등 소셜 로그인 지원

-- 소셜 로그인 제공자 (kakao, google, naver 등)
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'local';

-- 소셜 로그인 고유 ID
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(100);

-- 프로필 이미지 URL (소셜 로그인에서 가져온 경우)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- 소셜 로그인 시 비밀번호는 NULL 허용
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- 인덱스 추가 (소셜 로그인 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider, provider_id);

-- provider와 provider_id 조합은 유니크해야 함
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_unique
ON users(provider, provider_id)
WHERE provider_id IS NOT NULL;

-- 확인용 쿼리
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'users';
