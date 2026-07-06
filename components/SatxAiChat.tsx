"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE =
  "Welcome to SATX AI. Tell me what material or solution you need — IT, networking, electrical, industrial, ELV, CCTV, UPS, MEP, or engineering procurement. I can help with specs and RFQs, but I do not provide prices.";

const SUGGESTED_PROMPTS = [
  "Cisco 48 Port PoE Switch",
  "CAT6A Cable",
  "2 Inch SS Ball Valve",
  "UPS 10kVA",
  "Hotel CCTV System",
];

export default function SatxAiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = { role: "user", content };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/satx-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Sorry, I could not process this request.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Server error. Please try again or contact SaturnX directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="satx-chat-panel satx-fade-in">
      <div className="satx-chat-panel__header">
        <div>
          <h2 className="satx-chat-panel__title">
            <img
              src="/satx-ai-logo.png"
              alt=""
              className="satx-ai-logo satx-ai-logo--sm"
              width={120}
              height={32}
              aria-hidden="true"
            />
            Ask SATX AI
          </h2>
          <p className="satx-chat-panel__subtitle">
            Search materials, compare specs, or prepare RFQ details for SaturnX
            quotation.
          </p>
        </div>
        <span className="satx-chat-panel__badge">Enterprise AI</span>
      </div>

      <div
        ref={messagesContainerRef}
        className="satx-chat-panel__messages"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`satx-chat-bubble satx-chat-bubble--${msg.role} satx-message-in`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="satx-chat-bubble satx-chat-bubble--assistant satx-chat-bubble--loading satx-message-in">
            <span className="satx-typing">
              <span />
              <span />
              <span />
            </span>
            SATX AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="satx-chat-panel__prompts" aria-label="Suggested prompts">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="satx-prompt-chip"
            disabled={loading}
            onClick={() => sendMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="satx-chat-panel__composer">
        <input
          className="satx-chat-panel__input"
          type="text"
          placeholder="Search material or ask for quotation support..."
          value={input}
          disabled={loading}
          aria-label="Message SATX AI"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button
          type="button"
          className="btn satx-chat-panel__send"
          disabled={loading || !input.trim()}
          onClick={() => void sendMessage()}
        >
          <i className="fas fa-paper-plane" aria-hidden="true" />
          Send
        </button>
      </div>
    </div>
  );
}
