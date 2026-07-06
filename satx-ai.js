(function () {
  var appEl = document.getElementById("satx-app");
  var messagesEl = document.getElementById("satx-messages");
  var scrollEl = document.getElementById("satx-scroll");
  var inputEl = document.getElementById("satx-input");
  var sendBtn = document.getElementById("satx-send");
  var promptsEl = document.getElementById("satx-prompts");

  if (!appEl || !messagesEl || !inputEl || !sendBtn) return;

  var messages = [];

  var STARTER_PROMPTS = [
    { label: "Cisco 48-port switch", text: "Cisco 48-port PoE switch" },
    { label: "Draft an RFQ", text: "Help me draft an RFQ for structured cabling in Dammam" },
    { label: "10kVA UPS", text: "10kVA UPS for server room" },
    { label: "Hotel CCTV", text: "Hotel CCTV system requirements" },
  ];

  function updateLogoState() {
    var hasText = inputEl.value.trim().length > 0;
    appEl.classList.toggle("satx-app--typing", hasText);
  }

  function scrollToBottom() {
    if (scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }

  function updateSendButton() {
    sendBtn.disabled = !inputEl.value.trim() || sendBtn.dataset.loading === "true";
    updateLogoState();
  }

  function enterChatMode() {
    appEl.classList.add("satx-app--chatting");
  }

  function exitChatMode() {
    messages = [];
    appEl.classList.remove("satx-app--chatting", "satx-app--typing", "satx-app--focused");
    messagesEl.innerHTML = "";
    inputEl.value = "";
    updateSendButton();
    inputEl.focus();
  }

  function renderMessages() {
    messagesEl.innerHTML = "";

    messages.forEach(function (msg) {
      var bubble = document.createElement("div");
      bubble.className = "satx-message satx-message--" + msg.role;
      bubble.textContent = msg.content;
      messagesEl.appendChild(bubble);
    });

    scrollToBottom();
  }

  function setLoading(isLoading) {
    sendBtn.dataset.loading = isLoading ? "true" : "false";
    inputEl.disabled = isLoading;

    var existing = document.getElementById("satx-loading");
    if (isLoading) {
      if (!existing) {
        var loading = document.createElement("div");
        loading.id = "satx-loading";
        loading.className = "satx-message satx-message--assistant satx-message--loading";
        loading.textContent = "SATX AI is thinking...";
        messagesEl.appendChild(loading);
        scrollToBottom();
      }
    } else if (existing) {
      existing.remove();
    }

    updateSendButton();
  }

  async function sendMessage(text) {
    var content = (text || inputEl.value).trim();
    if (!content || sendBtn.dataset.loading === "true") return;

    enterChatMode();

    messages.push({ role: "user", content: content });
    inputEl.value = "";
    updateSendButton();
    renderMessages();
    setLoading(true);

    try {
      var res = await fetch("/api/satx-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages }),
      });

      var data = await res.json();
      var reply = data.reply;

      if (!reply && data.error === "OPENAI_API_KEY is not configured.") {
        reply =
          "SATX AI is not connected yet. Add OPENAI_API_KEY in Netlify environment variables, then redeploy.";
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

  inputEl.addEventListener("input", updateSendButton);

  inputEl.addEventListener("focus", function () {
    appEl.classList.add("satx-app--focused");
  });

  inputEl.addEventListener("blur", function () {
    if (!inputEl.value.trim()) {
      appEl.classList.remove("satx-app--focused");
    }
  });

  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  if (promptsEl) {
    STARTER_PROMPTS.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "satx-chip";
      btn.textContent = item.label;
      btn.addEventListener("click", function () {
        sendMessage(item.text);
      });
      promptsEl.appendChild(btn);
    });
  }

  document.querySelectorAll("[data-satx-prompt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeSidebar();
      sendMessage(btn.getAttribute("data-satx-prompt"));
    });
  });

  [document.getElementById("satx-new-chat"), document.getElementById("satx-new-chat-top")].forEach(
    function (btn) {
      if (btn) btn.addEventListener("click", exitChatMode);
    }
  );

  var sidebar = document.getElementById("satx-sidebar");
  var overlay = document.getElementById("satx-sidebar-overlay");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("is-open");
    if (overlay) overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  var openBtn = document.getElementById("satx-sidebar-open");
  var closeBtn = document.getElementById("satx-sidebar-close");
  if (openBtn) openBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  updateSendButton();
})();
