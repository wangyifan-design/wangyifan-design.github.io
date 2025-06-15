document.addEventListener("DOMContentLoaded", () => {
  // === 聊天功能相关 DOM ===
  const input = document.getElementById('user-input');
  const chat = document.getElementById('chat-content');
  const illustration = document.getElementById('illustration');
  const presetQuestionsContainer = document.getElementById('preset-questions');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // ✅ 如果这些元素存在，才初始化聊天逻辑
  if (input && chat && illustration && presetQuestionsContainer) {
    let isRequesting = false;
    let thinkingMessage = null;

    const illustrations = [
      'img/illustration/1.jpg',
      'img/illustration/2.jpg',
      'img/illustration/3.jpg',
      'img/illustration/4.jpg',
      'img/illustration/5.jpg',
      'img/illustration/6.jpg',
      'img/illustration/7.jpg',
      'img/illustration/8.jpg',
      'img/illustration/9.jpg',
      'img/illustration/10.jpg',
      'img/illustration/11.jpg'
    ];
    let illustrationIndex = 0;

    const presetQuestions = [
      "What kind of designer are you?",
      "What inspires your work?",
      "Can you recommend a project?",
      "How do you use AI in your design?"
    ];
    const clickedQuestions = new Set();

    function renderPresetQuestions() {
      presetQuestionsContainer.innerHTML = '';
      presetQuestions.forEach((q, i) => {
        if (!clickedQuestions.has(i)) {
          const span = document.createElement('span');
          span.textContent = q;
          span.title = 'Click to ask';
          span.addEventListener('click', () => {
            clickedQuestions.add(i);
            renderPresetQuestions();
            startConversation(q);
          });
          presetQuestionsContainer.appendChild(span);
        }
      });
      presetQuestionsContainer.style.display = presetQuestionsContainer.children.length ? 'block' : 'none';
    }

    renderPresetQuestions();

    async function startConversation(message) {
      if (isRequesting) return;
      isRequesting = true;

      chat.innerHTML = '';
      addUserMessage(message);
      const isChinese = /[\u4e00-\u9fa5]/.test(message);
      displayThinking();

      try {
        const knowledge = await fetch('/knowledge.json').then(res => res.json());

        let answer = null;
        for (let item of knowledge) {
          if (!item.keywords || !Array.isArray(item.keywords)) continue;
          for (let keyword of item.keywords) {
            if (message.toLowerCase().includes(keyword.toLowerCase())) {
              answer = isChinese ? item.a.zh : item.a.en;
              break;
            }
          }
          if (answer) break;
        }

        if (!answer) {
          console.log("Fetching answer from OpenAI...");
          answer = await fetchFromOpenAI(message);
        }

        displayAnswer(answer);
        switchIllustration();
      } catch (err) {
        displayAnswer(`Error: ${err.message}`);
      } finally {
        isRequesting = false;
      }
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = input.value.trim();
        if (text) {
          clickedQuestions.add(-1);
          renderPresetQuestions();
          startConversation(text);
          input.value = '';
        }
      }
    });

    async function fetchFromOpenAI(userInput) {
      try {
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
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }

    function addUserMessage(text) {
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message user';
      userMsg.textContent = text;
      chat.appendChild(userMsg);
    }

    function displayThinking() {
      thinkingMessage = document.createElement('div');
      thinkingMessage.className = 'chat-message ai';
      thinkingMessage.textContent = 'Thinking...';
      chat.appendChild(thinkingMessage);
    }

    function displayAnswer(answer) {
      if (thinkingMessage) {
        chat.removeChild(thinkingMessage);
      }
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai';
      aiMsg.textContent = answer;
      chat.appendChild(aiMsg);
    }

    function switchIllustration() {
      illustrationIndex = (illustrationIndex + 1) % illustrations.length;
      illustration.src = illustrations[illustrationIndex];
    }
  }

  // ✅ 以下逻辑所有页面都适用

  // navbar 滚动隐藏
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.getElementById('navbar');
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

  // 图片滚动浮现
  window.addEventListener('scroll', () => {
    const images = document.querySelectorAll('.project-image');
    images.forEach((image) => {
      const imagePosition = image.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (imagePosition < windowHeight * 0.95) {
        image.classList.add('visible');
      }
    });
  });

  // 隐藏箭头
  window.addEventListener('scroll', () => {
    const scrollArrow = document.getElementById('scroll-arrow');
    if (scrollArrow && window.scrollY > 10) {
      scrollArrow.classList.add('hidden');
    }
  });

  // 自定义鼠标跟随
  const cursorDot = document.getElementById('cursor-dot');
  if (cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
    });
  }

  //   play点击全屏
  document.querySelectorAll('.project-image').forEach(img => {
    if (img.tagName === 'IMG') {
        img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
        });
    }
    });

    window.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
    });

    function closeLightbox() {
    lightbox.style.display = 'none';
    }
});
