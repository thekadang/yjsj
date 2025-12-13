/**
 * 공개 범위 타입 추가 스크립트
 * 비공개, 전체공개 타입을 relationship_types 테이블에 추가
 */

import { query } from './config/db';
import pool from './config/db';

async function setupVisibilityTypes() {
  try {
    console.log('🔧 공개 범위 타입 설정 시작...');

    // 비공개 타입 추가
    await query(
      `INSERT INTO relationship_types (id, name, display_name, sort_order)
       VALUES (0, 'private', '비공개', 0)
       ON CONFLICT (id) DO NOTHING`
    );
    console.log('✅ 비공개 타입 추가 완료');

    // 전체공개 타입 추가
    await query(
      `INSERT INTO relationship_types (id, name, display_name, sort_order)
       VALUES (99, 'public', '전체공개', 99)
       ON CONFLICT (id) DO NOTHING`
    );
    console.log('✅ 전체공개 타입 추가 완료');

    // 결과 확인
    const result = await query('SELECT * FROM relationship_types ORDER BY sort_order');
    console.log('\n📋 현재 공개 범위 타입 목록:');
    console.table(result.rows);

    console.log('\n✨ 공개 범위 타입 설정 완료!');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setupVisibilityTypes();
