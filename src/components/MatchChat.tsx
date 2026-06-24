import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isSelf?: boolean;
}

interface MatchChatProps {
  matchId: string;
}

export default function MatchChat({ matchId }: MatchChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'System',
      text: 'Welcome to the live match chat! Be respectful.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming messages for flavor
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const fakeUsers = ['Fan_89', 'SoccerLover', 'Goaaal', 'TacticsNerd', 'Guest_2201'];
        const fakeMessages = ['What a play!', 'Did you see that?!', 'Ref is blind tbh', 'Great possession here', 'Let\'s gooo!', 'Defense needs to step up.'];
        
        const newMsg: Message = {
          id: Date.now().toString() + Math.random(),
          user: fakeUsers[Math.floor(Math.random() * fakeUsers.length)],
          text: fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [matchId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      user: 'You',
      text: input.trim(),
      timestamp: new Date(),
      isSelf: true
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border-l border-[#1e293b]">
      <div className="p-3 border-b border-[#1e293b] flex items-center gap-2 bg-[#121824]">
        <MessageSquare className="w-4 h-4 text-[#38bdf8]" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Fan Chat</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          {Math.floor(Math.random() * 500) + 100} Online
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-slate-500 mb-0.5">{msg.user} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className={`px-3 py-1.5 rounded-lg text-sm ${msg.isSelf ? 'bg-[#38bdf8] text-[#0b0f19] rounded-tr-none font-medium' : 'bg-[#1e293b] text-slate-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-[#1e293b] bg-[#121824]">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#0b0f19] border border-[#1e293b] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-1.5 bg-[#38bdf8] text-[#0b0f19] rounded-lg disabled:opacity-50 hover:bg-[#7dd3fc] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
