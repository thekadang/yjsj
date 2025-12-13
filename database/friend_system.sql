-- =====================================================
-- 친구 관계 시스템 테이블 (Friend Relationship System)
-- 이 파일을 pgAdmin에서 실행하세요
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
INSERT INTO relationship_types (id, name, display_name, sort_order) VALUES
  (1, 'family', '가족', 1),
  (2, 'close_friend', '찐친', 2),
  (3, 'friend', '친구', 3)
ON CONFLICT (id) DO NOTHING;

-- 시퀀스 재설정 (중요: 초기 데이터 이후 auto-increment가 올바르게 작동하도록)
SELECT setval('relationship_types_id_seq', (SELECT MAX(id) FROM relationship_types));

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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_diary_visibility_diary ON diary_visibility(diary_id);

-- 확인 쿼리
SELECT 'relationship_types' as table_name, COUNT(*) as count FROM relationship_types
UNION ALL
SELECT 'friend_requests', COUNT(*) FROM friend_requests
UNION ALL
SELECT 'friendships', COUNT(*) FROM friendships
UNION ALL
SELECT 'diary_visibility', COUNT(*) FROM diary_visibility;
