import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
const formatDate = (date: Date | string | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
};

/**
 * 사용자 데이터의 날짜 필드 포맷팅
 */
const formatUserDates = (user: Record<string, unknown>) => {
    return {
        ...user,
        birthdate: formatDate(user.birthdate as Date | string | null),
    };
};

/**
 * 사용자 프로필 조회
 * GET /api/users/:id/profile
 */
export const getProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const query = `
            SELECT
                id, username, name, phone_number,
                birthdate, address, detail_address, zipcode,
                death_certifier_1_name, death_certifier_1_phone, death_certifier_1_relation,
                death_certifier_2_name, death_certifier_2_phone, death_certifier_2_relation,
                insurance_status, insurance_name,
                created_at, updated_at
            FROM users
            WHERE id = $1
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
        }

        res.json({ success: true, user: formatUserDates(result.rows[0]) });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
    }
};

/**
 * 사용자 프로필 업데이트
 * PUT /api/users/:id/profile
 */
export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const {
        name,
        phone_number,
        birthdate,
        address,
        detail_address,
        zipcode,
        death_certifier_1_name,
        death_certifier_1_phone,
        death_certifier_1_relation,
        death_certifier_2_name,
        death_certifier_2_phone,
        death_certifier_2_relation,
        insurance_status,
        insurance_name
    } = req.body;

    try {
        const query = `
            UPDATE users
            SET
                name = COALESCE($1, name),
                phone_number = COALESCE($2, phone_number),
                birthdate = COALESCE($3, birthdate),
                address = COALESCE($4, address),
                detail_address = COALESCE($5, detail_address),
                zipcode = COALESCE($6, zipcode),
                death_certifier_1_name = COALESCE($7, death_certifier_1_name),
                death_certifier_1_phone = COALESCE($8, death_certifier_1_phone),
                death_certifier_1_relation = COALESCE($9, death_certifier_1_relation),
                death_certifier_2_name = COALESCE($10, death_certifier_2_name),
                death_certifier_2_phone = COALESCE($11, death_certifier_2_phone),
                death_certifier_2_relation = COALESCE($12, death_certifier_2_relation),
                insurance_status = COALESCE($13, insurance_status),
                insurance_name = COALESCE($14, insurance_name),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $15
            RETURNING
                id, username, name, phone_number,
                birthdate, address, detail_address, zipcode,
                death_certifier_1_name, death_certifier_1_phone, death_certifier_1_relation,
                death_certifier_2_name, death_certifier_2_phone, death_certifier_2_relation,
                insurance_status, insurance_name,
                created_at, updated_at
        `;

        const values = [
            name,
            phone_number,
            birthdate,
            address,
            detail_address,
            zipcode,
            death_certifier_1_name,
            death_certifier_1_phone,
            death_certifier_1_relation,
            death_certifier_2_name,
            death_certifier_2_phone,
            death_certifier_2_relation,
            insurance_status,
            insurance_name,
            userId
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
        }

        res.json({ success: true, user: formatUserDates(result.rows[0]) });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, error: '서버 오류가 발생했습니다.' });
    }
};
