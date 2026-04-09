/**
 * NovaMind Chat UI — chat.js
 * Author: Student
 * Technologies: JavaScript, jQuery, Bootstrap 5
 */

$(document).ready(function () {

  /* =========================================================
     STATE
     ========================================================= */
  let isTyping = false;
  let isDark = false;
  let chatMessages = []; // for export

  /* =========================================================
     MOCK AI RESPONSES
     ========================================================= */
  const aiResponses = [
    "That's a great question! Let me think through this carefully.\n\nThe key insight here is that we need to consider multiple perspectives before arriving at an answer. There are several factors at play, and understanding them together gives us the clearest picture.",
    "I'd be happy to help with that! Here's what you should know:\n\n**Key Points:**\n- The first thing to consider is the context\n- Next, think about the constraints involved\n- Finally, evaluate the available options\n\nDoes this help clarify things for you?",
    "Interesting! This is actually a topic with a lot of depth. Let me break it down:\n\nAt its core, the concept revolves around a few fundamental principles. Once you grasp those, everything else falls into place naturally.",
    "Great choice! Here's a concise overview:\n\nThe approach you're considering has both strengths and trade-offs. The strengths include simplicity and flexibility. However, be mindful of edge cases that might require extra handling.",
    "Absolutely! Here's a quick example in Python:\n\n```python\ndef solve(data):\n    # Process the input\n    result = [x for x in data if x > 0]\n    return sorted(result)\n\nprint(solve([-1, 3, 0, 7, -2, 5]))\n# Output: [3, 5, 7]\n```\n\nThis approach runs in **O(n log n)** time — efficient for most use cases.",
    "Of course! Let me walk you through this step by step.\n\n1. **Start with the basics** — make sure you have a solid foundation before diving deeper.\n2. **Build incrementally** — small, testable pieces are easier to debug.\n3. **Test often** — catch issues early before they compound.\n\nWould you like me to elaborate on any of these points?",
    "That's a nuanced topic. Here are a few perspectives:\n\n**In favor:** The approach offers flexibility and broad applicability.\n**Against:** It can add complexity and overhead in simpler scenarios.\n\nThe best choice really depends on your specific use case and constraints.",
    "Sure! The short answer is: *it depends* on your goals and resources.\n\nIf speed is the priority, go with option A. If quality matters more, option B is worth the extra effort. Both are valid — just pick what aligns with your requirements.",
    "Nice! Here's a mental model that might help:\n\nThink of it like a recipe. You need the right *ingredients* (data), the right *tools* (algorithms), and the right *process* (workflow). Miss any one of those and the result suffers.",
    "Happy to help! The concept you're asking about is foundational to many modern systems.\n\nIn essence, it solves the problem of **coordination under uncertainty** — allowing multiple components to agree on a shared state without a central authority. It's elegant once it clicks!"
  ];

  /* =========================================================
     UTILITY: GET CURRENT TIME
     ========================================================= */
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /* =========================================================
     UTILITY: FORMAT MESSAGE (bold, italic, code blocks)
     ========================================================= */
  function formatMessage(text) {
    // Escape HTML first
    let escaped = $('<div>').text(text).html();

    // Code blocks (```...```)
    escaped = escaped.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code (`...`)
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold (**...**)
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic (*...*)
    escaped = escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Newlines to <br>
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
  }

  /* =========================================================
     ADD MESSAGE
     ========================================================= */
  function addMessage(text, sender) {
    const time = getCurrentTime();
    const isUser = sender === 'user';
    const messageClass = isUser ? 'user-message' : 'ai-message';
    const avatarContent = isUser ? 'S' : '<i class="fa-solid fa-bolt"></i>';
    const senderName = isUser ? 'You' : 'NovaMind';
    const formattedText = formatMessage(text);

    const messageHTML = `
      <div class="message ${messageClass}">
        <div class="msg-avatar">${avatarContent}</div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">${senderName}</span>
            <span class="msg-time">${time}</span>
          </div>
          <div class="msg-bubble">${formattedText}</div>
        </div>
      </div>
    `;

    $('#messagesContainer').append(messageHTML);
    scrollToBottom();

    // Save for export
    chatMessages.push({ sender: senderName, text, time });
  }

  /* =========================================================
     TYPEWRITER EFFECT FOR AI RESPONSES
     ========================================================= */
  function addMessageWithTypewriter(text, sender) {
    const time = getCurrentTime();
    const formattedText = formatMessage(text);

    const msgId = 'msg-' + Date.now();

    const messageHTML = `
      <div class="message ai-message" id="${msgId}">
        <div class="msg-avatar"><i class="fa-solid fa-bolt"></i></div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">NovaMind</span>
            <span class="msg-time">${time}</span>
          </div>
          <div class="msg-bubble typewriter-cursor"></div>
        </div>
      </div>
    `;

    $('#messagesContainer').append(messageHTML);
    scrollToBottom();

    const $bubble = $(`#${msgId} .msg-bubble`);
    const plainChars = text.split('');
    let i = 0;

    function typeNext() {
      if (i < plainChars.length) {
        // Type a small chunk per frame for speed
        const chunk = plainChars.slice(i, i + 4).join('');
        const currentText = text.substring(0, i + chunk.length);
        $bubble.html(formatMessage(currentText));
        i += chunk.length;
        scrollToBottom();
        setTimeout(typeNext, 22);
      } else {
        // Done typing — remove cursor class
        $bubble.removeClass('typewriter-cursor');
        chatMessages.push({ sender: 'NovaMind', text, time });
      }
    }

    typeNext();
  }

  /* =========================================================
     SCROLL TO BOTTOM
     ========================================================= */
  function scrollToBottom() {
    const $section = $('#messagesSection');
    $section.stop(true).animate({ scrollTop: $section[0].scrollHeight }, 250);
  }

  /* =========================================================
     SHOW / HIDE TYPING INDICATOR
     ========================================================= */
  function showTyping() {
    $('#typingIndicator').fadeIn(200);
    scrollToBottom();
  }

  function hideTyping() {
    $('#typingIndicator').fadeOut(200);
  }

  /* =========================================================
     SEND MESSAGE
     ========================================================= */
  function sendMessage() {
    const $input = $('#messageInput');
    const text = $input.val().trim();

    if (!text || isTyping) return;

    // Hide welcome screen on first message
    $('#welcomeScreen').fadeOut(300, function() {
      $(this).remove();
    });

    // Add user message
    addMessage(text, 'user');

    // Add to sidebar history
    addToHistory(text);

    // Clear input
    $input.val('').trigger('input');

    // Show typing indicator
    isTyping = true;
    showTyping();
    updateSendBtn();

    // Simulate AI response delay (1–2 seconds)
    const delay = 1000 + Math.random() * 1000;

    setTimeout(function () {
      hideTyping();
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      addMessageWithTypewriter(response, 'ai');
      isTyping = false;
      updateSendBtn();
    }, delay);
  }

  /* =========================================================
     UPDATE SEND BUTTON STATE
     ========================================================= */
  function updateSendBtn() {
    const hasText = $('#messageInput').val().trim().length > 0;
    $('#sendBtn').prop('disabled', !hasText || isTyping);
  }

  /* =========================================================
     AUTO-RESIZE TEXTAREA
     ========================================================= */
  function autoResize($el) {
    $el[0].style.height = 'auto';
    $el[0].style.height = Math.min($el[0].scrollHeight, 180) + 'px';
  }

  /* =========================================================
     ADD TO SIDEBAR HISTORY
     ========================================================= */
  function addToHistory(text) {
    const truncated = text.length > 38 ? text.substring(0, 38) + '…' : text;
    const $item = $(`
      <li class="history-item">
        <i class="fa-regular fa-message"></i>
        <span>${truncated}</span>
      </li>
    `);
    $('#chatHistoryList').prepend($item);
    // Mark as active
    $('.history-item').removeClass('active');
    $item.addClass('active');
  }

  /* =========================================================
     EXPORT CHAT
     ========================================================= */
  function exportChat() {
    if (chatMessages.length === 0) {
      alert('No messages to export yet!');
      return;
    }

    let content = 'NovaMind Chat Export\n';
    content += '='.repeat(40) + '\n';
    content += 'Exported on: ' + new Date().toLocaleString() + '\n';
    content += '='.repeat(40) + '\n\n';

    chatMessages.forEach(function (msg) {
      content += `[${msg.time}] ${msg.sender}:\n${msg.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const $a = $('<a>').attr({ href: url, download: 'novamind-chat.txt' });
    $('body').append($a);
    $a[0].click();
    $a.remove();
    URL.revokeObjectURL(url);
  }

  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  // Input: update button state & auto-resize
  $('#messageInput').on('input', function () {
    updateSendBtn();
    autoResize($(this));
  });

  // Send on Enter (Shift+Enter = newline)
  $('#messageInput').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click
  $('#sendBtn').on('click', function () {
    sendMessage();
  });

  // Suggestion cards
  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    $('#messageInput').val(prompt).trigger('input');
    sendMessage();
  });

  // New Chat
  $('#newChatBtn').on('click', function () {
    $('#messagesContainer').empty();
    chatMessages = [];
    isTyping = false;

    if ($('#welcomeScreen').length === 0) {
      const welcomeHTML = `
        <div class="welcome-screen" id="welcomeScreen">
          <div class="welcome-inner">
            <div class="welcome-icon"><i class="fa-solid fa-bolt"></i></div>
            <h1 class="welcome-title">What can I help with?</h1>
            <p class="welcome-subtitle">Ask me anything — I'm here to think, create, and explore with you.</p>
            <div class="suggestion-grid">
              <div class="suggestion-card" data-prompt="Explain quantum computing in simple terms with a real-world analogy">
                <span class="card-icon"><i class="fa-solid fa-atom"></i></span>
                <p class="card-title">Explain quantum computing</p>
                <p class="card-desc">in simple terms with an analogy</p>
              </div>
              <div class="suggestion-card" data-prompt="Write a short poem about the passage of time and how it feels different at different ages">
                <span class="card-icon"><i class="fa-solid fa-feather-pointed"></i></span>
                <p class="card-title">Write a short poem</p>
                <p class="card-desc">about the passage of time</p>
              </div>
              <div class="suggestion-card" data-prompt="Give me a 7-day meal plan for someone trying to eat healthy on a tight budget">
                <span class="card-icon"><i class="fa-solid fa-bowl-food"></i></span>
                <p class="card-title">Create a meal plan</p>
                <p class="card-desc">healthy eating on a budget</p>
              </div>
              <div class="suggestion-card" data-prompt="Write a Python function that sorts a list of dictionaries by a specific key, with error handling">
                <span class="card-icon"><i class="fa-solid fa-code"></i></span>
                <p class="card-title">Write Python code</p>
                <p class="card-desc">sort dictionaries by key</p>
              </div>
            </div>
          </div>
        </div>
      `;
      $('#messagesSection').prepend(welcomeHTML);
    } else {
      $('#welcomeScreen').show();
    }

    $('#messageInput').val('').trigger('input');
    closeSidebar();
  });

  // Hamburger — toggle sidebar on mobile
  $('#hamburgerBtn').on('click', function () {
    openSidebar();
  });

  // Overlay click — close sidebar
  $('#sidebarOverlay').on('click', function () {
    closeSidebar();
  });

  function openSidebar() {
    $('#sidebar').addClass('open');
    $('#sidebarOverlay').addClass('open');
  }

  function closeSidebar() {
    $('#sidebar').removeClass('open');
    $('#sidebarOverlay').removeClass('open');
  }

  // Theme toggle
  $('#themeToggle').on('click', function () {
    isDark = !isDark;
    $('body').attr('data-theme', isDark ? 'dark' : 'light');
    $('#themeIcon').toggleClass('fa-moon fa-sun');
    $('#themeLabel').text(isDark ? 'Light mode' : 'Dark mode');
  });

  // Export chat
  $('#exportBtn').on('click', function () {
    exportChat();
  });

  // History item click (demo: just highlight)
  $(document).on('click', '.history-item', function () {
    $('.history-item').removeClass('active');
    $(this).addClass('active');
    closeSidebar();
  });

  /* =========================================================
     INIT
     ========================================================= */
  updateSendBtn();
  $('#messageInput').focus();

});
