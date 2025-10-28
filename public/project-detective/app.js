// Project Detective — main controller (script-driven version)
// Uses content.js for all text and metadata

(() => {
    const { I18N, EVIDENCE, KEY, STAGES, LINES, FLOWS, ROUTES, HEARING } = window.CONTENT;
    let LANG = 'zh';
    const TOTAL = EVIDENCE.length;
    const ctx = { unlockedCount: 0, stageIndex: 0, awaiting: null };
    const htmlCache = new Map();

    const el = {
        files: document.getElementById('files'),
        progressLabel: document.getElementById('progressLabel'),
        progressPct: document.getElementById('progressPct'),
        barFill: document.getElementById('barFill'),
        barText: document.getElementById('barText'),
        stageBadge: document.getElementById('stageBadge'),
        stageHint: document.getElementById('stageHint'),
        messages: document.getElementById('messages'),
        input: document.getElementById('input'),
        send: document.getElementById('send'),
        langToggle: document.getElementById('langToggle'),
        filesHeader: document.getElementById('filesHeader'),
        resetBtn: document.getElementById('resetBtn'),
        deleteModal: document.getElementById('deleteModal'),
        delTitle: document.getElementById('delTitle'),
        delBody: document.getElementById('delBody'),
        delY: document.getElementById('delY'),
        delN: document.getElementById('delN'),
        delO: document.getElementById('delO'),
        previewModal: document.getElementById('previewModal'),
        pvTitle: document.getElementById('pvTitle'),
        pvImg: document.getElementById('pvImg'),
        pvHtml: document.getElementById('pvHtml'),
        pvDesc: document.getElementById('pvDesc'),
        pvClose: document.getElementById('pvClose'),
    };
    let currentPreview = null;

    // ---------- utility ----------
    const msg = (text, role = 'system') => {
        const node = document.createElement('div');
        node.className = `msg ${role}`;
        node.textContent = text;
        el.messages.appendChild(node);
        el.messages.scrollTop = el.messages.scrollHeight;
        return node;
    };

    const calcTypingDelay = (text = '') => {
        const base = 320;
        const perChar = 22;
        const max = 1800;
        return Math.min(max, base + Math.max(0, text.length - 8) * perChar);
    };

    const showTyping = (role = 'human') => {
        const bubble = document.createElement('div');
        bubble.className = `msg ${role} typing`;
        const dots = document.createElement('span');
        dots.className = 'typing-dots';
        for (let i = 0; i < 3; i++) dots.appendChild(document.createElement('i'));
        bubble.appendChild(dots);
        el.messages.appendChild(bubble);
        el.messages.scrollTop = el.messages.scrollHeight;
        return bubble;
    };

    const speak = (text, role = 'human', delay) => {
        const typingBubble = showTyping(role);
        const waitMs = typeof delay === 'number' ? delay : calcTypingDelay(text);
        return new Promise((resolve) => {
            setTimeout(() => {
                if (typingBubble && typingBubble.parentNode) typingBubble.parentNode.removeChild(typingBubble);
                msg(text, role);
                resolve();
            }, waitMs);
        });
    };

    const jane = (text, opts = {}) => speak(text, 'human', opts.delay);
    const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

    // ---------- UI render helpers ----------
    function renderFiles() {
        el.files.innerHTML = '';
        EVIDENCE.filter(ev => ev.unlocked).forEach(ev => {
            const row = document.createElement('div');
            row.className = 'file done';
            const hasPreview = Boolean(ev.img || ev.html || ev.htmlSrc);
            const ext = (ev.html || ev.htmlSrc) ? 'html' : 'jpg';
            const title = ev.title?.[LANG] || ev.title?.en || ev.code;
            const subtitle = ev.desc?.[LANG] || ev.desc?.en || `${ev.code}.${ext}`;
            row.innerHTML = `
      <div class="dot"></div>
      <div>
        <div class="name">${title}</div>
        <div class="desc">${subtitle}</div>
      </div>
      <div class="state">✓</div>`;
            if (hasPreview) {
                row.tabIndex = 0;
                row.setAttribute('role', 'button');
                row.addEventListener('click', () => showPreview(ev));
                row.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Enter' || evt.key === ' ') {
                        evt.preventDefault();
                        showPreview(ev);
                    }
                });
            }
            el.files.appendChild(row);
        });
    }

    function renderProgress() {
        const pct = Math.round((ctx.unlockedCount / TOTAL) * 100);
        el.progressPct.textContent = pct + '%';
        el.barFill.style.width = pct + '%';
        el.barText.textContent = `${ctx.unlockedCount} / ${TOTAL}`;
    }

    function renderStage() {
        el.stageBadge.textContent = STAGES[LANG][ctx.stageIndex];
        el.stageHint.textContent = I18N[LANG].stageHint;
    }

    function updateStage() {
        const count = ctx.unlockedCount;
        if (count >= 16) ctx.stageIndex = 4;
        else if (count >= 12) ctx.stageIndex = 3;
        else if (count >= 8) ctx.stageIndex = 2;
        else if (count >= 4) ctx.stageIndex = 1;
        else ctx.stageIndex = 0;
        renderStage();
    }

    function getHtmlSource(ev, lang) {
        if (!ev || !ev.htmlSrc) return null;
        if (typeof ev.htmlSrc === 'string') return ev.htmlSrc;
        return ev.htmlSrc[lang] || ev.htmlSrc.en || null;
    }

    async function loadHtml(ev, lang) {
        const src = getHtmlSource(ev, lang);
        if (!src) return '';
        const key = `${ev.code}:${lang}:${src}`;
        if (htmlCache.has(key)) {
            const cached = htmlCache.get(key);
            if (cached) {
                ev.html = ev.html || {};
                ev.html[lang] = cached;
            }
            return cached;
        }
        ev._loadingHtml = ev._loadingHtml || {};
        if (ev._loadingHtml[lang]) return '';
        ev._loadingHtml[lang] = true;
        try {
            const res = await fetch(src);
            if (!res.ok) throw new Error(`Failed to load ${src} (${res.status})`);
            const text = await res.text();
            htmlCache.set(key, text);
            ev.html = ev.html || {};
            ev.html[lang] = text;
            return text;
        } catch (err) {
            console.warn('[preview] unable to load report', src, err);
            htmlCache.set(key, '');
            return '';
        } finally {
            ev._loadingHtml[lang] = false;
            if (currentPreview === ev) renderPreview();
        }
    }

    function renderPreview() {
        if (!currentPreview) return;
        const title = currentPreview.title[LANG];
        const desc = currentPreview.desc?.[LANG] || '';
        const htmlByLang = currentPreview.html?.[LANG];
        const fallbackHtml = currentPreview.html?.en;
        const displayHtml = htmlByLang || fallbackHtml || '';
        const hasImg = Boolean(currentPreview.img);
        const hasHtmlSrc = Boolean(getHtmlSource(currentPreview, LANG));
        const hasHtml = Boolean(displayHtml);
        el.pvTitle.textContent = title;
        if (hasImg) {
            el.pvImg.src = currentPreview.img;
            el.pvImg.alt = title;
            el.pvImg.hidden = false;
        } else {
            el.pvImg.removeAttribute('src');
            el.pvImg.removeAttribute('alt');
            el.pvImg.hidden = true;
        }
        if (hasHtml && displayHtml) {
            el.pvHtml.hidden = false;
            el.pvHtml.innerHTML = displayHtml;
        } else {
            el.pvHtml.hidden = true;
            el.pvHtml.innerHTML = '';
        }
        if (!htmlByLang && hasHtmlSrc) {
            loadHtml(currentPreview, LANG);
        }
        el.pvDesc.textContent = desc;
        el.pvDesc.style.display = desc ? 'block' : 'none';
    }

    async function showPreview(ev) {
        if (!ev.img && !ev.html && !ev.htmlSrc) return;
        currentPreview = ev;
        el.previewModal.style.display = 'flex';
        renderPreview();
        if (ev.htmlSrc && !(ev.html && (ev.html[LANG] || ev.html.en))) {
            await loadHtml(ev, LANG);
            if (currentPreview === ev) renderPreview();
        }
    }

    function hidePreview() {
        el.previewModal.style.display = 'none';
        currentPreview = null;
        el.pvImg.removeAttribute('src');
        el.pvImg.removeAttribute('alt');
        el.pvImg.hidden = false;
        el.pvHtml.hidden = true;
        el.pvHtml.innerHTML = '';
        el.pvDesc.style.display = 'none';
    }

    function setLang(next) {
        LANG = next;
        el.filesHeader.textContent = I18N[LANG].files;
        el.progressLabel.textContent = I18N[LANG].progress;
        el.delTitle.textContent = I18N[LANG].delTitle;
        el.delBody.textContent = I18N[LANG].delBody;
        renderFiles();
        renderProgress();
        renderStage();
        renderPreview();
    }

    // ---------- evidence + modal ----------
    function unlockByCodes(codes = []) {
        if (!codes || !codes.length) return [];
        const unique = [...new Set(codes)];
        const newlyUnlocked = [];
        for (const code of unique) {
            const ev = EVIDENCE.find(e => e.code === code);
            if (ev && !ev.unlocked) {
                ev.unlocked = true;
                newlyUnlocked.push(ev);
            }
        }
        if (!newlyUnlocked.length) return [];
        ctx.unlockedCount = EVIDENCE.filter(e => e.unlocked).length;
        msg(I18N[LANG].systemRecovered(newlyUnlocked.map(ev => ev.code)), 'system');
        renderFiles();
        renderProgress();
        updateStage();
        return newlyUnlocked;
    }

    const showDelete = () => { el.deleteModal.style.display = 'flex'; };
    const hideDelete = () => { el.deleteModal.style.display = 'none'; };

    async function handleChoice(ch) {
        hideDelete();
        if (ch === 'Y') {
            const idx = EVIDENCE.findLastIndex(e => e.unlocked);
            if (idx >= 0) {
                EVIDENCE[idx].unlocked = false;
                ctx.unlockedCount = EVIDENCE.filter(x => x.unlocked).length;
                renderFiles();
                renderProgress();
                updateStage();
            }
            await jane(I18N[LANG].delThanks);
        } else if (ch === 'N') {
            await jane(I18N[LANG].insultA);
        } else if (ch === 'O') {
            msg('[Override executed.]', 'system');
            const remaining = EVIDENCE.filter(e => !e.unlocked).map(e => e.code);
            await jane(I18N[LANG].overrideWhisper);
            unlockByCodes(remaining);
        }
    }

    // ---------- script helpers ----------
    const getTemplateText = (key) => {
        const raw = I18N[LANG][key];
        if (typeof raw === 'function') return raw(ctx.unlockedCount, TOTAL);
        return raw;
    };

    const getLineValues = (lineKey) => {
        const raw = LINES[LANG][lineKey];
        if (Array.isArray(raw)) return raw;
        return typeof raw === 'string' ? [raw] : (raw ? [String(raw)] : []);
    };

    const resolveTexts = (step = {}) => {
        if (step.template) {
            const text = getTemplateText(step.template);
            return text ? [text] : [];
        }
        if (step.line) {
            return getLineValues(step.line);
        }
        if (step.text) {
            const raw = typeof step.text === 'string' ? step.text : (step.text[LANG] ?? step.text.en ?? '');
            if (Array.isArray(raw)) return raw;
            return raw ? [raw] : [];
        }
        return [];
    };

    const matchIntent = (intent, text) => {
        const rules = KEY[intent];
        return Array.isArray(rules) ? rules.some((r) => r.test(text)) : false;
    };

    const findRoute = (text) => {
        if (!ROUTES) return null;
        return ROUTES.find(route => route.intents?.some(intent => matchIntent(intent, text)));
    };

    const maybeTriggerDelete = () => {
        if (ctx.unlockedCount >= 16) {
            setTimeout(() => {
                jane(LINES[LANG].deleteNow).then(() => showDelete());
            }, 400);
        }
    };

    async function deliverStep(step = {}) {
        if (step.speaker === 'jane') {
            const texts = resolveTexts(step);
            for (const line of texts) {
                await jane(line, { delay: step.delay });
                if (step.pause) await wait(step.pause);
            }
            return;
        }
        if (step.speaker === 'system') {
            const texts = resolveTexts(step);
            texts.forEach((line) => msg(line, 'system'));
        }
    }

    async function playFlow(flowId) {
        if (!flowId) return { unlocked: [] };
        const flow = FLOWS?.[flowId];
        if (!flow) return { unlocked: [] };

        for (const step of flow.steps || []) {
            await deliverStep(step);
        }

        let unlocked = [];
        if (flow.unlock?.length) {
            unlocked = unlockByCodes(flow.unlock);
        }

        if (flow.after === 'checkDelete') {
            maybeTriggerDelete();
        }

        return { unlocked };
    }

    async function handleAction(action) {
        if (action === 'delete') {
            showDelete();
            return;
        }
        if (action === 'report') {
            msg(I18N[LANG].report, 'system');
            return;
        }
        if (action === 'override') {
            await handleChoice('O');
        }
    }

    // ---------- routing ----------
    async function route(text) {
        const t = text.trim();
        if (!t) return;
        msg(t, 'player');

        const awaitingHearing = ctx.awaiting === 'hearing';
        if (awaitingHearing && HEARING) {
            const heardYes = HEARING.positiveIntents?.some(intent => matchIntent(intent, t));
            const heardNo = HEARING.negativeIntents?.some(intent => matchIntent(intent, t));

            if (heardYes) {
                ctx.awaiting = null;
                await playFlow(HEARING.successFlow);
                return;
            }

            await playFlow(HEARING.retryFlow);
            ctx.awaiting = 'hearing';
            return;
        }

        const routeMatch = findRoute(t);
        if (routeMatch) {
            if (routeMatch.flow) {
                await playFlow(routeMatch.flow);
                return;
            }
            if (routeMatch.action) {
                await handleAction(routeMatch.action);
                return;
            }
        }

        await playFlow('fallback');
    }

    // ---------- boot ----------
    async function boot() {
        setLang(LANG);
        el.messages.innerHTML = '';
        msg(I18N[LANG].systemInit, 'system');

        if (HEARING?.promptFlow) {
            ctx.awaiting = 'hearing';
            await playFlow(HEARING.promptFlow);
        } else {
            await playFlow('introWelcome');
        }
    }

    // ---------- events ----------
    el.send.addEventListener('click', () => {
        const v = el.input.value;
        el.input.value = '';
        route(v).catch(console.error);
    });

    el.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const v = el.input.value;
            el.input.value = '';
            route(v).catch(console.error);
        }
    });

    el.langToggle.addEventListener('click', () => setLang(LANG === 'zh' ? 'en' : 'zh'));

    el.resetBtn.addEventListener('click', () => {
        EVIDENCE.forEach(e => e.unlocked = false);
        ctx.unlockedCount = 0;
        ctx.stageIndex = 0;
        ctx.awaiting = null;
        el.messages.innerHTML = '';
        boot().catch(console.error);
    });

    el.delY.addEventListener('click', () => handleChoice('Y').catch(console.error));
    el.delN.addEventListener('click', () => handleChoice('N').catch(console.error));
    el.delO.addEventListener('click', () => handleChoice('O').catch(console.error));
    el.deleteModal.addEventListener('click', (e) => { if (e.target === el.deleteModal) hideDelete(); });
    el.previewModal.addEventListener('click', (e) => { if (e.target === el.previewModal) hidePreview(); });
    el.pvClose.addEventListener('click', hidePreview);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (el.previewModal.style.display === 'flex') hidePreview();
            if (el.deleteModal.style.display === 'flex') hideDelete();
        }
    });

    boot().catch(console.error);
})();
