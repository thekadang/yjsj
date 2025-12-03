import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // Need to install bcrypt and @types/bcrypt
import jwt from 'jsonwebtoken'; // Need to install jsonwebtoken and @types/jsonwebtoken
import { query } from '../config/db';

export const register = async (req: Request, res: Response) => {
    const { username, password, name, phone_number } = req.body;

    try {
        // Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const result = await query(
            'INSERT INTO users (username, password, name, phone_number) VALUES ($1, $2, $3, $4) RETURNING id, username, name',
            [username, hashedPassword, name, phone_number]
        );

        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Check user
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token, user: { id: user.id, name: user.name, username: user.username, birthdate: user.birthdate } });
            }
        );
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
