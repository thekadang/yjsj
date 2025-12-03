import { Request, Response } from 'express';
import pool from '../config/db';

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const {
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
                birthdate = $1,
                address = $2,
                detail_address = $3,
                zipcode = $4,
                death_certifier_1_name = $5,
                death_certifier_1_phone = $6,
                death_certifier_1_relation = $7,
                death_certifier_2_name = $8,
                death_certifier_2_phone = $9,
                death_certifier_2_relation = $10,
                insurance_status = $11,
                insurance_name = $12
            WHERE id = $13
            RETURNING id, name, username, birthdate
        `;

        const values = [
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
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user: result.rows[0] });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
