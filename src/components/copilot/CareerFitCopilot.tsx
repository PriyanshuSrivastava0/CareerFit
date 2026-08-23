import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { fetchChatHistoryApi, sendChatMessageApi, clearChatHistoryApi } from '../../lib/api';
import { ChatMessage } from '../../types';
import {
  Bot,
  Send,
  X,
  Trash2,
  Sparkles,
  User,
  RefreshCw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ArrowRight,
  Code2,
  FileCheck2,
  HelpCircle,
  Briefcase,
  Compass,
  DollarSign,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export const CareerFitCopilot: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, resume, showToast } = useApp();
  const { currentUser } = useAuth();

  // Effective user ID (logged-in user or demo visitor)
  const activeUserId = currentUser?.id || 'demo-user-1';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      loadChat();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      // Stop any speech playback when closing
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      }
    }
  }, [activeUserId, isCopilotOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getActiveResumeContext = () => {
    if (!resume) return null;
    return {
      name: resume.extractedData?.personalInfo?.fullName || currentUser?.name || 'Candidate',
      targetDomain: resume.preferredDomain || 'Engineering & Software Development',
      atsScore: resume.atsAnalysis?.overallScore || 82,
      strengths: resume.atsAnalysis?.strengths || [],
      improvements: resume.atsAnalysis?.improvements || [],
      selectedCareer: resume.selectedCareer?.roleName || 'Full Stack Developer',
      matchPercentage: resume.selectedCareer?.matchPercentage || 92,
      extractedSkills: resume.extractedData?.skills || {},
      topSkillGaps: resume.skillGaps?.filter((g) => g.gapLevel === 'High' || g.gapLevel === 'Medium').map((g) => g.skill) || ['Docker', 'System Design'],
      jobReadinessScore: resume.jobReadiness?.overallScore || 78
    };
  };

  const getInitialGreeting = (): ChatMessage => {
    const candidateName = currentUser?.name || resume?.extractedData?.personalInfo?.fullName || 'there';
    const atsScore = resume?.atsAnalysis?.overallScore || 82;
    const targetRole = resume?.selectedCareer?.roleName || 'Full Stack Developer';

    return {
      id: 'init-greeting',
      sender: 'copilot',
      text: `Hello **${candidateName}**! 👋 I am your **CareerFit AI Copilot & Technical Interview Coach**.\n\nI am actively grounded in your resume profile:\n- 🎯 **ATS Score**: \`${atsScore}/100\`\n- 💼 **Target Career**: **${targetRole}**\n- 📊 **Job Readiness**: \`${resume?.jobReadiness?.overallScore || 78}%\`\n\nHow can I help you accelerate your tech career today?`,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        { label: '🎯 How to reach 90+ ATS?', actionType: 'query', payload: 'What exact missing keywords and quantifiable bullet points will take my ATS score above 90?' },
        { label: '🚀 5 High-Yield Interview Questions', actionType: 'query', payload: 'Give me 5 high-yield technical interview questions for my target role with sample answers.' },
        { label: '💡 Best Capstone Project Idea', actionType: 'query', payload: 'Suggest a high-impact full-stack capstone project with architecture details to get hired.' },
        { label: '📚 30-Day Study Plan', actionType: 'query', payload: 'Create a tailored 30-day week-by-week learning roadmap based on my skill gaps.' }
      ]
    };
  };

  const loadChat = async () => {
    try {
      const res = await fetchChatHistoryApi(activeUserId);
      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      } else {
        setMessages([getInitialGreeting()]);
      }
    } catch (e) {
      setMessages([getInitialGreeting()]);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    setInputMessage('');

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const resumeCtx = getActiveResumeContext();
      const res = await sendChatMessageApi(activeUserId, textToSend, resumeCtx);
      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      } else if (res.reply) {
        setMessages((prev) => [...prev, res.reply]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'copilot',
          text: `⚠️ I encountered a temporary connection issue. Please try asking again in a moment.`,
          timestamp: new Date().toISOString(),
          suggestedActions: [
            { label: 'Retry Question', actionType: 'query', payload: textToSend },
            { label: 'How to increase ATS score?', actionType: 'query', payload: 'What specific keywords will take my ATS score above 90?' }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      }
      await clearChatHistoryApi(activeUserId);
      setMessages([getInitialGreeting()]);
      showToast('info', 'Chat Cleared', 'Conversation history has been reset.');
    } catch (e) {
      setMessages([getInitialGreeting()]);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    showToast('success', 'Copied to Clipboard', 'Text copied successfully.');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('error', 'Unsupported', 'Text-to-speech is not supported by your browser.');
      return;
    }

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text of markdown characters for smooth speech
    const cleanText = text.replace(/[*#`_\[\]()]/g, ' ').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  const quickTopics = [
    { label: '🎯 ATS Boost', query: 'What exact missing keywords and bullet points will raise my ATS score to 95%?' },
    { label: '💼 Mock Interview', query: 'Ask me 3 challenging technical interview questions for my role and evaluate my responses.' },
    { label: '🛠️ Capstone Project', query: 'Suggest an impressive full-stack project idea with real-world architecture to showcase on my resume.' },
    { label: '📅 30-Day Plan', query: 'Give me a week-by-week 30-day preparation schedule to get job-ready.' },
    { label: '💰 Salary Insights', query: 'What is the salary benchmark for my profile in India and US Remote jobs?' },
    { label: '🌟 STAR Answers', query: 'Teach me how to structure behavioral interview answers using the STAR method with a code debugging example.' }
  ];

  if (!isCopilotOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-white border border-slate-200/90 shadow-2xl overflow-hidden ${
        isExpanded
          ? 'inset-4 sm:inset-10 rounded-[2.5rem]'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] h-[640px] max-h-[88vh] rounded-[2rem]'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm tracking-tight text-white">CareerFit Copilot</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold border border-indigo-400/20">
                Gemini 3.7 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Grounded in {resume?.extractedData?.personalInfo?.fullName ? `${resume.extractedData.personalInfo.fullName}'s` : 'active'} resume & roadmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Minimize Window' : 'Expand Window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close Copilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
          Topics:
        </span>
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(topic.query)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs shrink-0 disabled:opacity-50"
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#FAF8F3] text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isCopied = copiedMsgId === msg.id;
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
              <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div
                    className={`p-4 sm:p-5 rounded-3xl ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md font-medium'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs font-normal'
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none text-xs leading-relaxed font-sans space-y-2">
                        <Markdown
                          components={{
                            h1: ({ children }) => <h1 className="text-sm font-extrabold text-slate-900 mb-1 border-b border-slate-100 pb-1">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xs font-bold text-slate-900 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-bold text-indigo-700 mt-2 mb-1">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-slate-700">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-700">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-700">{children}</ol>,
                            li: ({ children }) => <li className="text-slate-700">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
                            code: ({ children }) => (
                              <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-indigo-700">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="p-3 bg-slate-900 text-slate-100 rounded-2xl overflow-x-auto text-[11px] font-mono my-2 border border-slate-800">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 rounded-r-xl my-2 text-slate-700 italic">
                                {children}
                              </blockquote>
                            )
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>
                    )}
                  </div>

                  {/* Actions (Copy / Read Aloud) */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-semibold"
                        title="Copy text"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-semibold"
                        title="Read aloud"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3 text-indigo-600" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Dynamic Suggested Followup Chips */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2.5 ml-10 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action.payload)}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200/90 text-indigo-700 text-[11px] font-bold transition-all shadow-2xs hover:border-indigo-300 flex items-center gap-1 disabled:opacity-50"
                    >
                      <span>{action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 text-slate-600 text-xs pl-1">
            <div className="w-8 h-8 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
            </div>
            <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-2">
              <span className="font-bold text-indigo-600">CareerFit Copilot</span>
              <span className="text-slate-500 font-medium">is analyzing your career context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3.5 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Copilot about ATS keywords, interview questions, projects, salary..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60 transition-all"
          />
          {inputMessage && (
            <button
              type="button"
              onClick={() => setInputMessage('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-40 shadow-sm shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
