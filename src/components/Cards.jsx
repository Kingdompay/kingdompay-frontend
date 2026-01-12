import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../contexts/AuthContext';

const Cards = () => {
  const navigate = useNavigate();
  const { user, addCard, toggleCardFreeze, updateCardLimits } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [newCard, setNewCard] = useState({
    type: 'Visa',
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [limitInput, setLimitInput] = useState({ daily: '', monthly: '' });

  const cards = user?.cards || [];
  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Set initial selected card if not set
  React.useEffect(() => {
    if (!selectedCardId && cards.length > 0) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!newCard.number || !newCard.name || !newCard.expiry) return;

    const cardToAdd = {
      id: Date.now(),
      ...newCard,
      color: newCard.type === 'Visa' ? '#1A3F22' : '#D99201',
      gradient: newCard.type === 'Visa'
        ? 'linear-gradient(135deg, #1A3F22, #58761B)'
        : 'linear-gradient(135deg, #D99201, #905A01)'
    };

    addCard(cardToAdd);
    setShowAddModal(false);
    setNewCard({ type: 'Visa', number: '', name: '', expiry: '', cvv: '' });
  };

  const handleFreeze = () => {
    if (selectedCard) {
      toggleCardFreeze(selectedCard.id);
    }
  };

  const handleLimitsSubmit = (e) => {
    e.preventDefault();
    if (selectedCard) {
      updateCardLimits(selectedCard.id, {
        daily: parseFloat(limitInput.daily) || selectedCard.limits.daily,
        monthly: parseFloat(limitInput.monthly) || selectedCard.limits.monthly
      });
      setShowLimitsModal(false);
    }
  };

  const openLimitsModal = () => {
    if (selectedCard) {
      setLimitInput({
        daily: selectedCard.limits?.daily || '',
        monthly: selectedCard.limits?.monthly || ''
      });
      setShowLimitsModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar / Mobile Header */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          {/* Header */}
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-100 dark:bg-[#1A2E1D] border-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Cards</h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-10 h-10 bg-[#E9F0E1] dark:bg-[#243B28] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#dce8d0] dark:hover:bg-[#2F4D33] transition-colors border-none"
              >
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#81C784] text-xl">add</span>
              </button>
            </div>
          </header>

          {/* Desktop Nav Links */}
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
              <Link to="/settings" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">settings</span> Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-4xl mx-auto animate-fade-in-up">

            {/* Add New Card Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-[#6f9c16] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#5a8012] transition-colors shadow-lg border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
                Add New Card
              </button>
            </div>

            {/* Cards Grid */}
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    style={{ background: card.gradient }}
                    className={`rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer transform transition-all hover:-translate-y-1 shadow-xl ${selectedCardId === card.id ? 'ring-4 ring-[#6f9c16] ring-offset-2 dark:ring-offset-[#0D1B0F]' : ''}`}
                  >
                    {/* Frozen Overlay */}
                    {card.isFrozen && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                          <span className="material-symbols-outlined text-4xl">lock</span>
                        </div>
                      </div>
                    )}

                    {/* Card Type */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold">{card.type}</span>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <span className="material-symbols-outlined">credit_card</span>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="mb-6">
                      <span className="text-xl font-medium tracking-widest">{card.number}</span>
                    </div>

                    {/* Card Details */}
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-xs opacity-80 mb-1 m-0">CARDHOLDER</p>
                        <p className="font-medium m-0">{card.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-80 mb-1 m-0">EXPIRES</p>
                        <p className="font-medium m-0">{card.expiry}</p>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-[#1A2E1D] rounded-2xl border border-dashed border-gray-300 dark:border-[#2D4A32] mb-8 transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-[#507e55] mb-2">credit_card_off</span>
                <p className="text-gray-500 dark:text-[#A8C4A8] m-0">No cards added yet</p>
              </div>
            )}

            {/* Card Management Options */}
            {selectedCard && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-[#1A3F22] dark:text-[#E8F5E8]">
                  Settings for {selectedCard.type} ending in {selectedCard.number.slice(-4)}
                </h2>

                {/* Freeze Card */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCard.isFrozen ? 'bg-red-100 dark:bg-red-900/30' : 'bg-[#E9F0E1] dark:bg-[#243B28]'}`}>
                      <span className={`material-symbols-outlined ${selectedCard.isFrozen ? 'text-red-600 dark:text-red-400' : 'text-[#58761B] dark:text-[#81C784]'}`}>
                        {selectedCard.isFrozen ? 'lock' : 'pause'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">{selectedCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">
                        {selectedCard.isFrozen ? 'Enable card usage' : 'Temporarily disable your card'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleFreeze}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer text-white ${selectedCard.isFrozen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#6f9c16] hover:bg-[#5a8012]'}`}
                  >
                    {selectedCard.isFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </div>

                {/* Card Limits */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">account_balance</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Set Limits</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">
                        Daily: {selectedCard.limits?.daily || 1000} | Monthly: {selectedCard.limits?.monthly || 5000}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openLimitsModal}
                    className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
                  >
                    Manage
                  </button>
                </div>

                {/* Card History */}
                <div className="p-4 rounded-2xl border bg-white dark:bg-[#1A2E1D] border-gray-200 dark:border-[#2D4A32] flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E9F0E1] dark:bg-[#243B28]">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#81C784]">history</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Transaction History</h3>
                      <p className="text-sm text-gray-500 dark:text-[#A8C4A8] m-0">View card transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-4 py-2 bg-[#6f9c16] text-white rounded-lg text-sm font-medium hover:bg-[#5a8012] transition-colors border-none cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-3xl w-full max-w-md overflow-hidden animate-fade-in-up shadow-2xl transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center bg-gray-50 dark:bg-[#1A2E1D]">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Add New Card</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#243B28] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2F4D33] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-[#A8C4A8] text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Card Type</label>
                <select
                  name="type"
                  value={newCard.type}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={newCard.number}
                  onChange={handleInputChange}
                  placeholder="**** **** **** ****"
                  className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCard.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={newCard.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#6f9c16] text-white rounded-xl font-semibold hover:bg-[#5a8012] transition-colors shadow-lg mt-4 border-none cursor-pointer"
              >
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Set Limits Modal */}
      {showLimitsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-3xl w-full max-w-md overflow-hidden animate-fade-in-up shadow-2xl transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center bg-gray-50 dark:bg-[#1A2E1D]">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Set Card Limits</h2>
              <button
                onClick={() => setShowLimitsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#243B28] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2F4D33] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-[#A8C4A8] text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleLimitsSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Daily Limit</label>
                <input
                  type="number"
                  value={limitInput.daily}
                  onChange={(e) => setLimitInput({ ...limitInput, daily: e.target.value })}
                  placeholder="1000"
                  className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8C4A8] mb-1">Monthly Limit</label>
                <input
                  type="number"
                  value={limitInput.monthly}
                  onChange={(e) => setLimitInput({ ...limitInput, monthly: e.target.value })}
                  placeholder="5000"
                  className="w-full p-3 bg-gray-50 dark:bg-[#1A2E1D] border border-gray-200 dark:border-[#2D4A32] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6f9c16] transition-all text-gray-900 dark:text-[#E8F5E8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#6f9c16] text-white rounded-xl font-semibold hover:bg-[#5a8012] transition-colors shadow-lg mt-4 border-none cursor-pointer"
              >
                Save Limits
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#E5EBE3] dark:bg-[#0D1B0F] rounded-3xl w-full max-w-md overflow-hidden animate-fade-in-up shadow-2xl transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-[#2D4A32] flex justify-between items-center bg-gray-50 dark:bg-[#1A2E1D]">
              <h2 className="text-xl font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Transaction History</h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#243B28] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2F4D33] transition-colors border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-[#A8C4A8] text-sm">close</span>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Mock Transactions */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A2E1D] rounded-xl border border-transparent dark:border-[#2D4A32]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#243B28] flex items-center justify-center border border-gray-100 dark:border-none">
                        <span className="material-symbols-outlined text-gray-600 dark:text-[#A8C4A8]">shopping_bag</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-[#E8F5E8] m-0">Grocery Store</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8C4A8] m-0">Today, 10:30 AM</p>
                      </div>
                    </div>
                    <span className="font-semibold text-red-500">-$45.00</span>
                  </div>
                ))}
                <div className="text-center text-gray-500 dark:text-[#A8C4A8] text-sm mt-4">
                  No more transactions
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default Cards;


