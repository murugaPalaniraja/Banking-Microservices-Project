import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAccounts(user.userId);
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading your accounts...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>NexBank</h1>
        </div>
        <nav className="header-nav">
          <button className="nav-btn active" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-btn" onClick={() => navigate('/transfer')}>Transfer</button>
          <button className="nav-btn" onClick={() => navigate('/transactions')}>Transactions</button>
        </nav>
        <div className="header-right">
          <span className="user-greeting">Hi, {user?.fullName?.split(' ')[0]}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <div className="balance-overview">
          <div className="balance-card">
            <span className="balance-label">Total Balance</span>
            <span className="balance-amount">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className="balance-info">{accounts.length} Account{accounts.length !== 1 ? 's' : ''}</span>
          </div>
          <button className="btn-primary btn-quick-transfer" onClick={() => navigate('/transfer')}>
            Quick Transfer →
          </button>
        </div>

        <section className="accounts-section">
          <h2>Your Accounts</h2>
          <div className="accounts-grid">
            {accounts.map((account) => (
              <div key={account.id} className="account-card" onClick={() => navigate(`/transactions?account=${account.accountNumber}`)}>
                <div className="account-card-header">
                  <span className="account-type-badge">{account.accountType}</span>
                  <span className="account-number">•••• {account.accountNumber.slice(-4)}</span>
                </div>
                <div className="account-card-body">
                  <span className="account-balance">₹{parseFloat(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className="account-full-number">Acc: {account.accountNumber}</span>
                </div>
                <div className="account-card-footer">
                  <span className="view-transactions">View Transactions →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
