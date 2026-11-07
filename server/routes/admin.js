
import express from 'express';
import { pool } from '../config/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

// Estatísticas gerais
router.get('/overview', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(g.id)::INTEGER AS total_guests,
                COUNT(r.id) FILTER (
                    WHERE r.attending = TRUE
                )::INTEGER AS confirmed,
                COUNT(r.id) FILTER (
                    WHERE r.attending = FALSE
                )::INTEGER AS declined,
                COALESCE(
                    SUM(r.companions) FILTER (
                        WHERE r.attending = TRUE
                    ), 0
                )::INTEGER AS companions
            FROM guests g
            LEFT JOIN rsvps r ON r.guest_id = g.id
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro nas estatísticas:', error.message);
        res.status(500).json({ error: 'Erro ao carregar estatísticas.' });
    }
});

// Listar convidados
router.get('/guests', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                g.id,
                g.full_name,
                g.phone,
                r.attending,
                r.companions,
                r.submitted_at,
                m.content AS message
            FROM guests g
            LEFT JOIN rsvps r ON r.guest_id = g.id
            LEFT JOIN messages m ON m.rsvp_id = r.id
            ORDER BY g.created_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar convidados:', error.message);
        res.status(500).json({ error: 'Erro ao carregar convidados.' });
    }
});

// Registar convidado manualmente
router.post('/guests', async (req, res) => {
    try {
        const name = typeof req.body.full_name === 'string'
            ? req.body.full_name.trim()
            : '';

        const phone = typeof req.body.phone === 'string'
            ? req.body.phone.trim()
            : '';

        if (!name || name.length > 200 || phone.length > 40) {
            return res.status(400).json({
                error: 'Nome obrigatório (máximo 200 caracteres) e telefone até 40 caracteres.'
            });
        }

        const result = await pool.query(`
            INSERT INTO guests (full_name, phone)
            VALUES ($1, $2)
            RETURNING id, full_name, phone, created_at
        `, [name, phone || null]);

        res.status(201).json({
            status: 'success',
            guest: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao registar convidado:', error.message);
        res.status(500).json({ error: 'Não foi possível registar o convidado.' });
    }
});

// Editar convidado
router.put('/guests/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const name = typeof req.body.full_name === 'string'
            ? req.body.full_name.trim()
            : '';

        const phone = typeof req.body.phone === 'string'
            ? req.body.phone.trim()
            : '';

        if (!name || name.length > 200 || phone.length > 40) {
            return res.status(400).json({
                error: 'Nome obrigatório (máximo 200 caracteres) e telefone até 40 caracteres.'
            });
        }

        const result = await pool.query(`
            UPDATE guests
            SET full_name = $1, phone = $2
            WHERE id = $3
            RETURNING id, full_name, phone
        `, [name, phone || null, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Convidado não encontrado.' });
        }

        res.json({
            status: 'success',
            guest: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao editar convidado:', error.message);
        res.status(500).json({ error: 'Não foi possível editar o convidado.' });
    }
});

// Eliminar convidado
router.delete('/guests/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const result = await pool.query(
            'DELETE FROM guests WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Convidado não encontrado.' });
        }

        res.json({
            status: 'success',
            message: 'Convidado eliminado com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao eliminar convidado:', error.message);
        res.status(500).json({ error: 'Não foi possível eliminar o convidado.' });
    }
});

export default router;
