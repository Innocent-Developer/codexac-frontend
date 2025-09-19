import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, Copy, CheckCircle2, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

const WalletPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'send' or 'receive'
  const [showScanner, setShowScanner] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Add new state for transaction status
  const [transactionStatus, setTransactionStatus] = useState({ loading: false, error: null });

  // Add new state for transactions
  const [transactions, setTransactions] = useState([]);

  // Add this function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Add this function to format address
  const formatAddress = (address, currentUserAddress) => {
    if (address === currentUserAddress) {
      return "You";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const uid = storedUser?.user?.uid;

        if (!uid) return;

        // Fetch user data
        const userResponse = await fetch(
          `https://api.funchatparty.online/api/getUserByUid/${uid}`
        );
        const userData = await userResponse.json();
        setUserData(userData.user);

        // Fetch transactions
        const txResponse = await fetch(
          `https://api.funchatparty.online/api/transactions/ua/${userData.user.address}`
        );
        const txData = await txResponse.json();
        setTransactions(txData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userData?.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const renderQRCode = () => {
    if (!userData?.address) return null;
    return (
      <QRCodeSVG
        value={userData.address}
        size={200}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="L"
        includeMargin={true}
        className="mx-auto"
      />
    );
  };

  const handleScanError = (error) => {
    console.error("QR Scan Error:", error);
  };

  // Enhanced scanner initialization
  useEffect(() => {
    let scanner;
    if (showScanner) {
      scanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: {
          width: window.innerWidth < 600 ? 250 : 300,
          height: window.innerWidth < 600 ? 250 : 300,
        },
        fps: 10,
        rememberLastUsedCamera: true,
        aspectRatio: 1,
      });

      scanner.render(
        (decodedText) => {
          setRecipientAddress(decodedText);
          setShowScanner(false);
          scanner.clear();
        },
        (error) => {
          console.warn(`QR Code scanning failed: ${error}`);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [showScanner]);

  // Handle send transaction
  const handleSendTransaction = async () => {
    if (!recipientAddress || !amount) {
      setTransactionStatus({ 
        loading: false, 
        error: "Please fill in all fields" 
      });
      return;
    }

    setTransactionStatus({ loading: true, error: null });
    try {
      const response = await fetch(`https://api.funchatparty.online/api/transfer/coin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        },
        body: JSON.stringify({
          fromAddress: userData.address,
          toAddress: recipientAddress,
          amount: Number(amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transaction failed');
      }

      // Reset form and close modal on success
      setShowModal(false);
      setRecipientAddress('');
      setAmount('');
      setTransactionStatus({ loading: false, error: null });

      // Optional: Show success message
      alert('Transaction successful!');

    } catch (error) {
      setTransactionStatus({ 
        loading: false, 
        error: error.message || 'Failed to send transaction' 
      });
    }
  };

  // Enhanced QR Scanner styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      #qr-reader {
        border: none !important;
        padding: 0 !important;
        width: 100% !important;
      }
      #qr-reader__scan_region {
        min-height: 250px !important;
        background: #374151 !important;
      }
      #qr-reader__scan_region > img {
        display: none !important;
      }
      #qr-reader__dashboard {
        padding: 8px !important;
        background: #1F2937 !important;
      }
      #qr-reader__dashboard_section_swaplink {
        display: none !important;
      }
      #qr-reader__dashboard_section_csr button {
        padding: 8px 16px !important;
        background: #3B82F6 !important;
        color: white !important;
        border-radius: 8px !important;
        border: none !important;
      }
      @media (max-width: 640px) {
        #qr-reader__scan_region {
          min-height: 200px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Balance Card - Made responsive */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-xl">
        <h2 className="text-gray-200 text-base sm:text-lg mb-2">Total Balance</h2>
        <div className="flex items-baseline flex-wrap gap-2">
          <span className="text-3xl sm:text-4xl font-bold text-white">
            {userData?.totalCoins || 0}
          </span>
          <span className="text-gray-200">CXAC</span>
        </div>
      </div>

      {/* Wallet Address - Improved mobile layout */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-gray-400 mb-2">Wallet Address</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-900/50 rounded-lg p-3 sm:p-4 gap-2">
          <span className="font-mono text-sm text-gray-300 break-all">
            {userData?.address}
          </span>
          <button
            onClick={handleCopyAddress}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all ml-auto"
          >
            {copySuccess ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <Copy className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => {
            setModalType("send");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
        >
          <ArrowUpRight />
          <span>Send</span>
        </button>
        <button
          onClick={() => {
            setModalType("receive");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all"
        >
          <ArrowDownLeft />
          <span>Receive</span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-gray-400 text-center">No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {tx.from === userData?.address ? (
                      <ArrowUpRight className="text-red-400" />
                    ) : (
                      <ArrowDownLeft className="text-green-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-400">
                        {tx.from === userData?.address ? "Sent to" : "Received from"}
                      </p>
                      <p className="font-mono">
                        {formatAddress(
                          tx.from === userData?.address ? tx.to : tx.from,
                          userData?.address
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.from === userData?.address 
                        ? "text-red-400" 
                        : "text-green-400"
                    }`}>
                      {tx.from === userData?.address ? "-" : "+"}
                      {tx.amount} CXAC
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Block #{tx.blockNumber}</span>
                    <a
                      href={`https://explorer.codexac.com/tx/${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      View on Explorer →
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - Enhanced responsiveness */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                {modalType === "send" ? "Send CXAC" : "Receive CXAC"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowScanner(false);
                  setRecipientAddress("");
                  setAmount("");
                }}
                className="p-2 hover:bg-gray-700 rounded-full transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            {modalType === "send" ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full p-3 pr-12 bg-gray-700 rounded-lg"
                  />
                  <button
                    onClick={() => setShowScanner(!showScanner)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-600 rounded-lg transition-all"
                  >
                    <QrCode size={20} className="text-gray-400" />
                  </button>
                </div>

                {showScanner && (
                  <div className="relative bg-gray-700 p-4 rounded-lg">
                    <div className="absolute right-2 top-2 z-10">
                      <button
                        onClick={() => setShowScanner(false)}
                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
                      >
                        <X size={20} className="text-gray-400" />
                      </button>
                    </div>
                    <div id="qr-reader" className="w-full mx-auto"></div>
                  </div>
                )}

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg"
                  min="0"
                  step="0.000001"
                />

                <button
                  onClick={handleSendTransaction}
                  disabled={transactionStatus.loading}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {transactionStatus.loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    "Send"
                  )}
                </button>

                {transactionStatus.error && (
                  <p className="text-red-500 text-sm text-center">
                    {transactionStatus.error}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  {renderQRCode()}
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Your Wallet Address</p>
                  <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3 gap-2">
                    <span className="font-mono text-sm break-all text-gray-300">
                      {userData?.address}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-gray-600 rounded-lg transition-all shrink-0"
                    >
                      {copySuccess ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

  );
};

export default WalletPage;
