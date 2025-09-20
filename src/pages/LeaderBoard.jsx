import { useState, useEffect } from 'react';
import { 
  Search, ArrowUpRight, ArrowDownLeft, Loader2, 
  ExternalLink, AlertCircle, ChevronLeft, ChevronRight, X,
  Layout, Clock, Blocks, ArrowUpDown
} from 'lucide-react';

// Add Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-gray-400">{title}</h3>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Add Modal component
const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <h2 className="text-xl font-bold mb-6">Transaction Details</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Transaction Hash</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm">{formatHash(transaction.transactionHash)}</p>
              <button
                onClick={() => navigator.clipboard.writeText(transaction.transactionHash)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">From</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm">{formatAddress(transaction.from)}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(transaction.from)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">To</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm">{formatAddress(transaction.to)}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(transaction.to)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Amount</p>
              <p className="text-xl font-bold">{transaction.amount} CXAC</p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Fee</p>
              <p className="text-xl font-bold">{transaction.fee} CXAC</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Block Number</p>
              <p className="font-mono">#{transaction.blockNumber}</p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Previous Block</p>
              <p className="font-mono">#{transaction.previousBlock}</p>
            </div>
          </div>

          <div className="bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Timestamp</p>
            <p>{new Date(transaction.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <a
            href={`https://explorer.codexac.com/tx/${transaction.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View on Explorer
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

// Add this helper function at the top level
const formatAddress = (address) => {
  if (!address) return '';
  if (address === 'SYSTEM') return 'SYSTEM';
  return `${address.slice(0, 6)}............${address.slice(-4)}`;
};

const formatHash = (hash) => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}............${hash.slice(-8)}`;
};

const LeaderBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchHash, setSearchHash] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    latestBlock: 0,
    lastTransaction: null
  });
  const ITEMS_PER_PAGE = 5;

  // Get user from localStorage for token
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('https://api.funchatparty.online/api/transactions', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        setTransactions(data);

        // Calculate stats
        setStats({
          totalTransactions: data.length,
          latestBlock: Math.max(...data.map(tx => tx.blockNumber)),
          lastTransaction: data[0]
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    
    // Set up auto-refresh interval
    const interval = setInterval(fetchTransactions, 2000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user.token]);

  // Handle search by transaction hash
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchHash.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const response = await fetch(`https://api.funchatparty.online/api/transactions/txh/${searchHash}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Transaction not found');

      const data = await response.json();
      setTransactions([data]); // Show only the searched transaction
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  // Reset search and show all transactions
  const handleReset = () => {
    setSearchHash('');
    setLoading(true);
    fetch('https://api.funchatparty.online/api/transactions', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .finally(() => setLoading(false));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header and Stats Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Transaction Explorer</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Total Transactions"
              value={stats.totalTransactions}
              icon={Layout}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatsCard 
              title="Latest Block"
              value={`#${stats.latestBlock}`}
              icon={Blocks}
              color="bg-purple-500/20 text-purple-400"
            />
            <StatsCard 
              title="Last Transaction"
              value={stats.lastTransaction ? 
                formatDate(stats.lastTransaction.createdAt).split(',')[0] : 
                'N/A'
              }
              icon={Clock}
              color="bg-green-500/20 text-green-400"
            />
            <StatsCard 
              title="24h Volume"
              value={`${transactions
                .filter(tx => new Date(tx.createdAt) > new Date(Date.now() - 86400000))
                .reduce((acc, tx) => acc + tx.amount, 0)} CXAC`}
              icon={ArrowUpDown}
              color="bg-yellow-500/20 text-yellow-400"
            />
          </div>

          {/* Search Form - Updated for better mobile view */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                  placeholder="Search by transaction hash..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 min-w-[100px]"
                >
                  {searching ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Search'}
                </button>
                {searchHash && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors min-w-[100px]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Show Modal */}
        {selectedTx && (
          <TransactionModal 
            transaction={selectedTx} 
            onClose={() => setSelectedTx(null)} 
          />
        )}

        {/* Transactions List - Updated for better mobile view */}
        <div className="space-y-4">
          {paginatedTransactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {tx.from === "SYSTEM" ? (
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <ArrowDownLeft className="text-green-400" size={20} />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <ArrowUpDown className="text-blue-400" size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate">
                        {formatHash(tx.transactionHash)}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(tx.transactionHash)}
                        className="text-blue-400 hover:text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold">{tx.amount} CXAC</p>
                  <p className="text-sm text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate">{formatAddress(tx.from)}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(tx.from)}
                        className="text-blue-400 hover:text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">To</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm truncate">{formatAddress(tx.to)}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(tx.to)}
                        className="text-blue-400 hover:text-blue-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm">
                      Block #{tx.blockNumber}
                    </div>
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                  <a
                    href={`/explorer/tx/${tx.transactionHash}`}
                    
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
                  >
                    View on Explorer
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {transactions.length === 0 && !error && (
            <div className="text-center py-12 text-gray-400">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;