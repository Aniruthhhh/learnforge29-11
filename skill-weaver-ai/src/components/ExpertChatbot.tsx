import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { bottlenecks, performanceHistory, recommendations, skillTree } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickActions = ["Fix my weak topics", "Explain my bottleneck", "Give study plan", "Explain my dashboard"];

export function ExpertChatbot() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [openaiReady, setOpenaiReady] = useState<boolean | null>(null);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I am your LEARN FORGE AI strategist. I can explain your bottlenecks, digital twin simulation, and give a personalized next-step plan.",
    },
  ]);

  const userContext = useMemo(() => {
    const attemptedSkills = skillTree.filter((s) => s.attempts > 0);
    const weakTopics = attemptedSkills.filter((s) => s.accuracy < 60).map((s) => s.name);
    const avgAccuracy = Math.round(attemptedSkills.reduce((acc, s) => acc + s.accuracy, 0) / attemptedSkills.length);
    const avgTime = Math.round(attemptedSkills.reduce((acc, s) => acc + s.avgTime, 0) / attemptedSkills.length);
    const topBottlenecks = bottlenecks.slice(0, 3).map((b) => b.topic);
    const latestPerf = performanceHistory[performanceHistory.length - 1];
    return {
      userName: user.name,
      level: user.level,
      score: user.score,
      weakTopics,
      avgAccuracy,
      avgTime,
      bottlenecks: topBottlenecks,
      recommendations: recommendations.slice(0, 3).map((r) => r.title),
      latestPerformance: latestPerf,
    };
  }, [user]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/chat/status")
      .then((r) => r.json())
      .then((d: { openaiConfigured?: boolean }) => {
        if (!cancelled) setOpenaiReady(Boolean(d.openaiConfigured));
      })
      .catch(() => {
        if (!cancelled) setOpenaiReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function sendMessage(nextInput: string) {
    const question = nextInput.trim();
    if (!question || typing) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: question,
          userContext,
          chatHistory: nextHistory,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Chat request failed");

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.answer || "Based on your data, I recommend focused practice on your weakest topic.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Chat request failed";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage.includes("OPENAI_API_KEY")
            ? "I cannot access OpenAI yet. Add `OPENAI_API_KEY` in `.env`, restart `npm run dev:api`, then I can answer each question dynamically."
            : `I hit a connection issue: ${errorMessage}. Please retry, and I will tailor the answer to your current dashboard data.`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-900/80 text-cyan-200 shadow-[0_10px_30px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-transform hover:scale-105"
          aria-label="Open AI mentor chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[min(94vw,390px)] flex-col overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950/85 text-slate-100 shadow-2xl shadow-cyan-900/35 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <div>
                <p className="text-sm font-semibold">LEARN FORGE AI Strategist</p>
                <p className="text-xs text-slate-400">
                  {openaiReady === null && "Checking OpenAI…"}
                  {openaiReady === true && "Mentor + Product Expert · OpenAI ready"}
                  {openaiReady === false && "Add OPENAI_API_KEY in .env · restart dev:api"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-700/60 px-3 py-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="whitespace-nowrap rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-500/20"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            <button
              onClick={() => sendMessage("Explain my dashboard with current metrics and what I should do next.")}
              className="w-full rounded-lg border border-violet-300/30 bg-violet-500/10 px-3 py-2 text-left text-xs text-violet-100 hover:bg-violet-500/20"
            >
              Explain My Dashboard
            </button>
            <button
              onClick={() => sendMessage("I noticed recursion is hard. Give me a targeted 20-minute recovery plan.")}
              className="w-full rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-left text-xs text-red-100 hover:bg-red-500/20"
            >
              I noticed you are struggling in recursion. Want help?
            </button>

            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`max-w-[92%] rounded-xl px-3 py-2 text-sm ${m.role === "assistant" ? "bg-slate-800/80 text-slate-100" : "ml-auto bg-cyan-500/25 text-cyan-50"}`}>
                {m.content}
              </div>
            ))}
            {typing && <div className="max-w-[92%] rounded-xl bg-slate-800/80 px-3 py-2 text-sm text-slate-300">Thinking...</div>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-slate-700/60 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about bottlenecks, digital twin, next steps..."
                className="h-10 flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 text-sm outline-none ring-cyan-300/40 placeholder:text-slate-500 focus:ring-2"
              />
              <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
