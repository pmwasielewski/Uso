import pkg from 'pg';
const { Pool } = pkg;

export function createPool() {

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

//addUser('Kuba');
//await listUsers(createPool());

export default {
    createPool,
    addUser,
    listUsers,
    getUserPassword,
    checkNickExists
}