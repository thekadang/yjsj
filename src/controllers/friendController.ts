/**
 * 친구 관계 시스템 컨트롤러
 * 친구 검색, 신청, 수락/거절, 목록 조회 등 처리
 */

import { Request, Response } from 'express';
import { query } from '../config/db';

// 타입 정의
interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
  };
}

/**
 * 관계 타입 목록 조회
 * GET /api/friends/relationship-types
 */
export const getRelationshipTypes = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, display_name, description, sort_order FROM relationship_types ORDER BY sort_order'
    );
    res.json({ success: true, types: result.rows });
  } catch (error) {
    console.error('Get relationship types error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 회원 검색 (이름 + 연락처 기반)
 * GET /api/users/search?name=xxx&phone=xxx
 */
export const searchUsers = async (req: AuthRequest, res: Response) => {
  const { name, phone } = req.query;
  const currentUserId = req.user?.id;

  if (!name && !phone) {
    return res.status(400).json({ success: false, error: '검색 조건을 입력해주세요.' });
  }

  try {
    let queryText = `
      SELECT id, username, name, phone_number
      FROM users
      WHERE id != $1
    `;
    const params: (string | number)[] = [currentUserId || 0];
    let paramIndex = 2;

    if (name) {
      queryText += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${name}%`);
      paramIndex++;
    }

    if (phone) {
      queryText += ` AND phone_number LIKE $${paramIndex}`;
      params.push(`%${phone}%`);
      paramIndex++;
    }

    queryText += ' LIMIT 20';

    const result = await query(queryText, params);

    // 이미 친구이거나 신청 중인 관계 정보 추가
    const usersWithStatus = await Promise.all(
      result.rows.map(async (user: { id: number; username: string; name: string; phone_number: string }) => {
        // 친구 관계 확인
        const friendshipCheck = await query(
          'SELECT relationship_type_id FROM friendships WHERE user_id = $1 AND friend_id = $2',
          [currentUserId, user.id]
        );

        // 친구 신청 확인
        const requestCheck = await query(
          `SELECT id, status,
            CASE WHEN sender_id = $1 THEN 'sent' ELSE 'received' END as direction
           FROM friend_requests
           WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
           ORDER BY created_at DESC LIMIT 1`,
          [currentUserId, user.id]
        );

        return {
          ...user,
          isFriend: friendshipCheck.rows.length > 0,
          relationshipTypeId: friendshipCheck.rows[0]?.relationship_type_id || null,
          pendingRequest: requestCheck.rows.length > 0 && requestCheck.rows[0].status === 'PENDING'
            ? requestCheck.rows[0]
            : null
        };
      })
    );

    res.json({ success: true, users: usersWithStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 신청
 * POST /api/friends/request
 * Body: { receiverId: number, relationshipTypeId: number }
 */
export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  const { receiverId, relationshipTypeId } = req.body;
  const senderId = req.user?.id;

  if (!senderId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  if (!receiverId || !relationshipTypeId) {
    return res.status(400).json({ success: false, error: '필수 정보가 누락되었습니다.' });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ success: false, error: '자기 자신에게는 친구 신청을 할 수 없습니다.' });
  }

  try {
    // 이미 친구인지 확인
    const friendshipCheck = await query(
      'SELECT 1 FROM friendships WHERE user_id = $1 AND friend_id = $2',
      [senderId, receiverId]
    );

    if (friendshipCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: '이미 친구입니다.' });
    }

    // 기존 신청 확인
    const existingRequest = await query(
      `SELECT id, status FROM friend_requests
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
      [senderId, receiverId]
    );

    if (existingRequest.rows.length > 0) {
      const request = existingRequest.rows[0];
      if (request.status === 'PENDING') {
        return res.status(400).json({ success: false, error: '이미 대기 중인 친구 신청이 있습니다.' });
      }
    }

    // 관계 타입 유효성 검증
    const typeCheck = await query('SELECT id FROM relationship_types WHERE id = $1', [relationshipTypeId]);
    if (typeCheck.rows.length === 0) {
      return res.status(400).json({ success: false, error: '유효하지 않은 관계 타입입니다.' });
    }

    // 친구 신청 생성
    const result = await query(
      `INSERT INTO friend_requests (sender_id, receiver_id, sender_proposed_type_id, status)
       VALUES ($1, $2, $3, 'PENDING')
       ON CONFLICT (sender_id, receiver_id)
       DO UPDATE SET sender_proposed_type_id = $3, status = 'PENDING', updated_at = CURRENT_TIMESTAMP
       RETURNING id, sender_id, receiver_id, sender_proposed_type_id, status, created_at`,
      [senderId, receiverId, relationshipTypeId]
    );

    res.status(201).json({ success: true, request: result.rows[0] });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 받은 친구 신청 목록 조회
 * GET /api/friends/requests
 */
export const getReceivedRequests = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  try {
    const result = await query(
      `SELECT
        fr.id,
        fr.sender_id,
        fr.sender_proposed_type_id,
        fr.status,
        fr.created_at,
        u.username as sender_username,
        u.name as sender_name,
        rt.display_name as proposed_relationship
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       JOIN relationship_types rt ON fr.sender_proposed_type_id = rt.id
       WHERE fr.receiver_id = $1 AND fr.status = 'PENDING'
       ORDER BY fr.created_at DESC`,
      [userId]
    );

    res.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 보낸 친구 신청 목록 조회
 * GET /api/friends/requests/sent
 */
export const getSentRequests = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  try {
    const result = await query(
      `SELECT
        fr.id,
        fr.receiver_id,
        fr.sender_proposed_type_id,
        fr.status,
        fr.created_at,
        u.username as receiver_username,
        u.name as receiver_name,
        rt.display_name as proposed_relationship
       FROM friend_requests fr
       JOIN users u ON fr.receiver_id = u.id
       JOIN relationship_types rt ON fr.sender_proposed_type_id = rt.id
       WHERE fr.sender_id = $1
       ORDER BY fr.created_at DESC`,
      [userId]
    );

    res.json({ success: true, requests: result.rows });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 신청 응답 (수락/거절)
 * POST /api/friends/respond
 * Body: { requestId: number, action: 'accept' | 'reject', relationshipTypeId?: number }
 */
export const respondToRequest = async (req: AuthRequest, res: Response) => {
  const { requestId, action, relationshipTypeId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  if (!requestId || !action) {
    return res.status(400).json({ success: false, error: '필수 정보가 누락되었습니다.' });
  }

  if (action !== 'accept' && action !== 'reject') {
    return res.status(400).json({ success: false, error: '유효하지 않은 액션입니다.' });
  }

  try {
    // 친구 신청 확인
    const requestCheck = await query(
      `SELECT fr.*, rt.id as type_id
       FROM friend_requests fr
       JOIN relationship_types rt ON fr.sender_proposed_type_id = rt.id
       WHERE fr.id = $1 AND fr.receiver_id = $2 AND fr.status = 'PENDING'`,
      [requestId, userId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: '친구 신청을 찾을 수 없습니다.' });
    }

    const request = requestCheck.rows[0];

    if (action === 'reject') {
      // 거절 처리
      await query(
        `UPDATE friend_requests SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [requestId]
      );
      return res.json({ success: true, message: '친구 신청을 거절했습니다.' });
    }

    // 수락 처리 - 관계 타입 필수
    if (!relationshipTypeId) {
      return res.status(400).json({ success: false, error: '수락 시 관계 타입을 선택해주세요.' });
    }

    // 트랜잭션으로 처리
    await query('BEGIN');

    try {
      // 1. 친구 신청 상태 업데이트
      await query(
        `UPDATE friend_requests SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [requestId]
      );

      // 2. 양방향 친구 관계 생성
      // A -> B (신청자가 정의한 관계)
      await query(
        `INSERT INTO friendships (user_id, friend_id, relationship_type_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, friend_id) DO UPDATE SET relationship_type_id = $3`,
        [request.sender_id, userId, request.sender_proposed_type_id]
      );

      // B -> A (수락자가 정의한 관계)
      await query(
        `INSERT INTO friendships (user_id, friend_id, relationship_type_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, friend_id) DO UPDATE SET relationship_type_id = $3`,
        [userId, request.sender_id, relationshipTypeId]
      );

      await query('COMMIT');
      res.json({ success: true, message: '친구가 되었습니다!' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 목록 조회
 * GET /api/friends
 */
export const getFriends = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  try {
    const result = await query(
      `SELECT
        f.friend_id,
        f.relationship_type_id,
        f.created_at as friends_since,
        u.username,
        u.name,
        u.phone_number,
        rt.name as relationship_name,
        rt.display_name as relationship_display
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       JOIN relationship_types rt ON f.relationship_type_id = rt.id
       WHERE f.user_id = $1
       ORDER BY rt.sort_order, u.name`,
      [userId]
    );

    // 관계 타입별로 그룹화
    const grouped = result.rows.reduce((acc: Record<string, unknown[]>, friend: Record<string, unknown>) => {
      const type = friend.relationship_display as string;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(friend);
      return acc;
    }, {});

    res.json({ success: true, friends: result.rows, grouped });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 관계 타입 수정
 * PUT /api/friends/:friendId
 * Body: { relationshipTypeId: number }
 */
export const updateFriendship = async (req: AuthRequest, res: Response) => {
  const { friendId } = req.params;
  const { relationshipTypeId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  if (!relationshipTypeId) {
    return res.status(400).json({ success: false, error: '관계 타입을 선택해주세요.' });
  }

  try {
    const result = await query(
      `UPDATE friendships
       SET relationship_type_id = $3
       WHERE user_id = $1 AND friend_id = $2
       RETURNING *`,
      [userId, friendId, relationshipTypeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '친구 관계를 찾을 수 없습니다.' });
    }

    res.json({ success: true, friendship: result.rows[0] });
  } catch (error) {
    console.error('Update friendship error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 삭제 (양방향)
 * DELETE /api/friends/:friendId
 */
export const deleteFriend = async (req: AuthRequest, res: Response) => {
  const { friendId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  try {
    // 트랜잭션으로 양방향 삭제
    await query('BEGIN');

    try {
      // 양방향 친구 관계 삭제
      await query(
        `DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, friendId]
      );

      // 관련 친구 신청도 삭제 (선택적)
      await query(
        `DELETE FROM friend_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
        [userId, friendId]
      );

      await query('COMMIT');
      res.json({ success: true, message: '친구가 삭제되었습니다.' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Delete friend error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 친구 신청 취소
 * DELETE /api/friends/request/:requestId
 */
export const cancelFriendRequest = async (req: AuthRequest, res: Response) => {
  const { requestId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });
  }

  try {
    const result = await query(
      `DELETE FROM friend_requests WHERE id = $1 AND sender_id = $2 AND status = 'PENDING' RETURNING *`,
      [requestId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '취소할 수 있는 친구 신청이 없습니다.' });
    }

    res.json({ success: true, message: '친구 신청이 취소되었습니다.' });
  } catch (error) {
    console.error('Cancel friend request error:', error);
    res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
  }
};
