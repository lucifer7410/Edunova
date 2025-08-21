// shared/audit.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = process.env.AUDIT_DB_PATH || path.join(__dirname, '..', 'audit.db');

const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time INTEGER,
    agent TEXT,
    azp TEXT,
    sub TEXT,
    action TEXT,
    scope TEXT,
    resource TEXT,
    payload TEXT,
    receipt_jws TEXT
  )`);
});

function logAction({agent, azp, sub, action, scope, resource, payload, receipt}){
  const stmt = db.prepare(`INSERT INTO audit (time, agent, azp, sub, action, scope, resource, payload, receipt_jws)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(Date.now(), agent, azp || '', sub || '', action, (scope||''), resource || '', JSON.stringify(payload || {}), receipt || null);
  stmt.finalize();
}

function list(limit=100){
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM audit ORDER BY id DESC LIMIT ?`, [limit], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { logAction, list, db };
