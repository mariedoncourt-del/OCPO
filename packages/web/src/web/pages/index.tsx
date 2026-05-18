import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Loader2, Building2, FileText, Euro, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { Markdown } from "../components/markdown";

const transport = new DefaultChatTransport({ api: "/api/agent/messages" });

const EXAMPLE_QUESTIONS = [
  {
    icon: Building2,
    label: "Identifier un financeur",
    question: "Mon client est boulanger artisan avec 5 salariés, quel financeur pour le dirigeant et pour ses salariés ?",
  },
  {
    icon: Euro,
    label: "Estimer un budget",
    question: "Quel budget mobilisable pour un quincaillier TPE de 8 salariés en 2026 ?",
  },
  {
    icon: FileText,
    label: "Pièces justificatives",
    question: "Quelles pièces sont nécessaires pour un dossier FAFCEA ?",
  },
  {
    icon: HelpCircle,
    label: "Vérifier une éligibilité",
    question: "La formation Instagram est-elle éligible FAFCEA pour un coiffeur artisan ?",
  },
];

function Index() {
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const handleExampleClick = (question: string) => {
    if (isLoading) return;
    sendMessage({ text: question });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-slate-200 bg-white">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1E3A5F] leading-tight">MAF Assistant</h1>
              <p className="text-xs text-slate-500">Financement OPCO 2026</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Questions exemples
          </p>
          <div className="space-y-2">
            {EXAMPLE_QUESTIONS.map((eq, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(eq.question)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-[#3B82F6] hover:bg-blue-50/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <eq.icon className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-xs font-semibold text-[#1E3A5F]">{eq.label}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{eq.question}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700 leading-relaxed">
              Les règles OPCO changent régulièrement. Vérifiez chaque dossier sur la grille officielle du financeur.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-2.5 px-4 py-3 border-b border-slate-200 bg-white">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1E3A5F]">MAF Assistant</h1>
            <p className="text-[10px] text-slate-500">Financement OPCO 2026</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <WelcomeScreen onQuestionClick={handleExampleClick} />
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Analyse en cours...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-blue-100 transition-all px-4 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question sur les financements OPCO..."
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none min-h-[24px] max-h-[120px] py-1 leading-relaxed"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E3A5F] hover:bg-[#2A5080] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Base de connaissance OPCO/FAF 2026 — Vérifiez toujours les informations auprès du financeur officiel
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function WelcomeScreen({ onQuestionClick }: { onQuestionClick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mb-5 shadow-lg shadow-blue-900/20">
        <MessageSquare className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Assistant Financement OPCO</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-md leading-relaxed">
        Interrogez la base de connaissance MAF 2026 en langage naturel. Financeurs, budgets, éligibilité, pièces justificatives — posez votre question.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {EXAMPLE_QUESTIONS.map((eq, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(eq.question)}
            className="text-left p-4 rounded-xl border border-slate-200 hover:border-[#3B82F6] hover:shadow-md transition-all bg-white group cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <eq.icon className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-sm font-semibold text-[#1E3A5F]">{eq.label}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{eq.question}</p>
            <div className="flex items-center gap-1 mt-2 text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-medium">Poser cette question</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`rounded-xl px-4 py-3 max-w-[85%] ${
          isUser
            ? "bg-[#1E3A5F] text-white"
            : "bg-white border border-slate-200 shadow-sm"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
                  {part.text}
                </p>
              );
            }
            return <Markdown key={i} content={part.text} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default Index;
