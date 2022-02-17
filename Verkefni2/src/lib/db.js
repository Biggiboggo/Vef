/* eslint-disable no-param-reassign */
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error(err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    console.error('unable to query', e);
    return null;
  } finally {
    client.release();
  }
}

export async function end() {
  await pool.end();
}

export async function createComment({ name, email, nationalId, comment }) {
  const q = `
    INSERT INTO
      comments(name, email, nationalId, comment)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *`;
  const values = [name, email, nationalId, comment];

  const result = await query(q, values);

  return result !== null;
}

export async function listComments() {
  const q = 'SELECT * FROM comments';

  const result = await query(q);

  if (result) {
    return result.rows;
  }

  return [];
}

export async function createEvent({ id, name, slug, description, created, updated }) {
  slug = slug.replace(/^\s+|\s+$/g, '');
  slug = slug.toLowerCase();
  slug = slug.replace(/[^a-z0-9 -]/g, '');
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');
  const q = `
    INSERT INTO
      comments(id, name, slug, description, created, updated)
    VALUES
      ($1, $2, $3, $4, #5, #6)
    RETURNING *`;
  const values = [id, name, slug, description, created, updated];

  const result = await query(q, values);

  return result !== null;
}

export async function listEvents() {
  const q = 'SELECT * FROM events';

  const result = await query(q);

  if (result) {
    return result.rows;
  }

  return [];
}
