import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const faqs = [
    { id: 1, question: 'How do I add money to my wallet?', answer: 'You can add money to your wallet by linking your bank account, using a debit/credit card, or visiting any of our partner locations. Go to the Home page and tap the "Add" button to get started.' },
    { id: 2, question: 'How do I send money to friends?', answer: 'To send money, go to the Home page and tap the "Send" button. Enter the recipient\'s phone number or email, amount, and confirm the transaction. The money will be sent instantly.' },
    { id: 3, question: 'What are the transaction fees?', answer: 'Transaction fees vary depending on the type of transaction. Standard fees apply for most transfers. Check the transaction details before confirming any payment.' },
    { id: 4, question: 'How do I set up savings goals?', answer: 'Go to the Savings page and tap "Add New Goal". Set your target amount, choose an icon, and start saving. You can track your progress and make contributions anytime.' },
    { id: 5, question: 'Is my money safe?', answer: 'Yes, we use bank-level encryption and fraud monitoring to keep your account secure. We implement multiple layers of security to protect your information and transactions.' },
  ];

  const contactMethods = [
    { icon: 'chat', title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat' },
    { icon: 'email', title: 'Email Support', description: 'Send us an email', action: 'Send Email' },
    { icon: 'phone', title: 'Phone Support', description: 'Call us directly', action: 'Call Now' },
  ];

  const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] font-sans flex justify-center transition-colors duration-300">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-[#E5EBE3] dark:bg-[#0D1B0F] md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative transition-colors duration-300">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:border-r md:border-gray-100 dark:md:border-[#2D4A32] flex flex-col transition-colors duration-300">
          <header className="sticky top-0 z-10 p-4 bg-[#E5EBE3] dark:bg-[#0D1B0F] md:bg-transparent transition-colors duration-300">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 dark:bg-[#1A2E1D] rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#243B28] transition-colors border-none cursor-pointer">
                <span className="material-symbols-outlined text-[#1A3F22] dark:text-[#E8F5E8] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Help & Support</h1>
              <div className="w-10 h-10" />
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
        {/* Main */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-[#E5EBE3] dark:bg-[#0a150c] md:bg-[#E5EBE3] dark:md:bg-[#0D1B0F] transition-colors duration-300">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">
            {/* Search Bar */}
            <section>
              <div className="mb-4">
                <div className="relative bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl border border-[#e5e7eb] dark:border-[#2D4A32] transition-colors duration-300">
                  <input
                    type="text"
                    placeholder="Search help topics..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-[#E8F5E8] placeholder-gray-500 dark:placeholder-[#A8C4A8]"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] dark:text-[#A8C4A8]">search</span>
                </div>
              </div>
            </section>
            {/* Quick Help */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Quick Help</h2>
              <div className="flex flex-col gap-2">
                {contactMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E9F0E1] dark:bg-[#243B28] flex items-center justify-center mr-3">
                        <span className="material-symbols-outlined" style={{ color: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#A8C4A8' : '#58761B'), fontSize: '20px' }}>{method.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A3F22] dark:text-[#E8F5E8]">{method.title}</h3>
                        <p className="text-xs text-[#6b7280] dark:text-[#A8C4A8]">{method.description}</p>
                      </div>
                    </div>
                    <button className="bg-[#6f9c16] text-white rounded-md px-3 py-1 text-xs font-medium hover:bg-[#5a7a12] transition-colors border-none cursor-pointer">{method.action}</button>
                  </div>
                ))}
              </div>
            </section>
            {/* FAQ Section */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-2">
                {filteredFaqs.map(faq => (
                  <details key={faq.id} className="bg-[#f9fafb] dark:bg-[#1A2E1D] rounded-2xl p-4 border border-[#e5e7eb] dark:border-[#2D4A32] transition-colors duration-300">
                    <summary className="font-medium text-[#1A3F22] dark:text-[#E8F5E8] cursor-pointer">{faq.question}</summary>
                    <p className="mt-2 text-sm text-[#6b7280] dark:text-[#A8C4A8]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
            {/* Emergency Contact */}
            <section className="bg-[#fef2f2] dark:bg-red-900/20 rounded-2xl p-4 border border-[#fecaca] dark:border-red-900/50 text-center transition-colors duration-300">
              <div className="flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[#dc2626] dark:text-red-400 mr-2">emergency</span>
                <h3 className="text-sm font-semibold text-[#dc2626] dark:text-red-400">Emergency Support</h3>
              </div>
              <p className="text-xs text-[#7f1d1d] dark:text-red-200">If your account has been compromised or you need immediate assistance, contact us right away.</p>
              <button className="mt-2 bg-[#dc2626] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#b91c1c] transition-colors border-none cursor-pointer">Contact Emergency Support</button>
            </section>
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default HelpSupport;


