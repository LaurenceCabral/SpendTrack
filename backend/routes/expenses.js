import express from 'express';
import db from '../db.js';

const router = express.Router();
const categories = ['Food', 'Transportation', 'Shopping', 'Bills', 'Other'];

const validateExpense = function validateExpense(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  const {
    amount, description, category, date,
  } = body;

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return 'Amount must be a positive finite number';
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return 'Description must be a nonempty string';
  }

  if (!categories.includes(category)) {
    return 'Category must be Food, Transportation, Shopping, Bills, or Other';
  }

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 'Date must be a valid calendar date in YYYY-MM-DD format';
  }

  // Compare the parsed date to the input because JavaScript can roll invalid days forward.
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (date.startsWith('0000') || Number.isNaN(parsedDate.getTime())
    || parsedDate.toISOString().slice(0, 10) !== date) {
    return 'Date must be a valid calendar date in YYYY-MM-DD format';
  }

  return null;
};

const isValidId = function isValidId(value) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));
};

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

router.post('/', (req, res, next) => {
  const errorMessage = validateExpense(req.body);

  if (errorMessage) {
    res.status(400).json({ error: errorMessage });
    return;
  }

  const {
    amount, description, category, date,
  } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO expenses (amount, description, category, date)
      VALUES (?, ?, ?, ?)
    `).run(amount, description.trim(), category, date);
    const expense = db.prepare(`
      SELECT id, amount, description, category, date
      FROM expenses WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ expense });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', (req, res, next) => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ error: 'Expense ID must be a positive integer' });
    return;
  }

  const errorMessage = validateExpense(req.body);

  if (errorMessage) {
    res.status(400).json({ error: errorMessage });
    return;
  }

  const id = Number(req.params.id);
  const {
    amount, description, category, date,
  } = req.body;

  try {
    const result = db.prepare(`
      UPDATE expenses
      SET amount = ?, description = ?, category = ?, date = ?
      WHERE id = ?
    `).run(amount, description.trim(), category, date, id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    const expense = db.prepare(`
      SELECT id, amount, description, category, date
      FROM expenses WHERE id = ?
    `).get(id);

    res.status(200).json({ expense });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ error: 'Expense ID must be a positive integer' });
    return;
  }

  const id = Number(req.params.id);

  try {
    const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
