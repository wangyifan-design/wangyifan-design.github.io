const presetQuestions = [
  "What are you up to these days?",
  "Which project should I check out first?",
  "What’s something you're researching lately?",
  "Tell me about your dog!"
];

const PAGE_TRANSITION_IN_DURATION = 600;
const PAGE_TRANSITION_OUT_DURATION = 450;
const CITATION_PATTERN = /【\d+:[^†]+†[^】]+】/g;
let isPageTransitioning = false;
let cachedKnowledge = null;
let registeredLightbox = null;

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('user-input');
  const chat = document.getElementById('chat-content');
  const presetQuestionsContainer = document.getElementById('preset-questions');
  const chatForm = document.querySelector('.chat-input');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const cursorDot = document.getElementById('cursor-dot');
  const pageType = document.body.dataset.page || 'default';

  requestAnimationFrame(() => {
    document.body.classList.add('page-transition-in');
    setTimeout(() => document.body.classList.remove('page-transition-in'), PAGE_TRANSITION_IN_DURATION);
  });

  if (pageType === 'home') {
    setupHomeChat(input, presetQuestionsContainer, chatForm);
  } else if (pageType === 'chat') {
    setupChatPage(input, chat, presetQuestionsContainer, chatForm);
  }

  initNavigationScroll();
  initCursor(cursorDot);
  initLightbox(lightbox, lightboxImg);
});

function setupHomeChat(input, container, form) {
  if (!input || !container || !form) return;

  renderPresetQuestions(container, (question) => navigateToChat(question), { removeOnClick: false });

  if (!form.dataset.homeSubmitBound) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      navigateToChat(value);
      input.value = '';
    });
    form.dataset.homeSubmitBound = 'true';
  }
}

function navigateToChat(rawMessage) {
  const message = (rawMessage || '').trim();
  if (!message) return;

  sessionStorage.setItem('initialQuestion', message);
  triggerPageExit(() => {
    window.location.href = 'chat.html';
  });
}

function setupChatPage(input, chat, container, form) {
  if (!input || !chat || !container || !form) return;

  let isRequesting = false;
  let thinkingMessage = null;

  renderPresetQuestions(container, (question) => {
    handleQuestion(question);
  });

  if (!form.dataset.chatSubmitBound) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      handleQuestion(value);
      input.value = '';
    });
    form.dataset.chatSubmitBound = 'true';
  }

  const storedQuestion = sessionStorage.getItem('initialQuestion');
  if (storedQuestion) {
    sessionStorage.removeItem('initialQuestion');
    handleQuestion(storedQuestion);
  }

  async function handleQuestion(rawMessage) {
    const message = (rawMessage || '').trim();
    if (!message || isRequesting) return;

    isRequesting = true;
    chat.innerHTML = '';
    addUserMessage(chat, message);
    const isChinese = /[\u4e00-\u9fa5]/.test(message);
    thinkingMessage = displayThinking(chat);

    try {
      const knowledge = await fetchKnowledge();
      let answer = findAnswerFromKnowledge(knowledge, message, isChinese);

      if (!answer) {
        answer = await fetchFromOpenAI(message);
      }

      answer = sanitizeAnswer(answer);
      displayAnswer(chat, answer, thinkingMessage);
      sendFeedbackToGoogleSheet(message, answer);
    } catch (error) {
      displayAnswer(chat, `Error: ${error.message}`, thinkingMessage);
    } finally {
      isRequesting = false;
    }
  }
}

function renderPresetQuestions(container, onSelect, { removeOnClick = true } = {}) {
  if (!container) return;

  const clicked = container.__presetClicked || new Set();
  container.__presetClicked = clicked;

  const render = () => {
    container.innerHTML = '';

    presetQuestions.forEach((question, index) => {
      if (removeOnClick && clicked.has(index)) {
        return;
      }
      const span = document.createElement('span');
      span.className = 'preset-question';
      span.dataset.index = String(index);
      span.dataset.question = question;
      span.title = 'Click to ask';
      span.textContent = question;
      container.appendChild(span);
    });

    if (!removeOnClick && !container.dataset.scrollCloned && container.children.length) {
      Array.from(container.children).forEach(node => {
        const clone = node.cloneNode(true);
        clone.dataset.clone = 'true';
        container.appendChild(clone);
      });
      container.dataset.scrollCloned = 'true';
    }

    container.style.display = container.children.length ? '' : 'none';

    const viewport = container.parentElement;
    if (viewport && viewport.classList && viewport.classList.contains('preset-questions-viewport')) {
      viewport.style.display = container.children.length ? '' : 'none';
    }
  };

  render();

  if (container.__presetHandler) {
    container.removeEventListener('click', container.__presetHandler);
  }

  const handler = (event) => {
    const span = event.target.closest('.preset-question');
    if (!span || !container.contains(span)) return;

    const question = span.dataset.question || span.textContent;
    const index = Number(span.dataset.index);

    if (removeOnClick && !Number.isNaN(index)) {
      clicked.add(index);
      render();
    }

    if (question) {
      onSelect(question);
    }
  };

  container.__presetHandler = handler;
  container.addEventListener('click', handler);
}

function triggerPageExit(callback) {
  if (isPageTransitioning) return;
  isPageTransitioning = true;
  document.body.classList.add('page-transition-out');
  document.body.classList.remove('page-transition-in');
  setTimeout(callback, PAGE_TRANSITION_OUT_DURATION);
}

function initNavigationScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const delta = scrollTop - lastScrollTop;
        if (Math.abs(delta) > 5) {
          navbar.style.top = delta > 0 ? '-70px' : '0';
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initCursor(cursorDot) {
  if (!cursorDot) return;

  document.addEventListener('mousemove', (event) => {
    cursorDot.style.top = `${event.clientY}px`;
    cursorDot.style.left = `${event.clientX}px`;

    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target && (target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.classList.contains('preset-questions') ||
      target.classList.contains('preset-question') ||
      (target.closest && target.closest('.project')) ||
      typeof target.onclick === 'function')) {
      cursorDot.style.width = '36px';
      cursorDot.style.height = '36px';
    } else {
      cursorDot.style.width = '20px';
      cursorDot.style.height = '20px';
    }
  });
}

function initLightbox(lightbox, lightboxImg) {
  registeredLightbox = lightbox;

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.project-image').forEach(img => {
    if (img.tagName === 'IMG') {
      img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
      });
    }
  });

  window.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
}

function closeLightbox() {
  if (registeredLightbox) {
    registeredLightbox.style.display = 'none';
  }
}

async function fetchKnowledge() {
  if (cachedKnowledge) return cachedKnowledge;

  const candidates = ['knowledge.json', '/knowledge.json'];
  let response = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      response = res;
      break;
    } catch (error) {
      // fall through to try next candidate
    }
  }

  if (!response) {
    throw new Error('Failed to load knowledge base');
  }

  cachedKnowledge = await response.json();
  return cachedKnowledge;
}

function findAnswerFromKnowledge(knowledge, message, isChinese) {
  if (!Array.isArray(knowledge)) return null;

  const normalizedMessage = message.toLowerCase();
  for (const item of knowledge) {
    if (!item.keywords || !Array.isArray(item.keywords)) continue;
    for (const keyword of item.keywords) {
      if (normalizedMessage.includes(String(keyword).toLowerCase())) {
        if (isChinese && item.a && item.a.zh) {
          return item.a.zh;
        }
        if (item.a && item.a.en) {
          return item.a.en;
        }
      }
    }
  }
  return null;
}

async function fetchFromOpenAI(userInput) {
  const apiUrl = '/api/assistant';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.reply;
}

function addUserMessage(container, text) {
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = text;
  container.appendChild(userMsg);
}

function displayThinking(container) {
  const thinkingMessage = document.createElement('div');
  thinkingMessage.className = 'chat-message ai thinking-message';
  const dotsContainer = document.createElement('span');
  dotsContainer.innerHTML = `Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
  thinkingMessage.appendChild(dotsContainer);
  container.appendChild(thinkingMessage);
  return thinkingMessage;
}

function displayAnswer(container, answer, thinkingMessage) {
  if (thinkingMessage && thinkingMessage.parentNode === container) {
    container.removeChild(thinkingMessage);
  }
  const aiMsg = document.createElement('div');
  aiMsg.className = 'chat-message ai';
  container.appendChild(aiMsg);
  typeWriter(answer, aiMsg, 25);
}

function sanitizeAnswer(answer) {
  if (!answer) return '';
  return answer.replace(CITATION_PATTERN, '');
}

// 页面加载时就检测可视区域元素并手动加上 .visible 类
function handleVisibilityOnLoad() {
  const elements = document.querySelectorAll('.project img, .project video');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight) {
      el.classList.add('visible');
    }
  });
}

// // 页面加载完后立即触发一次
// window.addEventListener('load', handleVisibilityOnLoad);

// // 保留滚动触发，用于后续图片进入视口时添加 .visible
// window.addEventListener('scroll', handleVisibilityOnLoad);

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 一旦可见就不再监听
      }
    });
  }, {
    threshold: 0.2  // 进入视口 10% 就触发
  });

  const targets = document.querySelectorAll('.project-image');
  targets.forEach(el => observer.observe(el));
});

// 监听用户消息和 AI 回复
// 获取你的 Google Apps Script Web App URL
const GOOGLE_SHEET_APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJdBnnzxyDtaIkCi7l7LJvpU7AWy3AUfZk0zVXvjecWbwfEvH5737pOZloqVyC-_gZ/exec"; // 替换成你的实际部署URL

async function sendFeedbackToGoogleSheet(userMessage, aiReply) {
  const formData = new FormData();
  formData.append("userMessage", userMessage);
  formData.append("aiReply", aiReply);
  formData.append("page", window.location.pathname);

  try {
    const response = await fetch(GOOGLE_SHEET_APP_SCRIPT_URL, {
      method: "POST",
      body: formData,
      // mode: 'no-cors' // 通常不需要，Apps Script 会处理 CORS
    });

    if (response.ok) {
      const result = await response.text(); // 获取Apps Script返回的文本
      console.log("✅ Feedback sent successfully:", result);
      // 可以在这里添加成功提示，例如弹窗或修改页面元素
    } else {
      console.error("❌ Failed to send feedback. Status:", response.status);
      // 可以在这里添加失败提示
    }
  } catch (error) {
    console.error("❌ Error sending feedback:", error);
    // 可以在这里处理网络错误等
  }
}

function typeWriter(text, container, delay = 30) {
  let i = 0;
  container.innerHTML = '';
  const interval = setInterval(() => {
    if (i < text.length) {
      container.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, delay);
}
