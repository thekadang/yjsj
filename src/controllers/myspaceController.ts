/**
 * 마이스페이스 컨트롤러
 * 사용자 공간 통합 데이터 조회
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/db';
import path from 'path';

/**
 * 내 마이스페이스 데이터 조회
 * GET /api/myspace/my
 */
export const getMySpace = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    // 사용자 정보 조회
    const userResult = await query(
      `SELECT id, username, name, phone_number, birthdate, address, detail_address,
              insurance_status, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
    }

    const user = userResult.rows[0];

    // 프로필 이미지 조회 (가장 최근 이미지)
    const profileImageResult = await query(
      `SELECT filename FROM media
       WHERE user_id = $1 AND type = 'image' AND is_thumbnail = false
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );

    // 최근 일기 조회 (최대 5개)
    const diariesResult = await query(
      `SELECT d.id, d.content, d.audio_url, d.created_at,
              ARRAY_AGG(DISTINCT rt.display_name) as visibility
       FROM diaries d
       LEFT JOIN diary_visibility dv ON d.id = dv.diary_id
       LEFT JOIN relationship_types rt ON dv.relationship_type_id = rt.id
       WHERE d.user_id = $1
       GROUP BY d.id
       ORDER BY d.created_at DESC
       LIMIT 5`,
      [req.user.id]
    );

    // 미디어 갤러리 조회 (최대 12개)
    const mediaResult = await query(
      `SELECT id, type, filename, original_filename, created_at
       FROM media
       WHERE user_id = $1 AND is_thumbnail = false
       ORDER BY created_at DESC
       LIMIT 12`,
      [req.user.id]
    );

    // 친구 통계
    const friendStatsResult = await query(
      `SELECT rt.display_name, COUNT(*) as count
       FROM friendships f
       JOIN relationship_types rt ON f.relationship_type_id = rt.id
       WHERE f.user_id = $1
       GROUP BY rt.display_name, rt.sort_order
       ORDER BY rt.sort_order`,
      [req.user.id]
    );

    // 남기는 말 조회 (user_messages 테이블에서)
    const epitaphResult = await query(
      `SELECT content FROM user_messages
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );

    const profileImage = profileImageResult.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          phone: user.phone_number,
          birthdate: user.birthdate,
          address: user.address,
          detailAddress: user.detail_address,
          insuranceStatus: user.insurance_status,
          joinedAt: user.created_at
        },
        profileImage: profileImage ? {
          url: `/uploads/${profileImage.filename}`,
          thumbnailUrl: `/uploads/${path.parse(profileImage.filename).name}_thumb.webp`
        } : null,
        epitaph: epitaphResult.rows[0]?.content || null,
        recentDiaries: diariesResult.rows.map(diary => ({
          id: diary.id,
          content: diary.content.substring(0, 200),
          audioUrl: diary.audio_url,
          createdAt: diary.created_at,
          visibility: diary.visibility.filter(Boolean)
        })),
        mediaGallery: mediaResult.rows.map(media => ({
          id: media.id,
          type: media.type,
          filename: media.filename,
          originalName: media.original_filename,
          createdAt: media.created_at,
          url: `/uploads/${media.filename}`,
          thumbnailUrl: media.type === 'image'
            ? `/uploads/${path.parse(media.filename).name}_thumb.webp`
            : null
        })),
        friendStats: friendStatsResult.rows.reduce((acc, row) => {
          acc[row.display_name] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        totalDiaries: diariesResult.rows.length,
        totalMedia: mediaResult.rows.length
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '마이스페이스 조회 실패';
    console.error('마이스페이스 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 다른 사용자의 마이스페이스 조회
 * GET /api/myspace/user/:userId
 */
export const getUserSpace = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;

    // 사용자 정보 조회
    const userResult = await query(
      `SELECT id, username, name, created_at FROM users WHERE id = $1`,
      [parseInt(userId)]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
    }

    const user = userResult.rows[0];

    // 프로필 이미지 조회
    const profileImageResult = await query(
      `SELECT filename FROM media
       WHERE user_id = $1 AND type = 'image' AND is_thumbnail = false
       ORDER BY created_at DESC LIMIT 1`,
      [parseInt(userId)]
    );

    // 친구 관계 확인
    let relationship = null;
    let accessibleDiaries: { id: number; content: string; createdAt: string }[] = [];

    if (viewerId) {
      const friendshipResult = await query(
        `SELECT f.relationship_type_id, rt.display_name
         FROM friendships f
         JOIN relationship_types rt ON f.relationship_type_id = rt.id
         WHERE f.user_id = $1 AND f.friend_id = $2`,
        [parseInt(userId), viewerId]
      );

      if (friendshipResult.rows.length > 0) {
        relationship = {
          typeId: friendshipResult.rows[0].relationship_type_id,
          displayName: friendshipResult.rows[0].display_name
        };

        // 친구에게 공개된 일기 조회
        const diariesResult = await query(
          `SELECT DISTINCT d.id, d.content, d.created_at
           FROM diaries d
           JOIN diary_visibility dv ON d.id = dv.diary_id
           WHERE d.user_id = $1 AND dv.relationship_type_id = $2
           ORDER BY d.created_at DESC
           LIMIT 5`,
          [parseInt(userId), relationship.typeId]
        );

        accessibleDiaries = diariesResult.rows.map(diary => ({
          id: diary.id,
          content: diary.content.substring(0, 200),
          createdAt: diary.created_at
        }));
      }
    }

    // 공개 미디어 조회
    const mediaResult = await query(
      `SELECT id, type, filename, original_filename, created_at
       FROM media
       WHERE user_id = $1 AND is_thumbnail = false
       ORDER BY created_at DESC
       LIMIT 12`,
      [parseInt(userId)]
    );

    // 남기는 말 조회 (user_messages 테이블에서 - 모든 방문자에게 공개)
    const epitaphResult = await query(
      `SELECT content FROM user_messages
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC LIMIT 1`,
      [parseInt(userId)]
    );
    const epitaph = epitaphResult.rows[0]?.content || null;

    const profileImage = profileImageResult.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          joinedAt: user.created_at
        },
        profileImage: profileImage ? {
          url: `/uploads/${profileImage.filename}`,
          thumbnailUrl: `/uploads/${path.parse(profileImage.filename).name}_thumb.webp`
        } : null,
        relationship,
        epitaph,
        accessibleDiaries,
        mediaGallery: mediaResult.rows.map(media => ({
          id: media.id,
          type: media.type,
          filename: media.filename,
          originalName: media.original_filename,
          createdAt: media.created_at,
          url: `/uploads/${media.filename}`,
          thumbnailUrl: media.type === 'image'
            ? `/uploads/${path.parse(media.filename).name}_thumb.webp`
            : null
        })),
        isFriend: !!relationship,
        isOwner: viewerId === parseInt(userId)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '마이스페이스 조회 실패';
    console.error('마이스페이스 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

// 남기는 말 기능은 /api/messages 라우트로 이동되었습니다.
// 자세한 내용은 messageController.ts를 참조하세요.
