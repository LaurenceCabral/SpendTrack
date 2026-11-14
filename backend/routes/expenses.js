import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const expenses = db.prepare(`
      SELECT id, amount, description, category, date
      FROM expenses
      ORDER BY id ASC
    `).all();

    res.status(200).json({ expenses });
  } catch (error) {
    next(error);
  }
});

export default router;
