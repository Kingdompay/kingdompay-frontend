import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const faqs = [
    { id: 1, question: 'How do I add money to my wallet?', answer: 'You can add money to your wallet by linking your bank account, using a debit/credit card, or visiting any of our partner locations. Go to the Home page and tap the "Add" button to get started.' },
    { id: 2, question: 'How do I send money to friends?', answer: 'To send money, go to the Home page and tap the "Send" button. Enter the recipient\'s phone number or email, amount, and confirm the transaction. The money will be sent instantly.' },
    { id: 3, question: 'What are the transaction fees?', answer: 'Most transactions are free. Small fees may apply for international transfers or expedited processing. Check the transaction details before confirming any payment.' },
    { id: 4, question: 'How do I set up savings goals?', answer: 'Go to the Savings page and tap "Add New Goal". Set your target amount, choose an icon, and start saving. You can track your progress and make contributions anytime.' },
    { id: 5, question: 'Is my money safe?', answer: 'Yes, your money is protected by bank-level security. We use encryption and fraud monitoring to keep your account safe. Your funds are also insured up to $250,000.' },
  ];

  const contactMethods = [
    { icon: 'chat', title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat' },
    { icon: 'email', title: 'Email Support', description: 'Send us an email', action: 'Send Email' },
    { icon: 'phone', title: 'Phone Support', description: 'Call us directly', action: 'Call Now' },
  ];

  const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white font-sans flex justify-center">
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}} .animate-fade-in-up{animation:fadeInUp .6s ease-out forwards}`}</style>
      <div className="w-full max-w-md md:max-w-6xl bg-white md:my-8 md:rounded-3xl md:shadow-2xl min-h-screen md:min-h-[800px] flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4 bg-white md:border-r md:border-gray-100 flex flex-col">
          <header className="sticky top-0 z-10 p-4 bg-white md:bg-transparent">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/profile')} className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-[#1A3F22] text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-[#1A3F22] m-0">Help & Support</h1>
              <div className="w-10 h-10" />
            </div>
          </header>
          <div className="hidden md:block p-4 mt-auto">
            <nav className="space-y-2">
              <Link to="/home" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">home</span> Home
              </Link>
              <Link to="/profile" className="flex items-center text-[#1A3F22] hover:bg-gray-50 p-3 rounded-xl transition-colors no-underline">
                <span className="material-symbols-outlined mr-3">person</span> Profile
              </Link>
            </nav>
          </div>
        </div>
        {/* Main */}
        <main className="flex-grow p-4 pb-28 md:pb-8 overflow-y-auto bg-gray-50 md:bg-white">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-8">
            {/* Search Bar */}
            <section>
              <div className="mb-4">
                <div className="relative bg-[#f9fafb] rounded-2xl border border-[#e5e7eb]">
                  <input
                    type="text"
                    placeholder="Search help topics..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 text-sm bg-transparent focus:outline-none"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]">search</span>
                </div>
              </div>
            </section>
            {/* Quick Help */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-2">Quick Help</h2>
              <div className="flex flex-col gap-2">
                {contactMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#f9fafb] rounded-2xl p-4 border border-[#e5e7eb] hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E9F0E1] flex items-center justify-center mr-3">
                        <span className="material-symbols-outlined" style={{ color: '#58761B', fontSize: '20px' }}>{method.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#1A3F22]">{method.title}</h3>
                        <p className="text-xs text-[#6b7280]">{method.description}</p>
                      </div>
                    </div>
                    <button className="bg-[#6f9c16] text-white rounded-md px-3 py-1 text-xs font-medium hover:bg-[#5a7a12] transition-colors">{method.action}</button>
                  </div>
                ))}
              </div>
            </section>
            {/* FAQ Section */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] mb-2">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-2">
                {filteredFaqs.map(faq => (
                  <details key={faq.id} className="bg-[#f9fafb] rounded-2xl p-4 border border-[#e5e7eb]">
                    <summary className="font-medium text-[#1A3F22] cursor-pointer">{faq.question}</summary>
                    <p className="mt-2 text-sm text-[#6b7280]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
            {/* Emergency Contact */}
            <section className="bg-[#fef2f2] rounded-2xl p-4 border border-[#fecaca] text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[#dc2626] mr-2">emergency</span>
                <h3 className="text-sm font-semibold text-[#dc2626]">Emergency Support</h3>
              </div>
              <p className="text-xs text-[#7f1d1d]">If your account has been compromised or you need immediate assistance, contact us right away.</p>
              <button className="mt-2 bg-[#dc2626] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-[#b91c1c] transition-colors">Contact Emergency Support</button>
            </section>
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default HelpSupport;
