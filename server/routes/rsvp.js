import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { guestName, attendance, companions, message } = req.body;

    const name = typeof guestName === 'string' ? guestName.trim() : '';
    const attending = attendance === 'yes';
    const companionCount = Number(companions ?? 0);
    const guestMessage = typeof message === 'string' ? message.trim() : '';

    if (!name || !['yes', 'no'].includes(attendance)) {
        return res.status(400).json({
            error: 'Nome e confirmação de presença são obrigatórios.'
        });
    }

    if (!Number.isInteger(companionCount) ||
        companionCount < 0 ||
        companionCount > 1 ||
        (!attending && companionCount !== 0)) {
        return res.status(400).json({
            error: 'Número de acompanhantes inválido.'
        });
    }

    if (name.length > 200 || guestMessage.length > 2000) {
        return res.status(400).json({
            error: 'Os dados enviados excedem o limite permitido.'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const guestResult = await client.query(
            `INSERT INTO guests (full_name)
             VALUES ($1)
             RETURNING id`,
            [name]
        );

        const guestId = guestResult.rows[0].id;

        const rsvpResult = await client.query(
            `INSERT INTO rsvps (guest_id, attending, companions)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [guestId, attending, attending ? companionCount : 0]
        );

        if (guestMessage) {
            await client.query(
                `INSERT INTO messages (rsvp_id, content)
                 VALUES ($1, $2)`,
                [rsvpResult.rows[0].id, guestMessage]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            status: 'success',
            message: 'Confirmação recebida com sucesso.'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao guardar confirmação:', error.message);

        res.status(500).json({
            error: 'Não foi possível guardar a confirmação.'
        });

    } finally {
        client.release();
    }
});

export default router;