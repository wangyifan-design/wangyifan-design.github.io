// Project Detective — main controller (script-driven version)
// Consumes qa.*.js + evidence.js for all text and metadata

(() => {
    const QA = {
        en: hydrateQA(window.QA_EN),
        zh: hydrateQA(window.QA_ZH),
    };
    const EVIDENCE = JSON.parse(JSON.stringify(window.EVIDENCE_DATA || []));
    let LANG = QA.zh ? 'zh' : 'en';
    if (!QA[LANG]) LANG = 'en';
    const TOTAL = EVIDENCE.length;
    const ctx = { unlockedCount: 0, triggered: new Set(), deletePrompted: false, awaitingHearing: false };
    const htmlCache = new Map();
    const urlPattern = /^[a-z][a-z0-9+.-]*:/i;

    const baseHref = (() => {
        const baseEl = document.querySelector('base');
        if (baseEl?.href) return baseEl.href;
        try {
            const current = new URL(window.location.href);
            const pathname = current.pathname || '/';
            const normalizePath = (path) => {
                if (!path || path === '/') return '/';
                if (path.endsWith('/')) return path;
                const lastSlash = path.lastIndexOf('/');
                const lastSegment = path.slice(lastSlash + 1);
                if (lastSegment.includes('.')) {
                    return path.slice(0, lastSlash + 1);
                }
                return `${path}/`;
            };
            const normalizedPath = normalizePath(pathname);
            return `${current.protocol}//${current.host}${normalizedPath}`;
        } catch (err) {
            console.warn('[assets] unable to determine base href', err);
            return '';
        }
    })();

    const resolveAssetUrl = (relPath) => {
        if (!relPath) return relPath;
        if (relPath.startsWith('//') || urlPattern.test(relPath)) return relPath;
        if (relPath.startsWith('/')) return relPath;
        if (!baseHref) return relPath;
        try {
            return new URL(relPath, baseHref).href;
        } catch (err) {
            console.warn('[assets] unable to resolve path', relPath, err);
            return relPath;
        }
    };

    function hydrateQA(raw = {}) {
        if (!raw) {
            return {
                ui: {},
                templates: {},
                intro: [],
                fallback: [],
                repeatWarnings: [],
                deletePrompt: '',
                actionReplies: {},
                hearing: null,
                sequences: [],
                actions: {},
            };
        }

        const compileTriggers = (list = []) => {
            const result = [];
            for (const item of list || []) {
                if (!item || !item.pattern) continue;
                const flags = item.flags || 'i';
                try {
                    result.push({
                        pattern: item.pattern,
                        flags,
                        regex: new RegExp(item.pattern, flags),
                    });
                } catch (err) {
                    console.warn('[qa] invalid pattern', item.pattern, err);
                }
            }
            return result;
        };

        const normalizeReplies = (replies = []) => {
            const out = [];
            (replies || []).forEach((reply) => {
                if (reply == null) return;
                if (typeof reply === 'string') {
                    out.push({ speaker: 'jane', text: reply });
                    return;
                }
                const speaker = reply.speaker || 'system';
                const value = reply.text;
                if (Array.isArray(value)) {
                    value.forEach((line) => {
                        if (line != null) out.push({ speaker, text: line });
                    });
                } else if (value != null) {
                    out.push({ speaker, text: value });
                }
            });
            return out;
        };

        const sequences = (raw.sequences || []).map((seq) => ({
            id: seq.id,
            triggers: compileTriggers(seq.triggers || []),
            replies: normalizeReplies(seq.replies),
            unlock: Array.isArray(seq.unlock) ? [...new Set(seq.unlock)] : [],
            once: seq.once !== false,
        }));

        const actions = {};
        for (const [key, action] of Object.entries(raw.actions || {})) {
            actions[key] = {
                triggers: compileTriggers(action.triggers || []),
            };
        }

        let hearing = null;
        if (raw.hearing) {
            hearing = {
                positive: compileTriggers(raw.hearing.positive || []),
                negative: compileTriggers(raw.hearing.negative || []),
                retry: normalizeReplies(raw.hearing.retry),
                success: normalizeReplies(raw.hearing.success),
            };
        }

        return {
            ui: raw.ui || {},
            templates: raw.templates || {},
            intro: normalizeReplies(raw.intro),
            fallback: Array.isArray(raw.fallback) ? raw.fallback.slice() : [],
            repeatWarnings: Array.isArray(raw.repeatWarnings) ? raw.repeatWarnings.slice() : [],
            deletePrompt: raw.deletePrompt || '',
            actionReplies: raw.actionReplies || {},
            hearing,
            sequences,
            actions,
        };
    }

    const el = {
        files: document.getElementById('files'),
        progressLabel: document.getElementById('progressLabel'),
        progressPct: document.getElementById('progressPct'),
        barFill: document.getElementById('barFill'),
        barText: document.getElementById('barText'),
        chatwrap: document.getElementById('chatwrap'),
        messages: document.getElementById('messages'),
        input: document.getElementById('input'),
        send: document.getElementById('send'),
        langToggle: document.getElementById('langToggle'),
        filesHeader: document.getElementById('filesHeader'),
        resetBtn: document.getElementById('resetBtn'),
        chatSearch: document.getElementById('chatSearch'),
        searchbar: document.querySelector('.searchbar'),
        searchStatus: document.getElementById('searchStatus'),
        searchPrev: document.getElementById('searchPrev'),
        searchNext: document.getElementById('searchNext'),
        searchMeta: document.querySelector('.search-meta'),
        deleteModal: document.getElementById('deleteModal'),
        delTitle: document.getElementById('delTitle'),
        delBody: document.getElementById('delBody'),
        delY: document.getElementById('delY'),
        delN: document.getElementById('delN'),
        delO: document.getElementById('delO'),
        previewPane: document.getElementById('previewPane'),
        pvTitle: document.getElementById('pvTitle'),
        pvImg: document.getElementById('pvImg'),
        pvHtml: document.getElementById('pvHtml'),
        pvDesc: document.getElementById('pvDesc'),
        pvClose: document.getElementById('pvClose'),
    };
    let currentPreview = null;
    const searchState = { query: '', matches: [], index: -1 };

    // ---------- utility ----------
    const msg = (text, role = 'system') => {
        const node = document.createElement('div');
        node.className = `msg ${role}`;
        node.textContent = text;
        el.messages.appendChild(node);
        if (!searchState.query) {
            el.messages.scrollTop = el.messages.scrollHeight;
        }
        refreshSearchMatches();
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

    function clearSearchHighlights() {
        searchState.matches.forEach((node) => {
            node.classList.remove('search-match', 'search-match-current');
        });
    }

    function updateSearchStatus() {
        if (!el.searchStatus) return;
        const qa = getQA();
        const baseText = qa.ui?.searchTitle || '';
        const noMatchText = qa.ui?.searchNoMatch || '';
        const hasQuery = Boolean(searchState.query);
        if (el.searchMeta) {
            el.searchMeta.classList.toggle('hidden', !hasQuery);
        }
        if (el.searchbar) {
            el.searchbar.classList.toggle('solo', !hasQuery);
        }
        if (!searchState.query) {
            el.searchStatus.textContent = baseText;
        } else if (!searchState.matches.length) {
            el.searchStatus.textContent = noMatchText;
        } else {
            el.searchStatus.textContent = `${searchState.index + 1} / ${searchState.matches.length}`;
        }
        if (el.searchPrev) el.searchPrev.disabled = searchState.matches.length <= 1;
        if (el.searchNext) el.searchNext.disabled = searchState.matches.length <= 1;
    }

    function activateMatch(index, scroll = true) {
        if (!searchState.matches.length) {
            updateSearchStatus();
            return;
        }
        if (searchState.index >= 0 && searchState.matches[searchState.index]) {
            searchState.matches[searchState.index].classList.remove('search-match-current');
        }
        searchState.index = index;
        const node = searchState.matches[index];
        if (node) {
            node.classList.add('search-match-current');
            if (scroll) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updateSearchStatus();
    }

    function performSearch(query = '', keepIndex = false) {
        if (!el.chatSearch) return;
        const trimmed = (query || '').trim();
        const prevIndex = keepIndex ? searchState.index : -1;
        clearSearchHighlights();
        searchState.query = trimmed;
        searchState.matches = [];
        searchState.index = -1;
        if (!trimmed) {
            updateSearchStatus();
            return;
        }
        const lower = trimmed.toLowerCase();
        const nodes = Array.from(el.messages.querySelectorAll('.msg'));
        nodes.forEach((node) => {
            if (node.textContent.toLowerCase().includes(lower)) {
                node.classList.add('search-match');
                searchState.matches.push(node);
            }
        });
        if (!searchState.matches.length) {
            updateSearchStatus();
            return;
        }
        let target = 0;
        if (keepIndex && prevIndex >= 0) {
            target = Math.min(prevIndex, searchState.matches.length - 1);
        }
        activateMatch(target, !keepIndex);
    }

    function moveSearch(step) {
        if (!searchState.matches.length) return;
        let next = searchState.index + step;
        const total = searchState.matches.length;
        if (next < 0) next = total - 1;
        if (next >= total) next = 0;
        activateMatch(next);
    }

    function refreshSearchMatches() {
        if (!searchState.query) {
            clearSearchHighlights();
            updateSearchStatus();
            return;
        }
        performSearch(searchState.query, true);
    }

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
      </div>`;
            if (currentPreview && currentPreview.code === ev.code) {
                row.classList.add('active');
            }
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
        const pct = TOTAL ? Math.round((ctx.unlockedCount / TOTAL) * 100) : 0;
        el.barFill.style.width = pct + '%';
        const countLabel = `${ctx.unlockedCount} / ${TOTAL}`;
        if (el.progressPct) el.progressPct.textContent = countLabel;
        el.barText.textContent = countLabel;
    }

    function getHtmlSource(ev, lang) {
        if (!ev || !ev.htmlSrc) return null;
        if (typeof ev.htmlSrc === 'string') return ev.htmlSrc;
        return ev.htmlSrc[lang] || ev.htmlSrc.en || null;
    }

    async function loadHtml(ev, lang) {
        const src = getHtmlSource(ev, lang);
        if (!src) return '';
        const resolvedSrc = resolveAssetUrl(src);
        const key = `${ev.code}:${lang}:${resolvedSrc}`;
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
            const res = await fetch(resolvedSrc);
            if (!res.ok) throw new Error(`Failed to load ${resolvedSrc} (${res.status})`);
            const text = await res.text();
            htmlCache.set(key, text);
            ev.html = ev.html || {};
            ev.html[lang] = text;
            return text;
        } catch (err) {
            console.warn('[preview] unable to load report', resolvedSrc, err);
            htmlCache.set(key, '');
            return '';
        } finally {
            ev._loadingHtml[lang] = false;
            if (currentPreview === ev) renderPreview();
        }
    }

    function renderPreview() {
        const pane = el.previewPane;
        if (!pane) return;
        if (!currentPreview) {
            pane.hidden = true;
            pane.scrollTop = 0;
            if (el.chatwrap) el.chatwrap.classList.remove('has-preview');
            el.pvTitle.textContent = '';
            el.pvImg.removeAttribute('src');
            el.pvImg.removeAttribute('alt');
            el.pvImg.hidden = true;
            el.pvHtml.hidden = true;
            el.pvHtml.innerHTML = '';
            el.pvDesc.textContent = '';
            el.pvDesc.style.display = 'none';
            return;
        }
        pane.hidden = false;
        if (el.chatwrap) el.chatwrap.classList.add('has-preview');
        const title =
            currentPreview.title?.[LANG] ||
            currentPreview.title?.en ||
            currentPreview.code;
        const desc = currentPreview.desc?.[LANG] || currentPreview.desc?.en || '';
        const htmlByLang = currentPreview.html?.[LANG];
        const fallbackHtml = currentPreview.html?.en;
        const displayHtml = htmlByLang || fallbackHtml || '';
        const hasImg = Boolean(currentPreview.img);
        const hasHtmlSrc = Boolean(getHtmlSource(currentPreview, LANG));
        const hasHtml = Boolean(displayHtml);
        el.pvTitle.textContent = title;
        if (hasImg) {
            el.pvImg.src = resolveAssetUrl(currentPreview.img);
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
        renderFiles();
        renderPreview();
        if (el.previewPane) el.previewPane.scrollTop = 0;
        if (ev.htmlSrc && !(ev.html && (ev.html[LANG] || ev.html.en))) {
            await loadHtml(ev, LANG);
            if (currentPreview === ev) renderPreview();
        }
    }

    function hidePreview() {
        currentPreview = null;
        renderFiles();
        renderPreview();
    }

    const getQA = () => QA[LANG] || QA.en;

    const pickRandom = (list = []) => {
        if (!Array.isArray(list) || !list.length) return null;
        const index = Math.floor(Math.random() * list.length);
        return list[index];
    };

    function formatRecovered(names = []) {
        const qa = getQA();
        const tpl = qa.templates?.recovered;
        if (!tpl || !tpl.text) return names.join(', ');
        const separator = tpl.separator ?? ', ';
        const list = names.join(separator);
        return tpl.text.replace('{{list}}', list);
    }

    async function deliverReplies(replies = []) {
        for (const reply of replies || []) {
            if (!reply || !reply.text) continue;
            if (reply.speaker === 'jane') {
                await jane(reply.text);
            } else {
                msg(reply.text, 'system');
            }
        }
    }

    function setLang(next) {
        if (!QA[next]) next = 'en';
        LANG = next;
        const qa = getQA();
        if (el.filesHeader) el.filesHeader.textContent = qa.ui?.files || '';
        if (el.progressLabel) el.progressLabel.textContent = qa.ui?.progress || '';
        if (el.delTitle) el.delTitle.textContent = qa.ui?.deleteTitle || '';
        if (el.delBody) el.delBody.textContent = qa.ui?.deleteBody || '';
        if (el.chatSearch) el.chatSearch.placeholder = qa.ui?.searchPlaceholder || '';
        if (el.searchStatus) el.searchStatus.textContent = qa.ui?.searchTitle || '';
        if (el.input) el.input.placeholder = qa.ui?.composerPlaceholder || '';
        if (el.send && qa.ui?.sendLabel) el.send.textContent = qa.ui.sendLabel;
        if (el.resetBtn && qa.ui?.resetLabel) el.resetBtn.textContent = qa.ui.resetLabel;
        if (el.pvTitle && qa.ui?.previewTitle) el.pvTitle.textContent = qa.ui.previewTitle;
        if (el.pvClose && qa.ui?.closePreview) el.pvClose.textContent = qa.ui.closePreview;
        if (el.delY && qa.ui?.deleteButton) el.delY.textContent = qa.ui.deleteButton;
        if (el.delN && qa.ui?.keepButton) el.delN.textContent = qa.ui.keepButton;
        if (el.delO && qa.ui?.overrideButton) el.delO.textContent = qa.ui.overrideButton;
        renderFiles();
        renderProgress();
        renderPreview();
        updateSearchStatus();
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
        msg(formatRecovered(newlyUnlocked.map(ev => ev.code)), 'system');
        renderFiles();
        renderProgress();
        maybeTriggerDelete();
        return newlyUnlocked;
    }

    const showDelete = () => { el.deleteModal.style.display = 'flex'; };
    const hideDelete = () => { el.deleteModal.style.display = 'none'; };

    async function handleChoice(ch) {
        hideDelete();
        const qa = getQA();
        if (ch === 'Y') {
            const idx = EVIDENCE.findLastIndex(e => e.unlocked);
            if (idx >= 0) {
                EVIDENCE[idx].unlocked = false;
                ctx.unlockedCount = EVIDENCE.filter(x => x.unlocked).length;
                renderFiles();
                renderProgress();
                if (ctx.unlockedCount < 16) ctx.deletePrompted = false;
            }
            if (qa.actionReplies?.deleteConfirmed) {
                await jane(qa.actionReplies.deleteConfirmed);
            }
        } else if (ch === 'N') {
            if (qa.actionReplies?.deleteRefused) {
                await jane(qa.actionReplies.deleteRefused);
            }
        } else if (ch === 'O') {
            msg('[Override executed.]', 'system');
            const remaining = EVIDENCE.filter(e => !e.unlocked).map(e => e.code);
            if (qa.actionReplies?.deleteOverride) {
                await jane(qa.actionReplies.deleteOverride);
            }
            unlockByCodes(remaining);
        }
    }

    // ---------- script helpers ----------
    function maybeTriggerDelete() {
        const qa = getQA();
        if (ctx.deletePrompted) return;
        if (ctx.unlockedCount >= 16 && qa.deletePrompt) {
            ctx.deletePrompted = true;
            setTimeout(() => {
                jane(qa.deletePrompt).then(() => showDelete());
            }, 400);
        }
    }

    function findMatchingSequence(text) {
        const qa = getQA();
        return qa.sequences.find(seq =>
            Array.isArray(seq.triggers) && seq.triggers.some(({ regex }) => regex.test(text))
        ) || null;
    }

    function findMatchingAction(text) {
        const qa = getQA();
        for (const [key, info] of Object.entries(qa.actions || {})) {
            if (info.triggers?.some(({ regex }) => regex.test(text))) {
                return key;
            }
        }
        return null;
    }

    async function handleAction(action) {
        const qa = getQA();
        if (action === 'delete') {
            if (qa.actionReplies?.deleteInsist) {
                await jane(qa.actionReplies.deleteInsist);
            }
            showDelete();
            return;
        }
        if (action === 'report') {
            if (qa.actionReplies?.report) {
                msg(qa.actionReplies.report, 'system');
            }
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

        const qa = getQA();
        if (ctx.awaitingHearing && qa.hearing) {
            const hearing = qa.hearing;
            const negativeHit = hearing.negative?.some(({ regex }) => regex.test(t));
            if (negativeHit) {
                await deliverReplies(hearing.retry);
                return;
            }
            const positiveHit = hearing.positive?.some(({ regex }) => regex.test(t));
            if (positiveHit) {
                ctx.awaitingHearing = false;
                await deliverReplies(hearing.success);
                return;
            }
            await deliverReplies(hearing.retry);
            return;
        }
        const sequence = findMatchingSequence(t);
        if (sequence) {
            if (sequence.once !== false && ctx.triggered.has(sequence.id)) {
                const warn = pickRandom(qa.repeatWarnings);
                if (warn) await jane(warn);
                return;
            }
            await deliverReplies(sequence.replies);
            unlockByCodes(sequence.unlock);
            if (sequence.once !== false) ctx.triggered.add(sequence.id);
            return;
        }

        const action = findMatchingAction(t);
        if (action) {
            await handleAction(action);
            return;
        }

        const fallback = pickRandom(qa.fallback);
        if (fallback) {
            await jane(fallback);
        }
    }

    // ---------- boot ----------
    async function boot() {
        setLang(LANG);
        el.messages.innerHTML = '';
        ctx.triggered = new Set();
        ctx.deletePrompted = ctx.unlockedCount >= 16;
        ctx.awaitingHearing = Boolean(getQA().hearing);
        await deliverReplies(getQA().intro);
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

    if (el.chatSearch) {
        el.chatSearch.addEventListener('input', (e) => performSearch(e.target.value));
        el.chatSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                moveSearch(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSearch(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSearch(1);
            }
        });
    }
    if (el.searchNext) el.searchNext.addEventListener('click', () => moveSearch(1));
    if (el.searchPrev) el.searchPrev.addEventListener('click', () => moveSearch(-1));

    el.resetBtn.addEventListener('click', () => {
        EVIDENCE.forEach(e => e.unlocked = false);
        ctx.unlockedCount = 0;
        ctx.triggered = new Set();
        ctx.deletePrompted = false;
        ctx.awaitingHearing = false;
        hidePreview();
        searchState.query = '';
        clearSearchHighlights();
        searchState.matches = [];
        searchState.index = -1;
        if (el.chatSearch) el.chatSearch.value = '';
        updateSearchStatus();
        el.messages.innerHTML = '';
        boot().catch(console.error);
    });

    el.delY.addEventListener('click', () => handleChoice('Y').catch(console.error));
    el.delN.addEventListener('click', () => handleChoice('N').catch(console.error));
    el.delO.addEventListener('click', () => handleChoice('O').catch(console.error));
    el.deleteModal.addEventListener('click', (e) => { if (e.target === el.deleteModal) hideDelete(); });
    if (el.pvClose) el.pvClose.addEventListener('click', hidePreview);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentPreview) hidePreview();
            if (el.deleteModal.style.display === 'flex') hideDelete();
        }
    });

    updateSearchStatus();
    boot().catch(console.error);
})();
