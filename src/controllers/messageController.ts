/**
 * 남기는 말 컨트롤러
 * 남기는 말 CRUD 및 이력 관리 (일기와 별도로 관리)
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/db';

const MAX_MESSAGE_LENGTH = 100;

/**
 * 현재 활성화된 남기는 말 조회
 * GET /api/messages/current
 */
export const getCurrentMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const result = await query(
      `SELECT id, content, created_at
       FROM user_messages
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 조회 실패';
    console.error('남기는 말 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 다른 사용자의 현재 남기는 말 조회
 * GET /api/messages/user/:userId
 */
export const getUserMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT id, content, created_at
       FROM user_messages
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC
       LIMIT 1`,
      [parseInt(userId)]
    );

    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 조회 실패';
    console.error('남기는 말 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 남기는 말 이력 조회
 * GET /api/messages/history
 */
export const getMessageHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // 전체 개수 조회
    const countResult = await query(
      'SELECT COUNT(*) FROM user_messages WHERE user_id = $1',
      [req.user.id]
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // 이력 조회 (최신순)
    const result = await query(
      `SELECT id, content, is_active, created_at
       FROM user_messages
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 이력 조회 실패';
    console.error('남기는 말 이력 조회 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 새 남기는 말 작성
 * POST /api/messages
 */
export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: '내용을 입력해주세요.' });
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `최대 ${MAX_MESSAGE_LENGTH}자까지 입력 가능합니다.`
      });
    }

    // 기존 활성 메시지 비활성화
    await query(
      'UPDATE user_messages SET is_active = false WHERE user_id = $1 AND is_active = true',
      [req.user.id]
    );

    // 새 메시지 생성
    const result = await query(
      `INSERT INTO user_messages (user_id, content, is_active)
       VALUES ($1, $2, true)
       RETURNING id, content, is_active, created_at`,
      [req.user.id, content.trim()]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: '남기는 말이 저장되었습니다.'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 저장 실패';
    console.error('남기는 말 저장 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 과거 남기는 말을 현재 메시지로 활성화
 * PUT /api/messages/:messageId/activate
 */
export const activateMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { messageId } = req.params;

    // 해당 메시지 확인
    const checkResult = await query(
      'SELECT id FROM user_messages WHERE id = $1 AND user_id = $2',
      [parseInt(messageId), req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: '메시지를 찾을 수 없습니다.' });
    }

    // 기존 활성 메시지 비활성화
    await query(
      'UPDATE user_messages SET is_active = false WHERE user_id = $1 AND is_active = true',
      [req.user.id]
    );

    // 선택한 메시지 활성화
    const result = await query(
      `UPDATE user_messages SET is_active = true
       WHERE id = $1 AND user_id = $2
       RETURNING id, content, is_active, created_at`,
      [parseInt(messageId), req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: '남기는 말이 변경되었습니다.'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 활성화 실패';
    console.error('남기는 말 활성화 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 남기는 말 삭제
 * DELETE /api/messages/:messageId
 */
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const { messageId } = req.params;

    // 해당 메시지 삭제
    const result = await query(
      'DELETE FROM user_messages WHERE id = $1 AND user_id = $2 RETURNING id',
      [parseInt(messageId), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '메시지를 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      message: '남기는 말이 삭제되었습니다.'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 삭제 실패';
    console.error('남기는 말 삭제 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};

/**
 * 현재 남기는 말 비활성화 (남기는 말 숨기기)
 * PUT /api/messages/hide
 */
export const hideCurrentMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    await query(
      'UPDATE user_messages SET is_active = false WHERE user_id = $1 AND is_active = true',
      [req.user.id]
    );

    res.json({
      success: true,
      message: '남기는 말이 숨겨졌습니다.'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '남기는 말 숨기기 실패';
    console.error('남기는 말 숨기기 오류:', error);
    res.status(500).json({ success: false, error: message });
  }
};
