/**
 * 카카오 OAuth 인증 컨트롤러
 */

import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

// 카카오 API 응답 타입
interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoUserResponse {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email_needs_agreement?: boolean;
    email?: string;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
  };
}

/**
 * 카카오 인가 코드로 액세스 토큰 발급
 */
const getKakaoToken = async (code: string): Promise<KakaoTokenResponse> => {
  const tokenUrl = 'https://kauth.kakao.com/oauth/token';

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    code: code,
  });

  // client_secret이 있는 경우 추가 (선택 사항)
  if (process.env.KAKAO_CLIENT_SECRET) {
    params.append('client_secret', process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await axios.post<KakaoTokenResponse>(tokenUrl, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  return response.data;
};

/**
 * 액세스 토큰으로 카카오 사용자 정보 조회
 */
const getKakaoUser = async (accessToken: string): Promise<KakaoUserResponse> => {
  const userUrl = 'https://kapi.kakao.com/v2/user/me';

  const response = await axios.get<KakaoUserResponse>(userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  return response.data;
};

/**
 * 카카오 로그인 콜백 처리
 * POST /api/auth/kakao/callback
 */
export const kakaoCallback = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: '인가 코드가 필요합니다.' });
  }

  try {
    // 1. 인가 코드로 액세스 토큰 발급
    console.log('🔄 카카오 토큰 요청 중...');
    const tokenData = await getKakaoToken(code);
    console.log('✅ 카카오 토큰 발급 완료');

    // 2. 액세스 토큰으로 사용자 정보 조회
    console.log('🔄 카카오 사용자 정보 요청 중...');
    const kakaoUser = await getKakaoUser(tokenData.access_token);
    console.log('✅ 카카오 사용자 정보 조회 완료:', kakaoUser.id);

    const kakaoId = kakaoUser.id.toString();
    const nickname = kakaoUser.properties?.nickname ||
                     kakaoUser.kakao_account?.profile?.nickname ||
                     `카카오사용자${kakaoId.slice(-4)}`;

    // 추후 scope 확장 시 활성화 (현재는 동의항목 미설정)
    const email = kakaoUser.kakao_account?.email || null;
    const profileImage = kakaoUser.properties?.profile_image ||
                         kakaoUser.kakao_account?.profile?.profile_image_url || null;

    // 3. 기존 사용자 조회 (카카오 ID로)
    let userResult = await query(
      'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
      ['kakao', kakaoId]
    );

    let user;
    let isNewUser = false;

    if (userResult.rows.length > 0) {
      // 기존 사용자 - 프로필 이미지 업데이트
      user = userResult.rows[0];
      console.log('✅ 기존 카카오 사용자:', user.id);

      if (profileImage && profileImage !== user.profile_image_url) {
        await query(
          'UPDATE users SET profile_image_url = $1 WHERE id = $2',
          [profileImage, user.id]
        );
        user.profile_image_url = profileImage;
      }
    } else {
      // 신규 사용자 생성
      isNewUser = true;
      console.log('🆕 신규 카카오 사용자 생성 중...');

      // 이메일이 있으면 이미 해당 이메일로 가입된 계정이 있는지 확인
      if (email) {
        const existingEmailUser = await query(
          'SELECT * FROM users WHERE username = $1',
          [email]
        );

        if (existingEmailUser.rows.length > 0) {
          // 기존 이메일 계정에 카카오 연동
          const existingUser = existingEmailUser.rows[0];
          await query(
            'UPDATE users SET provider = $1, provider_id = $2, profile_image_url = $3 WHERE id = $4',
            ['kakao', kakaoId, profileImage, existingUser.id]
          );
          user = { ...existingUser, provider: 'kakao', provider_id: kakaoId, profile_image_url: profileImage };
          isNewUser = false;
          console.log('✅ 기존 이메일 계정에 카카오 연동:', existingUser.id);
        }
      }

      if (!user) {
        // 완전히 새로운 사용자 생성
        const username = email || `kakao_${kakaoId}`;

        const insertResult = await query(
          `INSERT INTO users (username, name, provider, provider_id, profile_image_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, username, name, provider, provider_id, profile_image_url, birthdate`,
          [username, nickname, 'kakao', kakaoId, profileImage]
        );

        user = insertResult.rows[0];
        console.log('✅ 신규 사용자 생성 완료:', user.id);
      }
    }

    // 4. JWT 토큰 생성
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // 5. 응답 (ApiResponse 형식에 맞춰 data로 래핑)
    console.log('✅ 카카오 로그인 완료:', { userId: user.id, isNewUser });
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          birthdate: user.birthdate,
          profile_image_url: user.profile_image_url,
          provider: user.provider,
        },
        isNewUser, // 프론트엔드에서 추가 정보 입력 유도에 사용
      },
    });

  } catch (error) {
    console.error('❌ 카카오 로그인 오류:', error);

    if (axios.isAxiosError(error)) {
      const kakaoError = error.response?.data;
      console.error('카카오 API 오류:', kakaoError);
      return res.status(400).json({
        error: '카카오 로그인 처리 중 오류가 발생했습니다.',
        details: kakaoError
      });
    }

    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
};

/**
 * 카카오 로그인 URL 생성
 * GET /api/auth/kakao/url
 *
 * 현재 사용 scope: profile_nickname (닉네임만)
 *
 * 추후 추가 예정 scope:
 * - account_email: 이메일
 * - profile_image: 프로필 이미지
 * - name: 실명 (비즈 앱 전용)
 * - phone_number: 전화번호 (비즈 앱 전용)
 * - birthyear, birthday: 생년월일 (비즈 앱 전용)
 */
export const getKakaoAuthUrl = (req: Request, res: Response) => {
  const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';

  // 현재는 닉네임만 요청 (추후 동의항목 설정 후 확장 가능)
  const currentScope = 'profile_nickname';

  // 추후 확장 시 아래 scope 사용
  // const fullScope = 'profile_nickname profile_image account_email';

  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    response_type: 'code',
    scope: currentScope,
  });

  const url = `${kakaoAuthUrl}?${params.toString()}`;

  res.json({ success: true, data: { url } });
};

/**
 * 카카오 계정 연결 해제 (회원 탈퇴 시)
 */
export const unlinkKakao = async (kakaoAccessToken: string): Promise<void> => {
  try {
    await axios.post(
      'https://kapi.kakao.com/v1/user/unlink',
      {},
      {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      }
    );
  } catch (error) {
    console.error('Kakao unlink error:', error);
    throw error;
  }
};
