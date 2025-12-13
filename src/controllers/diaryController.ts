/**
 * 일기장 컨트롤러
 * 일기 CRUD 및 공개범위 설정
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/db';

// 공개 범위 타입 정의
type VisibilityType = 'private' | 'family' | 'close_friend' | 'friend' | 'public';

// 공개 범위 타입을 ID로 매핑
const VISIBILITY_TYPE_TO_ID: Record<VisibilityType, number> = {
  'private': 0,
  'family': 1,
  'close_friend': 2,
  'friend': 3,
  'public': 99,
};

/**
 * 일기 작성
 * POST /api/diaries
 *
 * visibilityTypes: string[] - ['private', 'family', 'close_friend', 'friend', 'public']
 */
export const createDiary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { content, audioUrl, visibilityTypes } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: '일기 내용이 필요합니다.' });
    }

    if (!visibilityTypes || !Array.isArray(visibilityTypes) || visibilityTypes.length === 0) {
      return res.status(400).json({ success: false, error: '공개 범위를 선택해주세요.' });
    }

    // 일기 저장
    const diaryResult = await query(
      `INSERT INTO diaries (user_id, content, audio_url)
       VALUES ($1, $2, $3)
       RETURNING id, content, audio_url, created_at`,
      [req.user.id, content.trim(), audioUrl || null]
    );

    const diary = diaryResult.rows[0];

    // 공개범위 저장 (문자열 타입을 ID로 변환)
    const typeIds = visibilityTypes
      .filter((type: string) => type in VISIBILITY_TYPE_TO_ID)
      .map((type: string) => VISIBILITY_TYPE_TO_ID[type as VisibilityType]);

    if (typeIds.length > 0) {
      const visibilityValues = typeIds.map((typeId: number) =>
        `(${diary.id}, ${typeId})`
      ).join(', ');

      await query(`INSERT INTO diary_visibility (diary_id, relationship_type_id) VALUES ${visibilityValues}`);
    }

    // 설정된 공개범위 조회
    const visibilityResult = await query(
      `SELECT rt.id, rt.name, rt.display_name
       FROM diary_visibility dv
       JOIN relationship_types rt ON dv.relationship_type_id = rt.id
       WHERE dv.diary_id = $1
       ORDER BY rt.sort_order`,
      [diary.id]
    );

    res.status(201).json({
      success: true,
      data: {
        id: diary.id,
        content: diary.content,
        audioUrl: diary.audio_url,
        createdAt: diary.created_at,
        visibility: visibilityResult.rows
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 작성 실패';
    console.error('일기 작성 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 내 일기 목록 조회
 * GET /api/diaries/my
 */
export const getMyDiaries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // 전체 개수 조회
    const countResult = await query(
      'SELECT COUNT(*) as total FROM diaries WHERE user_id = $1',
      [req.user.id]
    );
    const total = parseInt(countResult.rows[0].total);

    // 일기 목록 조회
    const diariesResult = await query(
      `SELECT id, content, audio_url, created_at
       FROM diaries
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limitNum, offset]
    );

    // 각 일기의 공개범위 조회
    const diaries = await Promise.all(
      diariesResult.rows.map(async (diary) => {
        const visibilityResult = await query(
          `SELECT rt.id, rt.name, rt.display_name
           FROM diary_visibility dv
           JOIN relationship_types rt ON dv.relationship_type_id = rt.id
           WHERE dv.diary_id = $1`,
          [diary.id]
        );

        return {
          id: diary.id,
          content: diary.content,
          audioUrl: diary.audio_url,
          createdAt: diary.created_at,
          visibility: visibilityResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: diaries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 조회 실패';
    console.error('일기 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 일기 상세 조회
 * GET /api/diaries/:diaryId
 */
export const getDiaryById = async (req: AuthRequest, res: Response) => {
  try {
    const { diaryId } = req.params;
    const userId = req.user?.id;

    // 일기 조회
    const diaryResult = await query(
      `SELECT d.id, d.user_id, d.content, d.audio_url, d.created_at,
              u.username, u.name as author_name
       FROM diaries d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
      [parseInt(diaryId)]
    );

    if (diaryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '일기를 찾을 수 없습니다.' });
    }

    const diary = diaryResult.rows[0];

    // 본인 일기인 경우 바로 반환
    if (diary.user_id === userId) {
      const visibilityResult = await query(
        `SELECT rt.id, rt.name, rt.display_name
         FROM diary_visibility dv
         JOIN relationship_types rt ON dv.relationship_type_id = rt.id
         WHERE dv.diary_id = $1`,
        [diary.id]
      );

      return res.json({
        success: true,
        data: {
          id: diary.id,
          content: diary.content,
          audioUrl: diary.audio_url,
          createdAt: diary.created_at,
          author: {
            id: diary.user_id,
            username: diary.username,
            name: diary.author_name
          },
          visibility: visibilityResult.rows,
          isOwner: true
        }
      });
    }

    // 타인의 일기인 경우 권한 확인
    if (!userId) {
      return res.status(403).json({ success: false, error: '이 일기를 볼 권한이 없습니다.' });
    }

    // 친구 관계 확인 및 공개범위 확인
    const accessResult = await query(
      `SELECT f.relationship_type_id
       FROM friendships f
       WHERE f.user_id = $1 AND f.friend_id = $2`,
      [diary.user_id, userId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(403).json({ success: false, error: '이 일기를 볼 권한이 없습니다.' });
    }

    const myRelationshipTypeId = accessResult.rows[0].relationship_type_id;

    // 공개범위에 내 관계 타입이 포함되어 있는지 확인
    const visibilityCheck = await query(
      `SELECT 1 FROM diary_visibility
       WHERE diary_id = $1 AND relationship_type_id = $2`,
      [diary.id, myRelationshipTypeId]
    );

    if (visibilityCheck.rows.length === 0) {
      return res.status(403).json({ success: false, error: '이 일기를 볼 권한이 없습니다.' });
    }

    res.json({
      success: true,
      data: {
        id: diary.id,
        content: diary.content,
        audioUrl: diary.audio_url,
        createdAt: diary.created_at,
        author: {
          id: diary.user_id,
          username: diary.username,
          name: diary.author_name
        },
        isOwner: false
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 조회 실패';
    console.error('일기 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 친구의 공개된 일기 목록 조회
 * GET /api/diaries/friend/:friendId
 */
export const getFriendDiaries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { friendId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // 친구 관계 및 관계 타입 확인
    const friendshipResult = await query(
      `SELECT relationship_type_id FROM friendships
       WHERE user_id = $1 AND friend_id = $2`,
      [parseInt(friendId), req.user.id]
    );

    if (friendshipResult.rows.length === 0) {
      return res.status(403).json({ success: false, error: '친구가 아닙니다.' });
    }

    const myRelationshipTypeId = friendshipResult.rows[0].relationship_type_id;

    // 공개된 일기만 조회
    const countResult = await query(
      `SELECT COUNT(DISTINCT d.id) as total
       FROM diaries d
       JOIN diary_visibility dv ON d.id = dv.diary_id
       WHERE d.user_id = $1 AND dv.relationship_type_id = $2`,
      [parseInt(friendId), myRelationshipTypeId]
    );
    const total = parseInt(countResult.rows[0].total);

    const diariesResult = await query(
      `SELECT DISTINCT d.id, d.content, d.audio_url, d.created_at
       FROM diaries d
       JOIN diary_visibility dv ON d.id = dv.diary_id
       WHERE d.user_id = $1 AND dv.relationship_type_id = $2
       ORDER BY d.created_at DESC
       LIMIT $3 OFFSET $4`,
      [parseInt(friendId), myRelationshipTypeId, limitNum, offset]
    );

    res.json({
      success: true,
      data: diariesResult.rows.map(diary => ({
        id: diary.id,
        content: diary.content,
        audioUrl: diary.audio_url,
        createdAt: diary.created_at
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 조회 실패';
    console.error('일기 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 일기 수정
 * PUT /api/diaries/:diaryId
 *
 * visibilityTypes: string[] - ['private', 'family', 'close_friend', 'friend', 'public']
 */
export const updateDiary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { diaryId } = req.params;
    const { content, audioUrl, visibilityTypes } = req.body;

    // 소유권 확인
    const diaryResult = await query(
      'SELECT * FROM diaries WHERE id = $1 AND user_id = $2',
      [parseInt(diaryId), req.user.id]
    );

    if (diaryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '일기를 찾을 수 없습니다.' });
    }

    // 일기 업데이트
    const updateResult = await query(
      `UPDATE diaries
       SET content = COALESCE($1, content),
           audio_url = COALESCE($2, audio_url)
       WHERE id = $3
       RETURNING id, content, audio_url, created_at`,
      [content?.trim(), audioUrl, parseInt(diaryId)]
    );

    // 공개범위 업데이트 (문자열 타입을 ID로 변환)
    if (visibilityTypes && Array.isArray(visibilityTypes)) {
      // 기존 공개범위 삭제
      await query('DELETE FROM diary_visibility WHERE diary_id = $1', [parseInt(diaryId)]);

      // 새 공개범위 추가
      const typeIds = visibilityTypes
        .filter((type: string) => type in VISIBILITY_TYPE_TO_ID)
        .map((type: string) => VISIBILITY_TYPE_TO_ID[type as VisibilityType]);

      if (typeIds.length > 0) {
        const visibilityValues = typeIds.map((typeId: number) =>
          `(${diaryId}, ${typeId})`
        ).join(', ');

        await query(`INSERT INTO diary_visibility (diary_id, relationship_type_id) VALUES ${visibilityValues}`);
      }
    }

    // 업데이트된 공개범위 조회
    const visibilityResult = await query(
      `SELECT rt.id, rt.name, rt.display_name
       FROM diary_visibility dv
       JOIN relationship_types rt ON dv.relationship_type_id = rt.id
       WHERE dv.diary_id = $1
       ORDER BY rt.sort_order`,
      [parseInt(diaryId)]
    );

    const diary = updateResult.rows[0];

    res.json({
      success: true,
      data: {
        id: diary.id,
        content: diary.content,
        audioUrl: diary.audio_url,
        createdAt: diary.created_at,
        visibility: visibilityResult.rows
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 수정 실패';
    console.error('일기 수정 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 일기 삭제
 * DELETE /api/diaries/:diaryId
 */
export const deleteDiary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { diaryId } = req.params;

    // 소유권 확인 및 삭제
    const result = await query(
      'DELETE FROM diaries WHERE id = $1 AND user_id = $2 RETURNING id',
      [parseInt(diaryId), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '일기를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '일기가 삭제되었습니다.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '일기 삭제 실패';
    console.error('일기 삭제 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 친구들의 최신 일기 피드 조회
 * GET /api/diaries/feed
 *
 * 내가 볼 수 있는 권한이 있는 친구들의 일기만 반환
 * - 친구가 나를 어떤 관계 타입으로 설정했는지 확인
 * - 해당 관계 타입이 일기의 공개범위에 포함되어 있는지 확인
 */
export const getFriendsFeed = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // 내가 볼 수 있는 일기 총 개수 조회
    // 조건: 친구가 나를 설정한 관계 타입이 일기의 공개범위에 포함되어야 함
    const countResult = await query(
      `SELECT COUNT(DISTINCT d.id) as total
       FROM diaries d
       JOIN friendships f ON d.user_id = f.user_id AND f.friend_id = $1
       JOIN diary_visibility dv ON d.id = dv.diary_id AND dv.relationship_type_id = f.relationship_type_id`,
      [req.user.id]
    );
    const total = parseInt(countResult.rows[0].total);

    // 친구들의 일기 피드 조회 (작성자 정보 포함)
    const feedResult = await query(
      `SELECT DISTINCT
         d.id,
         d.content,
         d.audio_url,
         d.created_at,
         u.id as author_id,
         u.name as author_name,
         u.username as author_username,
         u.profile_image as author_profile_image,
         rt.display_name as relationship_display_name
       FROM diaries d
       JOIN users u ON d.user_id = u.id
       JOIN friendships f ON d.user_id = f.user_id AND f.friend_id = $1
       JOIN diary_visibility dv ON d.id = dv.diary_id AND dv.relationship_type_id = f.relationship_type_id
       JOIN relationship_types rt ON f.relationship_type_id = rt.id
       ORDER BY d.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limitNum, offset]
    );

    // 각 일기의 공개범위 조회
    const diaries = await Promise.all(
      feedResult.rows.map(async (diary) => {
        const visibilityResult = await query(
          `SELECT rt.id, rt.name, rt.display_name
           FROM diary_visibility dv
           JOIN relationship_types rt ON dv.relationship_type_id = rt.id
           WHERE dv.diary_id = $1`,
          [diary.id]
        );

        return {
          id: diary.id,
          content: diary.content,
          audioUrl: diary.audio_url,
          createdAt: diary.created_at,
          author: {
            id: diary.author_id,
            name: diary.author_name,
            username: diary.author_username,
            profileImage: diary.author_profile_image
          },
          relationshipToMe: diary.relationship_display_name,
          visibility: visibilityResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: diaries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '피드 조회 실패';
    console.error('피드 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};
