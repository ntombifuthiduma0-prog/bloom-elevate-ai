import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { logActivity } from "@/lib/activity";

type AssistantSearch = { q?: string };

export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>): AssistantSearch => ({
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Assistant | Bloom & Elevate AI" },
      {
        name: "description",
        content:
          "Chat with the Bloom & Elevate AI assistant about client communication, event planning and daily productivity.",
      },
      { property: "og:title", content: "AI Assistant | Bloom & Elevate AI" },
      {
        property: "og:description",
        content: "Ask questions in natural language and get practical, brand-aligned guidance.",
      },
    ],
  }),
  component: Assistant,
});

const SUGGESTIONS = [
  "Plan my day for Saturday's garden celebration",
  "Draft a polite follow-up to a client who hasn't replied",
  "How should I prioritise setup tasks before a 14:00 event?",
  "Suggest three warm captions for our weekend highlights",
];

function textOf(message: { parts?: Array<{ type: string; text?: string }> }) {
  return (message.parts ?? [])
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

function Assistant() {
  const { q } = Route.useSearch();
  const [input, setInput] = useState("");
  const seeded = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
    logActivity({ icon: "chat", title: "Asked the assistant", detail: value });
  }

  useEffect(() => {
    if (q && !seeded.current) {
      seeded.current = true;
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <AppShell
      title="AI Assistant"
      subtitle="Ask anything about client communication, event planning or your working day."
    >
      <div className="px-6 pb-4 sm:px-8">
        <div className="card-soft flex h-[calc(100vh-16rem)] min-h-[32rem] flex-col overflow-hidden p-0">
          <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-xl py-8 text-center">
                <h3 className="font-display text-2xl">How can I help today?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  I know Bloom &amp; Elevate hosts events on Fridays, Saturdays, Sundays and public
                  holidays.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="min-h-11 rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm transition-colors hover:bg-muted"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const mine = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-line rounded-3xl px-5 py-3 text-sm leading-relaxed sm:max-w-[70%] ${
                        mine
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/60 text-foreground"
                      }`}
                    >
                      {textOf(message)}
                    </div>
                  </div>
                );
              })
            )}

            {status === "submitted" ? (
              <div className="flex justify-start">
                <div className="rounded-3xl bg-secondary/60 px-5 py-3">
                  <Shimmer>Thinking…</Shimmer>
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                The assistant could not respond. Please try again.
              </p>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:p-6"
          >
            <label className="sr-only" htmlFor="assistant-input">
              Message the assistant
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Bloom & Elevate AI…"
              className="min-h-11 w-full min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => stop()}
                className="min-h-11 shrink-0 rounded-2xl border border-border px-6 text-sm font-medium"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground"
              >
                Send
              </button>
            )}
          </form>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Responses are AI-generated and may be incomplete. Never share confidential client details
          you would not put in writing, and review guidance before acting on it.
        </p>
      </div>
    </AppShell>
  );
}
