import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountApi, transactionApi } from '../services/api';

export default function Transactions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(searchParams.get('account') || '');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAccounts(user.userId);
      setAccounts(response.data);
      if (!selectedAccount && response.data.length > 0) {
        setSelectedAccount(response.data[0].accountNumber);
      }
    } catch (err) {
      console.error('Failed to load accounts', err);
    }
  };

  const fetchTransactions = async (accountNumber) => {
    setLoading(true);
    try {
      const response = await transactionApi.getTransactions(accountNumber);
      setTransactions(response.data);
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>NexBank</h1>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-btn" onClick={() => navigate('/transfer')}>Transfer</button>
          <button className="nav-btn active" onClick={() => navigate('/transactions')}>Transactions</button>
        </nav>
        <div className="header-right">
          <span className="user-greeting">Hi, {user?.fullName?.split(' ')[0]}</span>
          <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="transactions-container">
          <div className="transactions-header">
            <h2>Transaction History</h2>
            <select
              className="account-selector"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} ({acc.accountType})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found for this account.</p>
            </div>
          ) : (
            <div className="transactions-table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isSent = tx.fromAccountNumber === selectedAccount;
                    return (
                      <tr key={tx.id} className={isSent ? 'tx-sent' : 'tx-received'}>
                        <td>{formatDate(tx.createdAt)}</td>
                        <td>
                          <span className={`tx-badge ${isSent ? 'sent' : 'received'}`}>
                            {isSent ? 'Sent' : 'Received'}
                          </span>
                        </td>
                        <td className="mono">{tx.fromAccountNumber}</td>
                        <td className="mono">{tx.toAccountNumber}</td>
                        <td className={`tx-amount ${isSent ? 'debit' : 'credit'}`}>
                          {isSent ? '-' : '+'}₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
