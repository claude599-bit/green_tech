import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, Send, X, Bot, User, Brain, Zap, MessageSquare, RefreshCw } from 'lucide-react';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatEntry {
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  thinkingApplied?: boolean;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: 'model',
      text: `Bonjour ${user ? user.name : 'cher visiteur'} ! Je suis le copilote d'ingénierie et d'assistance technique de Green Tech Energy Cameroon (GTEC).\n\nJe peux vous assister pour :\n- Le dimensionnement d'installations solaires ou groupes hybrides au Cameroun\n- Le diagnostic de pannes frigorifiques, électriques ou réseaux\n- L'estimation de devis et la sélection d'équipements adaptés au climat tropical.\n\nQuelle est votre question technique aujourd'hui ?`,
      modelUsed: 'gemini-3.8-flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'fast' | 'general' | 'deep_thinking'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || loading) return;

    const userMsg: ChatEntry = { role: 'user', text: promptToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await api.chatWithGemini(apiMessages, mode);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: res.text,
          modelUsed: res.modelUsed,
          thinkingApplied: res.thinkingApplied,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `Erreur lors de la consultation : ${err.message || 'Service momentanément indisponible'}. Nos ingénieurs GTEC restent joignables au +237 6 55 54 76 49.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        text: `Nouvelle session initiée. Posez votre question technique ou choisissez l'un des exemples recommandés ci-dessous.`,
        modelUsed: mode === 'deep_thinking' ? 'gemini-4-argon' : mode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash',
      },
    ]);
  };

  const suggestions =
    user?.role === 'technicien'
      ? [
          'Calculer la chute de tension pour 40m de câble 16mm² sous 48V DC',
          'Interpréter alarme haute pression sur compresseur frigorifique R404A',
          'Vérifier schéma de terre et parafoudre T1+T2 en zone orageuse Douala',
        ]
      : [
          'Dimensionner un kit solaire pour faire fonctionner 2 climatiseurs et 1 frigo à Douala',
          'Quel est le coût moyen pour sécuriser un groupe électrogène de 20kVA ?',
          'Comment diagnostiquer une perte de froid soudaine sur une chambre de stockage ?',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[92dvh] sm:h-[640px] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#063D2A] text-white px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between border-b border-[#075B35] shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-xs">
              <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
            </div>
            <div className="truncate">
              <h3 className="font-['Space_Grotesk'] font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                <span>Copilote Technique GTEC</span>
                <Sparkles className="w-3.5 h-3.5 text-[#69B536]" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-200 truncate">
                Assistant Virtuel & Normes Tropicales Cameroun
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded transition-colors cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs (Scrollable on small mobile screens) */}
        <div className="bg-[#F5F7F1] border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-between text-xs overflow-x-auto shrink-0">
          <span className="text-slate-500 font-medium hidden md:inline shrink-0 mr-2">Modèle :</span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setMode('fast')}
              className={`px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'fast'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Rapide (3.1 Lite)</span>
            </button>
            <button
              onClick={() => setMode('general')}
              className={`px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'general'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>Standard (3.8 Flash)</span>
            </button>
            <button
              onClick={() => setMode('deep_thinking')}
              className={`px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'deep_thinking'
                  ? 'bg-[#075B35] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="gemini-4-argon avec ThinkingLevel.HIGH pour calculs et diagnostics poussés"
            >
              <Brain className="w-3 h-3 text-[#69B536]" />
              <span>High Thinking (4 Argon)</span>
            </button>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#063D2A] text-[#69B536] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#075B35] text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                {msg.text}

                {msg.modelUsed && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Modèle : {msg.modelUsed}</span>
                    {msg.thinkingApplied && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          <Brain className="w-2.5 h-2.5" /> High Thinking
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#063D2A] text-[#69B536] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 shadow-xs text-xs text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#69B536] animate-ping" />
                <span>
                  {mode === 'deep_thinking'
                    ? 'Analyse approfondie en cours via gemini-4-argon (ThinkingLevel.HIGH)...'
                    : 'GTEC Copilote réfléchit...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto shrink-0">
          <div className="flex gap-1.5 whitespace-nowrap text-[10px] sm:text-[11px]">
            <span className="text-slate-500 py-1 font-medium hidden sm:inline">Exemples :</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question technique ou décrivez un besoin..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35] focus:bg-white transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-3.5 sm:px-4 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Envoyer</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
