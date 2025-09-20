import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Change this import
import { 
  Search, ArrowUpRight, ArrowDownLeft, Loader2, 
  ExternalLink, AlertCircle, ChevronLeft, ChevronRight,
  Layout, Clock, Blocks, ArrowUpDown, Database, 
  Hash, Users, DollarSign
} from 'lucide-react';

// Stats Card Component
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

const Explorer = () => {
  const navigate = useNavigate(); // Add this hook
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    totalVolume: 0,
    latestBlock: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch transactions and calculate stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.funchatparty.online/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        setTransactions(data);

        // Calculate statistics
        const stats = data.reduce((acc, tx) => ({
          totalBlocks: Math.max(acc.totalBlocks, tx.blockNumber),
          totalTransactions: acc.totalTransactions + 1,
          totalVolume: acc.totalVolume + tx.amount,
          latestBlock: Math.max(acc.latestBlock, tx.blockNumber)
        }), {
          totalBlocks: 0,
          totalTransactions: 0,
          totalVolume: 0,
          latestBlock: 0
        });

        setStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Render transaction list
  const renderTransactions = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin" size={40} />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {paginatedTransactions.map((tx) => (
          <div key={tx._id} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-4">
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
                <div>
                  <p className="text-sm text-gray-400">Hash</p>
                  <p className="font-mono text-sm md:text-base">
                    {tx.transactionHash.slice(0, 8)}...{tx.transactionHash.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{tx.amount} CXAC</p>
                <p className="text-sm text-gray-400">Fee: {tx.fee} CXAC</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">From</p>
                <p className="font-mono text-sm truncate">{tx.from}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">To</p>
                <p className="font-mono text-sm truncate">{tx.to}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-700 text-sm">
                  Block #{tx.blockNumber}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>
              <a
                href={`/explorer/tx/${tx.transactionHash}`}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                View Details
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/5 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white/5 rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Format helper functions
  const formatAddress = (address) => {
    if (!address) return '';
    if (address === 'SYSTEM') return 'SYSTEM';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      // Determine search type by input format
      if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
        navigate(`/explorer/address/${searchQuery}`);
      } else if (searchQuery.length === 64) {
        navigate(`/explorer/tx/${searchQuery}`);
      } else if (!isNaN(searchQuery)) {
        navigate(`/explorer/block/${searchQuery}`);
      } else {
        setError('Invalid search query');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Blockchain Explorer</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Latest Block"
              value={`#${stats.latestBlock}`}
              icon={Database}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatsCard 
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              icon={Hash}
              color="bg-purple-500/20 text-purple-400"
            />
            <StatsCard 
              title="Total Volume"
              value={`${stats.totalVolume.toLocaleString()} CXAC`}
              icon={DollarSign}
              color="bg-yellow-500/20 text-yellow-400"
            />
            <StatsCard 
              title="Avg Fee"
              value={`${(transactions.reduce((acc, tx) => acc + tx.fee, 0) / transactions.length || 0).toFixed(4)} CXAC`}
              icon={ArrowUpDown}
              color="bg-green-500/20 text-green-400"
            />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Address / Tx Hash / Block Number..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
              </button>
            </div>
          </form>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {['blocks', 'transactions', 'addresses'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="p-4 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : (
          renderTransactions()
        )}
      </div>
    </div>
  );
};

export default Explorer;