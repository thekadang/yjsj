/**
 * 친구 시스템 테이블 생성 스크립트
 * 실행: npx ts-node src/setup-friend-tables.ts
 */

import pool, { query } from './config/db';

async function setupFriendTables() {
  console.log('🚀 친구 시스템 테이블 생성 시작...\n');

  try {
    // 1. relationship_types 테이블
    console.log('📋 relationship_types 테이블 생성...');
    await query(`
      CREATE TABLE IF NOT EXISTS relationship_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        display_name VARCHAR(50) NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

    // 초기 데이터 삽입
    console.log('📋 relationship_types 초기 데이터 삽입...');
    await query(`
      INSERT INTO relationship_types (id, name, display_name, sort_order) VALUES
        (1, 'family', '가족', 1),
        (2, 'close_friend', '찐친', 2),
        (3, 'friend', '친구', 3)
      ON CONFLICT (id) DO NOTHING
    `);

    // 시퀀스 재설정
    await query(`SELECT setval('relationship_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM relationship_types))`);

    // 2. friend_requests 테이블
    console.log('📋 friend_requests 테이블 생성...');
    await query(`
      CREATE TABLE IF NOT EXISTS friend_requests (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender_proposed_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sender_id, receiver_id)
      )
    `);

    // 3. friendships 테이블
    console.log('📋 friendships 테이블 생성...');
    await query(`
      CREATE TABLE IF NOT EXISTS friendships (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        relationship_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, friend_id)
      )
    `);

    // 4. diary_visibility 테이블
    console.log('📋 diary_visibility 테이블 생성...');
    await query(`
      CREATE TABLE IF NOT EXISTS diary_visibility (
        diary_id INTEGER NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
        relationship_type_id INTEGER NOT NULL REFERENCES relationship_types(id),
        PRIMARY KEY (diary_id, relationship_type_id)
      )
    `);

    // 5. 인덱스 생성
    console.log('📋 인덱스 생성...');
    await query(`CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_diary_visibility_diary ON diary_visibility(diary_id)`);

    // 확인
    console.log('\n✅ 테이블 생성 완료! 확인 중...\n');

    const result = await query(`
      SELECT 'relationship_types' as table_name, COUNT(*) as count FROM relationship_types
      UNION ALL
      SELECT 'friend_requests', COUNT(*) FROM friend_requests
      UNION ALL
      SELECT 'friendships', COUNT(*) FROM friendships
      UNION ALL
      SELECT 'diary_visibility', COUNT(*) FROM diary_visibility
    `);

    console.log('📊 테이블 현황:');
    result.rows.forEach((row: { table_name: string; count: string }) => {
      console.log(`   - ${row.table_name}: ${row.count}개 레코드`);
    });

    // relationship_types 데이터 확인
    const types = await query('SELECT * FROM relationship_types ORDER BY sort_order');
    console.log('\n📊 관계 타입 목록:');
    types.rows.forEach((type: { id: number; name: string; display_name: string }) => {
      console.log(`   - ${type.id}: ${type.display_name} (${type.name})`);
    });

    console.log('\n🎉 친구 시스템 테이블 설정 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await pool.end();
  }
}

setupFriendTables();
