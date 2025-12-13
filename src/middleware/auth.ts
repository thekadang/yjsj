/**
 * 인증 미들웨어
 * JWT 토큰 검증 및 사용자 정보 추출
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Request 확장 인터페이스
export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
  };
}

// JWT 페이로드 인터페이스
interface JwtPayload {
  user: {
    id: number;
    name: string;
  };
}

/**
 * 인증 필수 미들웨어
 * 토큰이 없거나 유효하지 않으면 401 응답
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 헤더에서 토큰 추출
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, error: '인증 토큰이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: '유효하지 않은 토큰입니다.' });
  }
};

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 사용자 정보 추출, 없어도 통과
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
      req.user = decoded.user;
    } catch {
      // 토큰이 유효하지 않아도 통과 (사용자 정보만 없음)
    }
  }

  next();
};

export default requireAuth;
