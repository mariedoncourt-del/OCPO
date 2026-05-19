import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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

  return (
    <div className="flex h-screen bg-[#F8FAFC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-200 bg-white">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1E3A5F]">MAF Assistant</h1>
            <p className="text-[10px] text-slate-500">Financement OPCO 2026</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Assistant OPCO & FAF</h2>
              <p className="text-slate-600">Posez une question sur les financements formation 2026.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="max-w-3xl mx-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Markdown>{message.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") || ""}</Markdown>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Écrivez votre question..."
              rows={2}
            />
            <button onClick={handleSend} className="rounded-xl bg-[#1E3A5F] px-4 text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;
