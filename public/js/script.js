const presetQuestions = [
  "What are you up to these days?",
  "Which project should I check out first?",
  "What’s something you're researching lately?",
  "Tell me about your dog!"
];

const PAGE_TRANSITION_IN_DURATION = 600;
const PAGE_TRANSITION_OUT_DURATION = 450;
const CITATION_PATTERN = /【\d+:[^†]+†[^】]+】/g;
const MEDIA_DATA_CANDIDATES = ['chat-media.json', '/chat-media.json'];
let isPageTransitioning = false;
let cachedKnowledge = null;
let cachedChatMedia = null;
let registeredLightbox = null;
let closeMobileNav = null;

function bootstrapPage() {
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

  if (pageType === 'chat') {
    setupChatPage(input, chat, presetQuestionsContainer, chatForm);
  }

  initMobileNavigation();
  initNavigationScroll();
  initCursor(cursorDot);
  initLightbox(lightbox, lightboxImg);
  initImageReveal();
}

// First page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapPage, { once: true });
} else {
  bootstrapPage();
}

// Re-run after each Astro View Transition swap
document.addEventListener('astro:after-swap', bootstrapPage);

function setupChatPage(input, chat, container, form) {
  if (!input || !chat || !container || !form) return;

  let isRequesting = false;
  let thinkingMessage = null;
  const chatHero = document.querySelector('.chat-page-hero');
  let hasConversation = false;

  const updateChatIntroVisibility = () => {
    if (!chatHero) return;
    chatHero.classList.toggle('hide-intro', hasConversation);
  };

  const markConversationStarted = () => {
    if (hasConversation) return;
    hasConversation = true;
    updateChatIntroVisibility();
  };

  updateChatIntroVisibility();

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
    addUserMessage(chat, message);
    markConversationStarted();
    scrollChatToBottom(chat);
    const isChinese = /[\u4e00-\u9fa5]/.test(message);
    thinkingMessage = displayThinking(chat);
    scrollChatToBottom(chat);

    try {
      const knowledge = await fetchKnowledge();
      let mediaCatalog = [];

      try {
        mediaCatalog = await fetchChatMedia();
      } catch (mediaError) {
        console.warn('Unable to load chat media map', mediaError);
      }

      let answer = findAnswerFromKnowledge(knowledge, message, isChinese);

      if (!answer) {
        answer = await fetchFromOpenAI(message);
      }

      const sanitizedAnswer = sanitizeAnswer(answer);
      const mediaMatches = matchMediaFromText(sanitizedAnswer, mediaCatalog);
      displayAnswer(chat, { text: sanitizedAnswer, media: mediaMatches }, thinkingMessage);
      sendFeedbackToGoogleSheet(message, sanitizedAnswer);
    } catch (error) {
      displayAnswer(chat, { text: `Error: ${error.message}` }, thinkingMessage);
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
  let isPinned = true;

  const setNavPosition = (visible) => {
    if (visible && !isPinned) {
      navbar.style.top = '0';
      isPinned = true;
    } else if (!visible && isPinned) {
      navbar.style.top = '-80px';
      isPinned = false;
    }
  };

  const handleScroll = () => {
    if (typeof closeMobileNav === 'function' && document.body.classList.contains('nav-menu-open')) {
      closeMobileNav();
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = scrollTop - lastScrollTop;

    if (scrollTop <= 24 || delta < 0) {
      setNavPosition(true);
    } else if (delta > 4) {
      setNavPosition(false);
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(handleScroll);
    }
  };

  navbar.style.top = '0';
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const menu = navbar.querySelector('.nav-right');
  if (!menu) return;

  if (!menu.id) {
    menu.id = 'primary-navigation';
  }

  let toggle = navbar.querySelector('.nav-toggle');
  let closeButton = navbar.querySelector('.nav-close');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle navigation');

    for (let index = 0; index < 3; index += 1) {
      const bar = document.createElement('span');
      bar.className = 'nav-toggle-bar';
      toggle.appendChild(bar);
    }

    navbar.insertBefore(toggle, menu);
  }

  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'nav-close';
    closeButton.setAttribute('aria-label', 'Close navigation');
    const icon = document.createElement('span');
    icon.className = 'nav-close-icon';
    icon.setAttribute('aria-hidden', 'true');
    closeButton.appendChild(icon);
    navbar.appendChild(closeButton);
  }

  toggle.setAttribute('aria-controls', menu.id);
  toggle.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
  closeButton.setAttribute('aria-hidden', 'true');

  const mediaQuery = window.matchMedia('(max-width: 768px)');

  const setMenuState = (shouldOpen) => {
    menu.classList.toggle('is-open', shouldOpen);
    toggle.classList.toggle('is-active', shouldOpen);
    toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    menu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    document.body.classList.toggle('nav-menu-open', shouldOpen);
    closeButton.classList.toggle('is-visible', shouldOpen);
    closeButton.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  };

  const closeMenu = () => setMenuState(false);
  closeMobileNav = closeMenu;

  const handleToggle = () => {
    if (!mediaQuery.matches) return;
    setMenuState(!menu.classList.contains('is-open'));
  };

  if (!toggle.dataset.toggleBound) {
    toggle.addEventListener('click', handleToggle);
    toggle.dataset.toggleBound = 'true';
  }

  if (!closeButton.dataset.closeBound) {
    closeButton.addEventListener('click', closeMenu);
    closeButton.dataset.closeBound = 'true';
  }

  if (!menu.dataset.mobileNavBound) {
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        closeMenu();
      }
    });
    menu.dataset.mobileNavBound = 'true';
  }

  const handleDocumentClick = (event) => {
    if (!menu.classList.contains('is-open')) return;
    if (navbar.contains(event.target)) return;
    closeMenu();
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  };

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeydown);

  const handleMediaChange = (event) => {
    if (!event.matches) {
      closeMenu();
      closeButton.classList.remove('is-visible');
      closeButton.setAttribute('aria-hidden', 'true');
    }
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleMediaChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleMediaChange);
  }
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
      target.classList.contains('chat-media-card') ||
      (target.closest && (target.closest('.project') || target.closest('.chat-media-link'))) ||
      typeof target.onclick === 'function')) {
      cursorDot.style.width = '36px';
      cursorDot.style.height = '36px';
    } else {
      cursorDot.style.width = '20px';
      cursorDot.style.height = '20px';
    }
  });
}

let lightboxAbortCtl = null;
let lightboxState = { images: [], index: 0 };

function initLightbox(lightbox, lightboxImg) {
  registeredLightbox = lightbox;
  if (!lightbox || !lightboxImg) return;

  // Clean up listeners from a previous run (View Transitions re-bootstrap).
  if (lightboxAbortCtl) lightboxAbortCtl.abort();
  lightboxAbortCtl = new AbortController();
  const { signal } = lightboxAbortCtl;

  // Collect the clickable project images in order so we can step through them.
  const imgs = Array.from(document.querySelectorAll('.project-image')).filter(
    (el) => el.tagName === 'IMG'
  );
  lightboxState.images = imgs;

  function show(i) {
    const total = lightboxState.images.length;
    if (!total) return;
    const idx = ((i % total) + total) % total;     // wrap-around
    lightboxState.index = idx;
    const el = lightboxState.images[idx];
    lightboxImg.src = el.src;
    lightboxImg.alt = el.alt || '';
    lightbox.style.display = 'block';
    // Hide the prev/next controls if there's only one image.
    const navs = lightbox.querySelectorAll('.lightbox-nav');
    navs.forEach((n) => { n.style.display = total > 1 ? '' : 'none'; });
  }
  function close() {
    lightbox.style.display = 'none';
  }
  function next() { show(lightboxState.index + 1); }
  function prev() { show(lightboxState.index - 1); }

  // Click on any image opens the lightbox at that index.
  imgs.forEach((img, i) => {
    img.addEventListener('click', () => show(i), { signal });
  });

  // Click outside the image (on the dim backdrop) closes.
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  }, { signal });

  // Prev / next / close buttons.
  const prevBtn  = lightbox.querySelector('.lightbox-prev');
  const nextBtn  = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (prevBtn)  prevBtn.addEventListener('click',  (e) => { e.stopPropagation(); prev();  }, { signal });
  if (nextBtn)  nextBtn.addEventListener('click',  (e) => { e.stopPropagation(); next();  }, { signal });
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); }, { signal });

  // Keyboard: arrows step, Escape closes (only while the lightbox is open).
  document.addEventListener('keydown', (event) => {
    if (lightbox.style.display !== 'block') return;
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
    else if (event.key === 'Escape') { close(); }
  }, { signal });
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

async function fetchChatMedia() {
  if (cachedChatMedia) return cachedChatMedia;

  let response = null;
  for (const url of MEDIA_DATA_CANDIDATES) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      response = res;
      break;
    } catch (error) {
      // try next candidate
    }
  }

  if (!response) {
    throw new Error('Failed to load chat media data');
  }

  cachedChatMedia = await response.json();
  return cachedChatMedia;
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

function matchMediaFromText(answer, mediaCatalog) {
  if (!answer || !Array.isArray(mediaCatalog) || !mediaCatalog.length) return [];

  const normalizedAnswer = normalizeTextForMatching(answer);
  if (!normalizedAnswer) return [];

  const matches = [];
  const seen = new Set();

  for (const media of mediaCatalog) {
    if (!media || seen.has(media.id || media.image)) continue;
    const keywords = Array.isArray(media.keywords) ? media.keywords : [];
    const hasKeyword = keywords.some(keyword => {
      if (!keyword) return false;
      return normalizedAnswer.includes(String(keyword).toLowerCase());
    });
    if (hasKeyword) {
      matches.push(media);
      seen.add(media.id || media.image);
    }
  }

  return matches;
}

function normalizeTextForMatching(text) {
  return String(text)
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .toLowerCase();
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
  scrollChatToBottom(container);
}

function displayThinking(container) {
  const thinkingMessage = document.createElement('div');
  thinkingMessage.className = 'chat-message ai thinking-message';
  const dotsContainer = document.createElement('span');
  dotsContainer.innerHTML = `Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
  thinkingMessage.appendChild(dotsContainer);
  container.appendChild(thinkingMessage);
  scrollChatToBottom(container);
  return thinkingMessage;
}

function displayAnswer(container, answerData, thinkingMessage) {
  if (thinkingMessage && thinkingMessage.parentNode === container) {
    container.removeChild(thinkingMessage);
  }
  const aiMsg = document.createElement('div');
  aiMsg.className = 'chat-message ai';
  container.appendChild(aiMsg);
  const data = typeof answerData === 'string' ? { text: answerData } : (answerData || {});
  const mediaItems = Array.isArray(data.media) ? data.media : [];
  scrollChatToBottom(container);

  typeWriter(data.text || '', aiMsg, 25, () => scrollChatToBottom(container)).then(() => {
    renderAnswerMedia(aiMsg, mediaItems);
    scrollChatToBottom(container);
  });
}

function sanitizeAnswer(answer) {
  if (!answer) return '';
  return answer.replace(CITATION_PATTERN, '');
}

function renderAnswerMedia(container, mediaItems) {
  if (!Array.isArray(mediaItems) || !mediaItems.length) return;
  const grid = document.createElement('div');
  grid.className = 'chat-media-grid';

  mediaItems.forEach(media => {
    const card = createMediaCard(media);
    if (card) {
      grid.appendChild(card);
    }
  });

  if (grid.children.length) {
    container.appendChild(grid);
  }
}

function createMediaCard(media) {
  if (!media || !media.image) return null;

  const card = document.createElement('article');
  card.className = 'chat-media-card';

  const img = document.createElement('img');
  img.src = media.image;
  img.alt = media.alt || media.title || '';
  card.appendChild(img);

  if (media.title || media.description) {
    const textWrapper = document.createElement('div');
    textWrapper.className = 'chat-media-text';

    if (media.title) {
      const title = document.createElement('p');
      title.className = 'chat-media-title';
      title.textContent = media.title;
      textWrapper.appendChild(title);
    }

    if (media.description) {
      const description = document.createElement('p');
      description.className = 'chat-media-desc';
      description.textContent = media.description;
      textWrapper.appendChild(description);
    }

    card.appendChild(textWrapper);
  }

  if (media.url) {
    const link = document.createElement('a');
    link.href = media.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'chat-media-link';
    link.appendChild(card);
    return link;
  }

  return card;
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

// Image reveal — fades in `.project-image` elements when they enter the viewport.
// Lives outside DOMContentLoaded so it can be called by bootstrapPage()
// on every page load *and* after every View Transition swap.
let imageRevealObserver = null;
function initImageReveal() {
  if (imageRevealObserver) imageRevealObserver.disconnect();

  imageRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        imageRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Mark already-loaded images that happen to be in the viewport immediately,
  // so they don't sit at opacity:0 if IntersectionObserver fires late.
  document.querySelectorAll('.project-image').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      el.classList.add('visible');
    } else {
      imageRevealObserver.observe(el);
    }
  });
}

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

function scrollChatToBottom(container) {
  if (!container) return;
  container.scrollTop = container.scrollHeight;
}

function typeWriter(text, container, delay = 30, onProgress) {
  return new Promise((resolve) => {
    if (!container) {
      resolve();
      return;
    }

    const content = typeof text === 'string' ? text : '';
    let i = 0;
    container.innerHTML = '';

    if (!content.length) {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (i < content.length) {
        container.innerHTML += content.charAt(i);
        i += 1;
        if (typeof onProgress === 'function') {
          onProgress();
        }
      } else {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}
