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
      'img/illustration/11.jpg',
      'img/illustration/12.jpg',
      'img/illustration/13.jpg',
      'img/illustration/14.jpg',
      'img/illustration/15.jpg',
    ];
    let illustrationIndex = 0;

    const presetQuestions = [
      "What are you up to these days?",
      "Which project should I check out first?",
      "What’s something you're researching lately?",
      "Tell me about your dog!"
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
          console.log("No match in knowledge.json, trying OpenAI...");
          answer = await fetchFromOpenAI(message);
        }

        answer = answer.replace(/【\d+:[^†]+†[^】]+】/g, '');

        displayAnswer(answer);
        sendFeedbackToGoogleSheet(message, answer);
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
      thinkingMessage.className = 'chat-message ai thinking-message';

      // 创建动画容器
      const dotsContainer = document.createElement('span');
      dotsContainer.innerHTML = `
    Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
  `;

      thinkingMessage.appendChild(dotsContainer);
      chat.appendChild(thinkingMessage);
    }

    function displayAnswer(answer) {
      if (thinkingMessage) {
        chat.removeChild(thinkingMessage);
        thinkingMessage = null;
      }
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai';
      chat.appendChild(aiMsg);

      // 打字机效果
      typeWriter(answer, aiMsg, 25); // 25毫秒一个字，可根据需要调节速度
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

  // // 图片滚动浮现
  // window.addEventListener('scroll', () => {
  //   const images = document.querySelectorAll('.project-image');
  //   images.forEach((image) => {
  //     const imagePosition = image.getBoundingClientRect().top;
  //     const windowHeight = window.innerHeight;
  //     if (imagePosition < windowHeight * 0.95) {
  //       image.classList.add('visible');
  //     }
  //   });
  // });


  // 自定义鼠标跟随
  const cursorDot = document.getElementById('cursor-dot');

  document.addEventListener('mousemove', (e) => {
    cursorDot.style.top = `${e.clientY}px`;
    cursorDot.style.left = `${e.clientX}px`;

    // 检查是否 hover 在可点击元素上
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && (target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.classList.contains('preset-questions') ||
      target.closest('.project') ||
      typeof target.onclick === 'function')) {
      cursorDot.style.width = '36px';
      cursorDot.style.height = '36px';
    } else {
      cursorDot.style.width = '20px';
      cursorDot.style.height = '20px';
    }
  });



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
