import pkg from 'pg';
const { Pool } = pkg;

import config from './config.js';

export function createPool() {
    return new Pool({
        user: config.DB_USER,
        host: config.DB_HOST,
        database: config.DB,
        password: config.DB_PASSWORD,
        port: Number(config.DB_PORT),
    });
}

export async function addUser(pool, nick, password) {
    await pool.query(
        'INSERT INTO "Players" (nick, password) VALUES ($1, $2)',
        [nick, password]
    );
}

export async function listUsers(pool) {
    pool.query('SELECT * FROM "Players"', (err, res) => {
        console.log(res.rows);
    });
}

export async function getUserPassword(pool, nick) {
    const result = await pool.query(
        'SELECT password FROM "Players" WHERE nick = $1',
        [nick]
    );
    return result.rows[0]?.password;
}

export async function checkNickExists(pool, nick) {
    const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM "Players" WHERE nick = $1) AS "exists"',
        [nick]
    );
    return result.rows[0].exists;
}

export async function addWin(pool, nick) {
    await pool.query(
        'UPDATE "Players" SET wins = wins + 1 WHERE nick = $1',
        [nick]
    );
}

export async function addLoss(pool, nick) {
    await pool.query(
        'UPDATE "Players" SET losses = losses + 1 WHERE nick = $1',
        [nick]
    );
}

export async function getLeaderboard(pool) {
    const result = await pool.query(
        'SELECT nick, wins FROM "Players" ORDER BY wins DESC LIMIT 5'
    );

    //console.log(result.rows);

    return result.rows;
}

//addUser('Kuba');
//await listUsers(createPool());

export default {
    createPool,
    addUser,
    listUsers,
    getUserPassword,
    checkNickExists,
    addWin,
    addLoss,
    getLeaderboard
}