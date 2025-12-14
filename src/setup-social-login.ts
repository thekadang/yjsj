/**
 * 소셜 로그인 필드 추가 마이그레이션 스크립트
 * 실행: npx ts-node src/setup-social-login.ts
 */

import pool, { query } from './config/db';

async function setupSocialLoginFields() {
  console.log('🔄 소셜 로그인 필드 마이그레이션 시작...\n');

  try {
    // 1. provider 컬럼 추가
    console.log('1. provider 컬럼 추가...');
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'local'
    `);
    console.log('   ✅ provider 컬럼 추가 완료');

    // 2. provider_id 컬럼 추가
    console.log('2. provider_id 컬럼 추가...');
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(100)
    `);
    console.log('   ✅ provider_id 컬럼 추가 완료');

    // 3. profile_image_url 컬럼 추가
    console.log('3. profile_image_url 컬럼 추가...');
    await query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT
    `);
    console.log('   ✅ profile_image_url 컬럼 추가 완료');

    // 4. password 컬럼 NULL 허용
    console.log('4. password 컬럼 NULL 허용...');
    await query(`
      ALTER TABLE users ALTER COLUMN password DROP NOT NULL
    `);
    console.log('   ✅ password NULL 허용 완료');

    // 5. 인덱스 생성
    console.log('5. 인덱스 생성...');
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider)
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider, provider_id)
    `);
    console.log('   ✅ 인덱스 생성 완료');

    // 6. 유니크 인덱스 생성
    console.log('6. 유니크 인덱스 생성...');
    await query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_unique
      ON users(provider, provider_id)
      WHERE provider_id IS NOT NULL
    `);
    console.log('   ✅ 유니크 인덱스 생성 완료');

    // 결과 확인
    console.log('\n📋 users 테이블 구조 확인:');
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('┌────────────────────────┬───────────────┬──────────┬─────────────────┐');
    console.log('│ Column                 │ Type          │ Nullable │ Default         │');
    console.log('├────────────────────────┼───────────────┼──────────┼─────────────────┤');
    result.rows.forEach(row => {
      const col = row.column_name.padEnd(22);
      const type = row.data_type.substring(0, 13).padEnd(13);
      const nullable = row.is_nullable.padEnd(8);
      const def = (row.column_default || '').substring(0, 15).padEnd(15);
      console.log(`│ ${col} │ ${type} │ ${nullable} │ ${def} │`);
    });
    console.log('└────────────────────────┴───────────────┴──────────┴─────────────────┘');

    console.log('\n✅ 소셜 로그인 필드 마이그레이션 완료!');

  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

setupSocialLoginFields();
