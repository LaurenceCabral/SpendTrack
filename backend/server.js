import express from 'express';
import expensesRouter from './routes/expenses.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use('/api/expenses', expensesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Express recognizes error handlers by their four parameters.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Request body must contain valid JSON' });
    return;
  }

  if (error.status >= 400 && error.status < 500) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  process.stdout.write(`SpendTrack backend listening on port ${port}\n`);
});
