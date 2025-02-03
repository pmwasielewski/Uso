import dotenv from 'dotenv';

dotenv.config();

export default {
  DB_HOST: process.env.DB_HOST,
  DB: process.env.DB,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  COOKIE_SEED: process.env.COOKIE_SEED,
  HTTP_PORT: process.env.HTTP_PORT,
  HTTPS_PORT: process.env.HTTPS_PORT

};