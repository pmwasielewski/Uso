import pkg from 'pg';
const { Pool } = pkg;

export function createPool() {
    
}

export async function addUser(pool, nick) {
    pool.query('INSERT INTO "Players" (nick) VALUES ($1)', [nick]);
}

export async function listUsers(pool) {
    pool.query('SELECT * FROM "Players"', (err, res) => {
        console.log(res.rows);
    });
}

//addUser('Kuba');
//await listUsers(createPool());

export default {
    createPool,
    addUser,
    listUsers
}