(function () {
  const messagesEl = document.getElementById("satx-messages");
  const inputEl = document.getElementById("satx-input");
  const sendBtn = document.getElementById("satx-send");
  const promptsEl = document.getElementById("satx-prompts");

  if (!messagesEl || !inputEl || !sendBtn) return;

  const messages = [
    {
      role: "assistant",
      content:
        "Welcome to SATX AI. Tell me what material or solution you need — IT, electrical, industrial, ELV, CCTV, UPS, networking or engineering. I can help with specs and RFQs, but I do not provide prices.",
    },
  ];

  const STARTER_PROMPTS = [
    "2 inch SS ball valve 2000 LBS",
    "Cisco 48-port PoE switch",
    "10kVA UPS for server room",
    "CAT6A cable for office cabling",
  ];

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderMessages() {
    messagesEl.innerHTML = "";

    messages.forEach(function (msg) {
      const bubble = document.createElement("div");
      bubble.className =
        "satx-message " +
        (msg.role === "user" ? "satx-message--user" : "satx-message--assistant");
      bubble.textContent = msg.content;
      messagesEl.appendChild(bubble);
    });

    scrollToBottom();
  }

  function setLoading(isLoading) {
    sendBtn.disabled = isLoading;
    inputEl.disabled = isLoading;

    const existing = document.getElementById("satx-loading");
    if (isLoading) {
      if (!existing) {
        const loading = document.createElement("div");
        loading.id = "satx-loading";
        loading.className = "satx-message satx-message--assistant satx-message--loading";
        loading.textContent = "SATX AI is thinking...";
        messagesEl.appendChild(loading);
        scrollToBottom();
      }
    } else if (existing) {
      existing.remove();
    }
  }

  async function sendMessage(text) {
    const content = (text || inputEl.value).trim();
    if (!content || sendBtn.disabled) return;

    const userMessage = { role: "user", content: content };
    messages.push(userMessage);
    inputEl.value = "";
    renderMessages();
    setLoading(true);

    try {
      const res = await fetch("/api/satx-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages }),
      });

      const data = await res.json();

      var reply = data.reply;
      if (!reply && data.error === "OPENAI_API_KEY is not configured.") {
        reply =
          "SATX AI is not connected yet. The site owner must add OPENAI_API_KEY in Netlify → Site configuration → Environment variables (scope: Functions), then trigger a new deploy. GitHub and local .env files do not apply to the live site.";
      }
      messages.push({
        role: "assistant",
        content: reply || data.error || "Sorry, I could not process this request.",
      });
    } catch (error) {
      messages.push({
        role: "assistant",
        content: "Server error. Please try again or contact SaturnX directly.",
      });
    } finally {
      setLoading(false);
      renderMessages();
    }
  }

  sendBtn.addEventListener("click", function () {
    sendMessage();
  });

  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  if (promptsEl) {
    STARTER_PROMPTS.forEach(function (prompt) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "satx-prompt-btn";
      btn.textContent = prompt;
      btn.addEventListener("click", function () {
        sendMessage(prompt);
      });
      promptsEl.appendChild(btn);
    });
  }

  renderMessages();
})();

(function () {
  var workspace = document.querySelector(".satx-command-workspace__inner");
  var tabButtons = document.querySelectorAll(".satx-mobile-tabs__btn");
  if (!workspace || !tabButtons.length) return;

  function setPanel(panel) {
    workspace.classList.remove(
      "satx-panel-active-chat",
      "satx-panel-active-domains",
      "satx-panel-active-rfq"
    );
    workspace.classList.add("satx-panel-active-" + panel);
    workspace.setAttribute("data-satx-active-panel", panel);

    tabButtons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-satx-panel") === panel;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (panel === "chat") {
      var messagesEl = document.getElementById("satx-messages");
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setPanel(btn.getAttribute("data-satx-panel"));
    });
  });

  document.querySelectorAll(".satx-category-card").forEach(function (card) {
    card.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setPanel("chat");
      }
    });
  });
})();
