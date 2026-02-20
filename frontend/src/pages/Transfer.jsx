import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountApi, transactionApi } from '../services/api';
import { toast } from 'react-hot-toast';

export default function Transfer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAccounts(user.userId);
      setAccounts(response.data);
      if (response.data.length > 0) {
        setFromAccount(response.data[0].accountNumber);
      }
    } catch (err) {
      toast.error('Failed to load accounts');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!fromAccount || !toAccount || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (fromAccount === toAccount) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    setLoading(true);
    try {
      const response = await transactionApi.transfer({
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: parseFloat(amount),
      });
      toast.success(`Transfer successful! ₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} sent.`);
      setAmount('');
      setToAccount('');
      fetchAccounts(); // Refresh balances
    } catch (err) {
      toast.error(err.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>NexBank</h1>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-btn active" onClick={() => navigate('/transfer')}>Transfer</button>
          <button className="nav-btn" onClick={() => navigate('/transactions')}>Transactions</button>
        </nav>
        <div className="header-right">
          <span className="user-greeting">Hi, {user?.fullName?.split(' ')[0]}</span>
          <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="transfer-container">
          <div className="transfer-card">
            <h2>Transfer Money</h2>
            <p className="transfer-subtitle">Send money between accounts instantly</p>


            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label htmlFor="fromAccount">From Account</label>
                <select
                  id="fromAccount"
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.accountType}) — ₹{parseFloat(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="toAccount">To Account Number</label>
                <input
                  id="toAccount"
                  type="text"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  placeholder="Enter destination account number"
                  maxLength={10}
                  required
                />
                <div className="input-hint" style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Hint:</strong> Try Priya's account: <code>1122334455</code> or Arjun's account: <code>1234567890</code> check your other accounts in the dashboard.
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Transfer Now'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
