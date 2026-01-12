import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const ChatSupport = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'support', timestamp: new Date().toLocaleTimeString() },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { id: messages.length + 1, text: message, sender: 'user', timestamp: new Date().toLocaleTimeString() };
      setMessages([...messages, newMessage]);
      setMessage('');
      setIsTyping(true);
      setTimeout(() => {
        const supportResponse = { id: messages.length + 2, text: 'Thank you for your message. Our support team will get back to you shortly.', sender: 'support', timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, supportResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const quickReplies = ['Account balance issue', 'Transaction not working', 'Forgot password', 'Card not working', 'App crashing'];

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
              <h1 className="text-lg font-bold text-[#1A3F22] dark:text-[#E8F5E8] m-0">Chat Support</h1>
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
            {/* Chat Messages */}
            <section className="flex flex-col gap-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-xl ${msg.sender === 'user' ? 'bg-[#6f9c16] text-white' : 'bg-[#f3f4f6] dark:bg-[#1A2E1D] text-[#1A3F22] dark:text-[#E8F5E8]'} transition-colors duration-300`}>
                    <p className="mb-1">{msg.text}</p>
                    <p className="text-xs opacity-80 text-right">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#f3f4f6] dark:bg-[#1A2E1D] p-3 rounded-xl text-[#6b7280] dark:text-[#A8C4A8] transition-colors duration-300">
                    <span className="animate-pulse">Support is typing...</span>
                  </div>
                </div>
              )}
            </section>
            {/* Quick Replies */}
            <section>
              <h2 className="text-base font-semibold text-[#1A3F22] dark:text-[#E8F5E8] mb-2">Quick Replies</h2>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, idx) => (
                  <button key={idx} onClick={() => setMessage(reply)} className="bg-white dark:bg-[#1A2E1D] border border-[#e5e7eb] dark:border-[#2D4A32] rounded-md px-3 py-1 text-sm text-[#1A3F22] dark:text-[#E8F5E8] hover:bg-gray-50 dark:hover:bg-[#243B28] transition-colors border-none cursor-pointer">
                    {reply}
                  </button>
                ))}
              </div>
            </section>
            {/* Message Input */}
            <section>
              <div className="flex items-center gap-2">
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." className="flex-1 py-2 px-4 border border-[#e5e7eb] dark:border-[#2D4A32] rounded-full bg-[#f9fafb] dark:bg-[#1A2E1D] text-gray-900 dark:text-[#E8F5E8] focus:outline-none transition-colors duration-300" />
                <button onClick={sendMessage} disabled={!message.trim()} className="w-10 h-10 rounded-full bg-[#6f9c16] text-white flex items-center justify-center disabled:bg-[#d1d5db] dark:disabled:bg-gray-600 transition-colors border-none cursor-pointer">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default ChatSupport;


