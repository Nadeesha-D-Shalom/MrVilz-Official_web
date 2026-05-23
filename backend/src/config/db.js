const mysql = require("mysql2/promise");
const env = require("./env");

let pool = null;

/** mysql2 rejects `undefined` in named placeholders — use SQL NULL instead */
function sanitizeParams(params) {
  if (!params || typeof params !== "object") return params;
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    out[key] = value === undefined ? null : value;
  }
  return out;
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true
    });
  }
  return pool;
}

async function query(sql, params = {}) {
  const [result] = await getPool().execute(sql, sanitizeParams(params));
  return result;
}

async function queryOne(sql, params = {}) {
  const rows = await query(sql, params);
  return Array.isArray(rows) ? rows[0] || null : rows;
}

function initPool() {
  return getPool();
}

module.exports = { getPool, initPool, query, queryOne };
