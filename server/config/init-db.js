import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { pool } from './database.js';

async function initializeDatabase() {
    try {
        console.log('A preparar a base de dados Iveth & Yola...');

        const schema = await readFile(
            new URL('./schema.sql', import.meta.url),
            'utf8'
        );

        await pool.query(schema);

        console.log('================================');
        console.log(' BASE DE DADOS CRIADA');
        console.log('================================');
        console.log('As seis tabelas foram criadas com sucesso.');

    } catch (error) {
        console.error('Erro ao criar as tabelas:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

initializeDatabase();