import 'dotenv/config';
import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { pool } from './database.js';

const rl = readline.createInterface({ input: stdin, output: stdout });

async function createAdmin() {
    try {
        console.log('\n=== IVETH & YOLA | CRIAR ADMINISTRADOR ===\n');

        const name = (await rl.question('Nome do administrador: ')).trim();
        const email = (await rl.question('Email: ')).trim().toLowerCase();
        const password = await rl.question('Palavra-passe: ');

        if (!name || !email || password.length < 12) {
            throw new Error('Preencha todos os campos. A palavra-passe deve ter pelo menos 12 caracteres.');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO admins (name, email, password_hash)
             VALUES ($1, $2, $3)`,
            [name, email, passwordHash]
        );

        console.log('\nAdministrador criado com sucesso!');
        console.log(`Email registado: ${email}`);

    } catch (error) {
        console.error('\nErro:', error.code === '23505'
            ? 'Este email já está registado.'
            : error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        await pool.end();
    }
}

createAdmin();