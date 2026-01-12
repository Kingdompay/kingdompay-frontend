import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const FAQs = () => {
  const navigate = useNavigate();
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 'account',
      name: 'Account',
      icon: 'person',
      color: '#6f9c16'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: 'payments',
      color: '#D99201'
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'security',
      color: '#dc2626'
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: 'build',
      color: '#7c3aed'
    }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create a KingdomPay account?',
      answer: 'To create a KingdomPay account, download our app from the App Store or Google Play, then tap "Sign Up" and follow the on-screen instructions. You\'ll need to provide your email, phone number, and create a secure password.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I verify my identity?',
      answer: 'To verify your identity, go to your profile settings and tap "Verify Identity". You\'ll need to provide a government-issued ID and take a selfie. The verification process typically takes 1-2 business days.'
    },
    {
      id: 3,
      category: 'payments',
      question: 'How do I send money to friends?',
      answer: 'To send money, tap the "Send" button on the home screen, enter the recipient\'s phone number or email, specify the amount, and confirm the transaction. The money will be sent instantly.'
    },
    {
      id: 4,
      category: 'payments',
      question: 'What are the transaction fees?',
      answer: 'Most transactions are free. Small fees may apply for international transfers or expedited processing. Check the transaction details before confirming any payment to see applicable fees.'
    },
    {
      id: 5,
      category: 'payments',
      question: 'How long do transfers take?',
      answer: 'Domestic transfers are typically instant. International transfers may take 1-3 business days depending on the destination country and payment method.'
    },
    {
      id: 6,
      category: 'security',
      question: 'Is my money safe?',
      answer: 'Yes, your money is protected by bank-level security. We use encryption and fraud monitoring to keep your account safe. Your funds are also insured up to $250,000.'
    },
    {
      id: 7,
      category: 'security',
      question: 'What should I do if I lose my phone?',
      answer: 'If you lose your phone, immediately contact our support team or log into your account from another device to freeze your account. You can also change your password and PIN to secure your account.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'Why can\'t I log into my account?',
      answer: 'If you can\'t log in, try resetting your password using the "Forgot Password" option. Make sure you\'re using the correct email address and that your internet connection is stable.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'The app is crashing. What should I do?',
      answer: 'Try closing and reopening the app. If the problem persists, restart your phone and update to the latest version of the KingdomPay app from the App Store or Google Play.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'How do I update my app?',
      answer: 'To update the app, go to the App Store (iOS) or Google Play Store (Android), search for "KingdomPay", and tap "Update" if an update is available.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">

        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300 border-b md:border-none border-gray-100 dark:border-[#2D4A32]">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 dark:bg-[#1A2E1D] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors border-none cursor-pointer">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Frequently Asked Questions</h1>
              <div className="w-10 h-10" />
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-sm bg-[#f9fafb] dark:bg-[#1A2E1D] border-2 border-[#e5e7eb] dark:border-[#2D4A32] rounded-xl focus:outline-none focus:border-[#6f9c16] transition-colors duration-300 text-gray-900 dark:text-[#E8F5E8] placeholder-gray-500 dark:placeholder-[#A8C4A8]"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6b7280] dark:text-[#A8C4A8] text-xl">search</span>
            </div>
          </header>

          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#1A2E1D] p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-6 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up">

            {/* Categories */}
            {!searchTerm && (
              <div className="mb-6">
                <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 gap-3">
                  {faqCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl p-5 border border-[#e5e7eb] dark:border-[#2D4A32] text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <span className="material-symbols-outlined text-2xl" style={{ color: category.color }}>
                          {category.icon}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0">{category.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs List */}
            <div>
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-4">
                {searchTerm ? `Search Results (${filteredFAQs.length})` : 'All Questions'}
              </h2>
              <div className="flex flex-col gap-3">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl border border-[#e5e7eb] dark:border-[#2D4A32] overflow-hidden transition-colors duration-300"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-5 bg-transparent border-none cursor-pointer flex items-center justify-between text-left"
                      >
                        <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] m-0 flex-1 pr-4">
                          {faq.question}
                        </h3>
                        <span
                          className={`material-symbols-outlined text-[#6b7280] dark:text-[#A8C4A8] text-xl transition-transform duration-300 ${activeFAQ === faq.id ? 'rotate-180' : ''}`}
                        >
                          expand_more
                        </span>
                      </button>
                      {activeFAQ === faq.id && (
                        <div className="px-5 pb-5 pt-0 border-t border-[#e5e7eb] dark:border-[#2D4A32] bg-[#E5EBE3] dark:bg-[#0D1B0F] transition-colors duration-300">
                          <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8] m-0 leading-relaxed pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl border border-[#e5e7eb] dark:border-[#2D4A32] transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[#58761B] dark:text-[#A8C4A8] text-2xl">
                        search_off
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">No results found</h3>
                    <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8] m-0">Try searching with different keywords</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-8 mb-20 md:mb-8">
              <div className="bg-[#f0f9ff] dark:bg-sky-900/20 rounded-2xl p-5 border border-[#bae6fd] dark:border-sky-900/50 text-center transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[#58761B] dark:text-[#A8C4A8] text-2xl">
                    help
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Still need help?</h3>
                <p className="text-sm text-[#6b7280] dark:text-[#A8C4A8] mb-4">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <button
                  onClick={() => navigate('/chat-support')}
                  className="bg-[#0369a1] text-white border-none rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-[#0284c7] transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="md:hidden"><BottomNav /></div>
      </div>
    </div>
  );
};

export default FAQs;


