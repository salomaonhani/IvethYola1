import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database.js';
import authRoutes from './routes/auth.js';
import rsvpRoutes from './routes/rsvp.js';
import adminRoutes from './routes/admin.js';
import { authenticateAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        application: 'Iveth & Yola',
        server: 'Node.js + Express'
    });
});

app.get('/api/database-test', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT NOW() AS server_time, current_database() AS database_name'
        );

        res.json({
            status: 'connected',
            database: result.rows[0].database_name,
            serverTime: result.rows[0].server_time
        });
    } catch (error) {
        console.error('Erro na base de dados:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'Não foi possível ligar à base de dados.'
        });
    }
});

// Autenticação
app.use('/api/auth', authRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/admin', adminRoutes);
// Rota privada de teste
app.get('/api/admin/me', authenticateAdmin, (req, res) => {
    res.json({
        status: 'authenticated',
        admin: req.admin
    });
});

// Servir o site React em produção
app.use(express.static(DIST_DIR));

// Permitir navegação nas páginas do site
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});
app.listen(PORT, '0.0.0.0', () => {
    console.log('================================');
    console.log('  IVETH & YOLA - SERVIDOR');
    console.log('================================');
    console.log(`Servidor ativo na porta ${PORT}`);
});