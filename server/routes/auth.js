import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e palavra-passe são obrigatórios.'
            });
        }

        const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM admins
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        const admin = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            status: 'success',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error.message);

        res.status(500).json({
            error: 'Erro interno ao iniciar sessão.'
        });
    }
});

export default router;