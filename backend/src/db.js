import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let usePg = false;

// In-memory fallback database
const memoryDb = {
  users: new Map(),
  resumes: new Map(),
  savedJobs: new Map(),
  viewedJobs: new Map(),
  jobApplications: new Map()
};

export const initDb = async () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      pool = new Pool({ connectionString });
      // Test connection
      const client = await pool.connect();
      client.release();
      usePg = true;
      console.log('PostgreSQL connected successfully.');
      
      // Initialize schema
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS resumes (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
          file_name VARCHAR(255) NOT NULL,
          parsed_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS saved_jobs (
          user_id VARCHAR(255) NOT NULL,
          job_id VARCHAR(255) NOT NULL,
          job_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, job_id)
        );

        CREATE TABLE IF NOT EXISTS viewed_jobs (
          user_id VARCHAR(255) NOT NULL,
          job_id VARCHAR(255) NOT NULL,
          job_data JSONB NOT NULL,
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, job_id)
        );

        CREATE TABLE IF NOT EXISTS job_applications (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          job_id VARCHAR(255) NOT NULL,
          job_data JSONB NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) NOT NULL DEFAULT 'Applied',
          notes TEXT
        );
      `);
    }
  } catch (error) {
    console.warn('PostgreSQL connection fallback: Using memory storage engine.', error.message);
    usePg = false;
  }
};

export const dbStore = {
  async createUser(user) {
    if (usePg && pool) {
      await pool.query(
        'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
        [user.id, user.email, user.password_hash, user.name]
      );
    } else {
      memoryDb.users.set(user.email, user);
      memoryDb.users.set(user.id, user);
    }
    return user;
  },

  async findUserByEmail(email) {
    if (usePg && pool) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0] || null;
    } else {
      return memoryDb.users.get(email) || null;
    }
  },

  async findUserById(id) {
    if (usePg && pool) {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    } else {
      return memoryDb.users.get(id) || null;
    }
  },

  async saveResume(id, userId, fileName, parsedData) {
    if (usePg && pool) {
      await pool.query(
        `INSERT INTO resumes (id, user_id, file_name, parsed_data) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET file_name = $3, parsed_data = $4, created_at = CURRENT_TIMESTAMP`,
        [id, userId, fileName, JSON.stringify(parsedData)]
      );
    } else {
      memoryDb.resumes.set(userId, { id, userId, fileName, parsedData, createdAt: new Date() });
    }
  },

  async getLatestResume(userId) {
    if (usePg && pool) {
      const res = await pool.query(
        'SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      if (res.rows[0]) {
        return {
          ...res.rows[0],
          parsedData: typeof res.rows[0].parsed_data === 'string' 
            ? JSON.parse(res.rows[0].parsed_data) 
            : res.rows[0].parsed_data
        };
      }
      return null;
    } else {
      return memoryDb.resumes.get(userId) || null;
    }
  },

  async toggleSaveJob(userId, job) {
    if (usePg && pool) {
      const check = await pool.query(
        'SELECT 1 FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
        [userId, job.id]
      );
      if (check.rows.length > 0) {
        await pool.query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [userId, job.id]);
        return false; // unsaved
      } else {
        await pool.query(
          'INSERT INTO saved_jobs (user_id, job_id, job_data) VALUES ($1, $2, $3)',
          [userId, job.id, JSON.stringify(job)]
        );
        return true; // saved
      }
    } else {
      if (!memoryDb.savedJobs.has(userId)) {
        memoryDb.savedJobs.set(userId, new Set());
      }
      const savedSet = memoryDb.savedJobs.get(userId);
      const key = JSON.stringify(job);
      const existing = Array.from(savedSet).find((item) => JSON.parse(item).id === job.id);
      if (existing) {
        savedSet.delete(existing);
        return false;
      } else {
        savedSet.add(key);
        return true;
      }
    }
  },

  async getSavedJobs(userId) {
    if (usePg && pool) {
      const res = await pool.query(
        'SELECT job_data FROM saved_jobs WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.rows.map(r => typeof r.job_data === 'string' ? JSON.parse(r.job_data) : r.job_data);
    } else {
      const savedSet = memoryDb.savedJobs.get(userId);
      if (!savedSet) return [];
      return Array.from(savedSet).map(item => JSON.parse(item));
    }
  },

  async addViewedJob(userId, job) {
    if (usePg && pool) {
      await pool.query(
        `INSERT INTO viewed_jobs (user_id, job_id, job_data) VALUES ($1, $2, $3)
         ON CONFLICT (user_id, job_id) DO UPDATE SET viewed_at = CURRENT_TIMESTAMP`,
        [userId, job.id, JSON.stringify(job)]
      );
    } else {
      if (!memoryDb.viewedJobs.has(userId)) {
        memoryDb.viewedJobs.set(userId, new Set());
      }
      const viewedSet = memoryDb.viewedJobs.get(userId);
      const existing = Array.from(viewedSet).find((item) => JSON.parse(item).id === job.id);
      if (existing) viewedSet.delete(existing);
      viewedSet.add(JSON.stringify(job));
    }
  },

  async getViewedJobs(userId) {
    if (usePg && pool) {
      const res = await pool.query(
        'SELECT job_data FROM viewed_jobs WHERE user_id = $1 ORDER BY viewed_at DESC LIMIT 20',
        [userId]
      );
      return res.rows.map(r => typeof r.job_data === 'string' ? JSON.parse(r.job_data) : r.job_data);
    } else {
      const viewedSet = memoryDb.viewedJobs.get(userId);
      if (!viewedSet) return [];
      return Array.from(viewedSet).map(item => JSON.parse(item)).reverse();
    }
  }
};
