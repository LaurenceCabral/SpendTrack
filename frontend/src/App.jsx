// Import component's styles
import './App.css';
import { useState } from 'react';

// Defining sample expense data
// Making sure to follow the fields and types in the API contract
const sampleExpenses = [
  {
    id: 1,
    amount: 45.2,
    description: 'Groceries',
    category: 'Food',
    date: '2026-11-05',
  },
  {
    id: 2,
    amount: 35,
    description: 'Gas',
    category: 'Transportation',
    date: '2026-11-04',
  },
  {
    id: 3,
    amount: 6.5,
    description: 'Coffee',
    category: 'Food',
    date: '2026-11-03',
  },
  {
    id: 4,
    amount: 60,
    description: 'Internet bill',
    category: 'Bills',
    date: '2026-10-20',
  },
];

// Reusable currency formatter that formats numbers for display
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Determining the current year and month
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}`;

  // Compare year and month directly to avoid timezone changes to expense dates
  const monthlyExpenses = sampleExpenses.filter(({ date }) =>
    date.startsWith(currentMonth),
  );

  // Calculate monthly spending total
  const monthlyTotal = monthlyExpenses.reduce(
    (total, { amount }) => total + amount,
    0,
  );

  // Copy the array before sorting so the original expense order stays intact
  const recentExpenses = [...sampleExpenses]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 5);

  // Build a readable month label
  const monthLabel = today.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Return the dashboard's jsx
  return (
    <div className="app">
      <header className="site-header">
        <span className="brand">SpendTrack</span>

        <nav className="site-nav" aria-label="Main navigation">
          <button
            type="button"
            className="nav-button"
            aria-pressed={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="nav-button"
            aria-pressed={currentView === 'history'}
            onClick={() => setCurrentView('history')}
          >
            History
          </button>
        </nav>
      </header>

      <main className="dashboard">
        {currentView === 'dashboard' ? (
          <>
            <h1>Dashboard</h1>
            <p className="month-label">{monthLabel}</p>

            <div className="summary-grid">
              <section className="summary-card">
                <h2>Monthly Spending</h2>
                <p className="summary-value">
                  {currencyFormatter.format(monthlyTotal)}
                </p>
              </section>

              <section className="summary-card">
                <h2>Total Expenses</h2>
                <p className="summary-value">{sampleExpenses.length}</p>
              </section>
            </div>

            <section className="recent-expenses">
              <h2>Recent Expenses</h2>

              {recentExpenses.length === 0 ? (
                <p>No expenses recorded yet.</p>
              ) : (
                <ul className="expense-list">
                  {recentExpenses.map(
                    ({ id, description, category, date, amount }) => (
                      <li className="expense-item" key={id}>
                        <div>
                          <p className="expense-description">{description}</p>
                          <p className="expense-details">
                            {category}
                            {' · '}
                            <time dateTime={date}>{date}</time>
                          </p>
                        </div>

                        <span className="expense-amount">
                          {currencyFormatter.format(amount)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </section>
          </>
        ) : (
          <section className="history">
            <h1>Expense History</h1>
            <p className="history-message">
              Expense history and filters are coming in a future update.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
