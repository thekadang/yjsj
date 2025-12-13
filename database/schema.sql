CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  birthdate DATE,
  address VARCHAR(255),
  detail_address VARCHAR(255),
  zipcode VARCHAR(10),
  insurance_status VARCHAR(50), -- 'joined', 'not_joined', 'consultation_requested'
  insurance_name VARCHAR(100),
  death_certifier_1_name VARCHAR(100),
  death_certifier_1_phone VARCHAR(20),
  death_certifier_1_relation VARCHAR(50),
  death_certifier_2_name VARCHAR(100),
  death_certifier_2_phone VARCHAR(20),
  death_certifier_2_relation VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'audio')),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(50),
  is_thumbnail BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diaries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  audio_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 친구 관계 시스템 테이블 (Friend Relationship System)
-- =====================================================

-- 관계 타입 (가족, 찐친, 친구)
CREATE TABLE IF NOT EXISTS relationship_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(50) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 초기 데이터 삽입 (존재하지 않는 경우에만)
-- 공개 범위 타입: private(비공개), family(가족), close_friend(찐친), friend(친구), public(전체공개)
INSERT INTO relationship_types (id, name, display_name, sort_order) VALUES
  (0, 'private', '비공개', 0),
  (1, 'family', '가족', 1),
  (2, 'close_friend', '찐친', 2),
  (3, 'friend', '친구', 3),
  (99, 'public', '전체공개', 99)
ON CONFLICT (id) DO NOTHING;

-- 친구 신청
CREATE TABLE IF NOT EXISTS friend_requests (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_proposed_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sender_id, receiver_id)
);

-- 친구 관계 (양방향 저장)
CREATE TABLE IF NOT EXISTS friendships (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, friend_id)
);

-- 일기 공개 범위 설정
CREATE TABLE IF NOT EXISTS diary_visibility (
  diary_id INTEGER NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  relationship_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
  PRIMARY KEY (diary_id, relationship_type_id)
);

-- =====================================================
-- 남기는 말 시스템 (User Messages / Epitaph)
-- =====================================================

-- 남기는 말 테이블 (일기와 별도로 관리)
CREATE TABLE IF NOT EXISTS user_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,  -- 현재 표시 중인 메시지인지
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_diary_visibility_diary ON diary_visibility(diary_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_user ON user_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_active ON user_messages(user_id, is_active);
