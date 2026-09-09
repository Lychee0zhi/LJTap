/**
 * 灵境 · 新标签页 — 主逻辑
 */
const DEFAULT_ENGINES = [
  { id: 'bing',   name: 'Bing',   iconUrl: 'https://www.bing.com/favicon.ico',                          fallback: 'https://www.bing.com/favicon.ico',   url: 'https://www.bing.com/search?q=',    suggestUrl: 'https://api.bing.com/osjson.aspx?query=' },
  { id: 'google', name: 'Google', iconUrl: 'https://files.codelife.cc/itab/search/google.svg',           fallback: 'https://www.google.com/favicon.ico',  url: 'https://www.google.com/search?q=',  suggestUrl: 'https://suggestqueries.google.com/complete/search?client=firefox&q=' },
  { id: 'baidu',  name: '百度',   iconUrl: 'https://www.baidu.com/favicon.ico',                          fallback: 'https://www.baidu.com/favicon.ico',   url: 'https://www.baidu.com/s?wd=',       suggestUrl: 'https://suggestion.baidu.com/su?wd=' },
  { id: 'sogou',  name: '搜狗',   iconUrl: 'https://www.sogou.com/favicon.ico',                          fallback: 'https://www.sogou.com/favicon.ico',   url: 'https://www.sogou.com/web?query=',  suggestUrl: 'https://www.sogou.com/sugg/ajaj_json.jsp?key=' }
];
let ENGINES = [];

const THEMES = [
  { id: 'dawn', label: '晨曦', gradientBg: 'radial-gradient(circle at 10% 30%, #fef9e6, #e0eefc)',
    colors: { '--bg-start':'#fef9e6','--bg-end':'#e0eefc','--card-bg':'rgba(255,250,240,0.75)','--card-border':'rgba(255,245,215,0.7)','--text-primary':'#2c3e4e','--text-secondary':'#4a627a','--accent':'#e67e22','--accent-soft':'#f39c12','--divider-color':'rgba(0,0,0,0.12)','--input-color':'#1e293b','--suggest-color':'#1e293b','--history-color':'#6b7280' } },
  { id: 'nightfall', label: '夜澜', gradientBg: 'radial-gradient(circle at 30% 10%, #0f172f, #1e293b)',
    colors: { '--bg-start':'#0f172f','--bg-end':'#1e293b','--card-bg':'rgba(20,30,45,0.7)','--card-border':'rgba(100,116,139,0.5)','--text-primary':'#e2e8f0','--text-secondary':'#94a3b8','--accent':'#818cf8','--accent-soft':'#a5b4fc','--divider-color':'rgba(255,255,255,0.18)','--input-color':'#ffffff','--suggest-color':'#ffffff','--history-color':'#9ca3af' } },
  { id: 'cherry', label: '樱花雨', gradientBg: 'radial-gradient(circle at 80% 20%, #ffe4ec, #ffe0f0)',
    colors: { '--bg-start':'#ffe4ec','--bg-end':'#ffe0f0','--card-bg':'rgba(255,240,245,0.8)','--card-border':'rgba(255,200,210,0.7)','--text-primary':'#831843','--text-secondary':'#9d174d','--accent':'#db2777','--accent-soft':'#ec489a','--divider-color':'rgba(0,0,0,0.12)','--input-color':'#1e293b','--suggest-color':'#1e293b','--history-color':'#6b7280' } },
  { id: 'forest', label: '翠微', gradientBg: 'radial-gradient(circle at 20% 80%, #dcfce7, #bbf7d0)',
    colors: { '--bg-start':'#dcfce7','--bg-end':'#bbf7d0','--card-bg':'rgba(240,253,235,0.8)','--card-border':'rgba(134,239,172,0.6)','--text-primary':'#14532d','--text-secondary':'#166534','--accent':'#16a34a','--accent-soft':'#22c55e','--divider-color':'rgba(0,0,0,0.12)','--input-color':'#1e293b','--suggest-color':'#1e293b','--history-color':'#6b7280' } },
  { id: 'lavender', label: '紫梦', gradientBg: 'radial-gradient(circle at 60% 40%, #ede9fe, #e9d5ff)',
    colors: { '--bg-start':'#ede9fe','--bg-end':'#e9d5ff','--card-bg':'rgba(245,240,255,0.78)','--card-border':'rgba(196,181,253,0.6)','--text-primary':'#3b0764','--text-secondary':'#5b21b6','--accent':'#8b5cf6','--accent-soft':'#a78bfa','--divider-color':'rgba(0,0,0,0.12)','--input-color':'#1e293b','--suggest-color':'#1e293b','--history-color':'#6b7280' } },
  { id: 'sunset', label: '落霞', gradientBg: 'radial-gradient(circle at 70% 25%, #fff1e6, #fcd5bd)',
    colors: { '--bg-start':'#fff1e6','--bg-end':'#fcd5bd','--card-bg':'rgba(255,244,234,0.78)','--card-border':'rgba(255,214,178,0.72)','--text-primary':'#431407','--text-secondary':'#9a5b3e','--accent':'#ea580c','--accent-soft':'#fb923c','--divider-color':'rgba(0,0,0,0.12)','--input-color':'#431407','--suggest-color':'#431407','--history-color':'#9a5b3e' } },
  { id: 'aqua', label: '碧波', gradientBg: 'radial-gradient(circle at 25% 80%, #f0fdfa, #ccfbf1)',
    colors: { '--bg-start':'#f0fdfa','--bg-end':'#ccfbf1','--card-bg':'rgba(240,253,250,0.78)','--card-border':'rgba(153,246,228,0.65)','--text-primary':'#134e4a','--text-secondary':'#2c7a6f','--accent':'#0d9488','--accent-soft':'#2dd4bf','--divider-color':'rgba(0,0,0,0.1)','--input-color':'#134e4a','--suggest-color':'#134e4a','--history-color':'#3f8379' } },
  { id: 'starry', label: '星河', gradientBg: 'radial-gradient(circle at 65% 15%, #3730a3, #0a0f1e)',
    colors: { '--bg-start':'#1e2350','--bg-end':'#0a0f1e','--card-bg':'rgba(23,25,50,0.72)','--card-border':'rgba(139,149,255,0.3)','--text-primary':'#eef2ff','--text-secondary':'#a5b4fc','--accent':'#fbbf24','--accent-soft':'#fcd34d','--divider-color':'rgba(255,255,255,0.16)','--input-color':'#ffffff','--suggest-color':'#ffffff','--history-color':'#b6c2f5' } },
  { id: 'pine', label: '森夜', gradientBg: 'radial-gradient(circle at 30% 20%, #12483c, #071b13)',
    colors: { '--bg-start':'#12483c','--bg-end':'#071b13','--card-bg':'rgba(10,40,30,0.72)','--card-border':'rgba(52,211,153,0.25)','--text-primary':'#ecfdf5','--text-secondary':'#a4d7c2','--accent':'#34d399','--accent-soft':'#6ee7b7','--divider-color':'rgba(255,255,255,0.14)','--input-color':'#ffffff','--suggest-color':'#ffffff','--history-color':'#98c8b4' } },
  { id: 'duskgold', label: '暮金', gradientBg: 'radial-gradient(circle at 80% 25%, #55300f, #180e05)',
    colors: { '--bg-start':'#4a2b12','--bg-end':'#180e05','--card-bg':'rgba(36,23,12,0.72)','--card-border':'rgba(245,158,11,0.28)','--text-primary':'#fef3c7','--text-secondary':'#d9b98a','--accent':'#f59e0b','--accent-soft':'#fbbf24','--divider-color':'rgba(255,255,255,0.15)','--input-color':'#fff7ed','--suggest-color':'#fff7ed','--history-color':'#d0ae7d' } }
];

// ==================== 状态 ====================
let curEngine   = 0;
let curTheme    = 'dawn';
let dropdownOn = false;
let historyOn  = false;
let wallpaperRecord = null;
let wallpaperObjectUrl = null;
let wallpaperColorMode = null;
let wallpaperColorSeq = 0;
let wallpaperAnalysisPromise = null;
let wallpaperModeUpdatedAt = null;

// 搜索历史最多保留的条数
const HISTORY_LIMIT = 50;

// 自定义壁纸存储
const WALLPAPER_DB_NAME = 'ljtab-wallpaper';
const WALLPAPER_STORE   = 'wallpapers';
const WALLPAPER_KEY     = 'current';
const WALLPAPER_IMAGE_MAX_MB   = 20;
const WALLPAPER_DYNAMIC_MAX_MB = 100;
const WALLPAPER_MAX_EDGE       = 4096;
const CUSTOM_ENGINES_KEY = 'custom_search_engines';
const WALLPAPER_MODE_KEY = 'wallpaper_color_mode';
const WALLPAPER_OPFS_META_KEY = 'wallpaper_opfs_meta';
const WALLPAPER_OPFS_MIN_BYTES = 48 * 1024 * 1024;

// 壁纸生效时覆盖整套界面颜色：文字、强调色、面板均按壁纸明暗使用中性色板
const WALLPAPER_TEXT_PALETTES = {
  light: {
    '--text-primary':   'rgba(24, 32, 46, 0.95)',
    '--text-secondary': 'rgba(56, 70, 90, 0.92)',
    '--history-color':  'rgba(56, 70, 90, 0.88)',
    '--input-color':    'rgba(24, 32, 46, 0.95)',
    '--suggest-color':  'rgba(24, 32, 46, 0.95)',
    '--accent':         'rgba(41, 50, 63, 0.92)',
    '--accent-soft':    'rgba(90, 100, 115, 0.72)',
    '--on-accent':      '#ffffff',
    '--card-bg':        'rgba(255, 255, 255, 0.66)',
    '--card-border':    'rgba(255, 255, 255, 0.9)',
    '--divider-color':  'rgba(15, 23, 42, 0.13)',
    '--hover-bg':       'rgba(0, 0, 0, 0.06)',
    '--focus-bg':       'rgba(255, 255, 255, 0.92)',
    '--highlight-bg':   'rgba(15, 23, 42, 0.11)',
    '--menu-bg':        'rgba(255, 255, 255, 0.92)',
    '--menu-text':      '#263244',
    '--menu-text-soft': 'rgba(50, 63, 82, 0.85)',
    '--menu-border':    'rgba(15, 23, 42, 0.12)',
    '--menu-hover':     'rgba(0, 0, 0, 0.07)',
    '--menu-soft-bg':   'rgba(15, 23, 42, 0.05)',
    '--menu-input-bg':  'rgba(255, 255, 255, 0.8)',
    '--menu-input-border': 'rgba(15, 23, 42, 0.16)',
    '--menu-input-text': '#1c2735',
    '--danger-color':   '#b91c1c'
  },
  dark: {
    '--text-primary':   'rgba(248, 250, 255, 0.96)',
    '--text-secondary': 'rgba(205, 215, 230, 0.92)',
    '--history-color':  'rgba(205, 215, 230, 0.9)',
    '--input-color':    'rgba(248, 250, 255, 0.96)',
    '--suggest-color':  'rgba(248, 250, 255, 0.96)',
    '--accent':         'rgba(226, 232, 240, 0.96)',
    '--accent-soft':    'rgba(203, 213, 225, 0.8)',
    '--on-accent':      '#0b1220',
    '--card-bg':        'rgba(8, 12, 22, 0.68)',
    '--card-border':    'rgba(255, 255, 255, 0.14)',
    '--divider-color':  'rgba(255, 255, 255, 0.16)',
    '--hover-bg':       'rgba(255, 255, 255, 0.08)',
    '--focus-bg':       'rgba(10, 15, 28, 0.96)',
    '--highlight-bg':   'rgba(255, 255, 255, 0.12)',
    '--menu-bg':        'rgba(10, 15, 28, 0.94)',
    '--menu-text':      '#e2e8f0',
    '--menu-text-soft': 'rgba(226, 232, 240, 0.8)',
    '--menu-border':    'rgba(255, 255, 255, 0.16)',
    '--menu-hover':     'rgba(255, 255, 255, 0.12)',
    '--menu-soft-bg':   'rgba(255, 255, 255, 0.07)',
    '--menu-input-bg':  'rgba(255, 255, 255, 0.08)',
    '--menu-input-border': 'rgba(255, 255, 255, 0.24)',
    '--menu-input-text': '#ffffff',
    '--danger-color':   '#fda4af'
  }
};
const ADAPTIVE_TEXT_KEYS = Object.keys(WALLPAPER_TEXT_PALETTES.light);

// ==================== DOM 引用 ====================
const engineBtn    = document.getElementById('engineBtn');
const engineIconEl = document.getElementById('engineIcon');
const engineDrop   = document.getElementById('engineDropdown');
const searchInput  = document.getElementById('searchInput');
const searchSubmit = document.getElementById('searchSubmit');
const settingsBtn  = document.getElementById('settingsBtn');
const themePanel   = document.getElementById('themePanel');
const colorGrid    = document.getElementById('colorGrid');
const browserEl    = document.getElementById('browserName');
const clockEl      = document.getElementById('clockDisplay');
const greetEl      = document.getElementById('greetingMsg');
const historyBtn   = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList  = document.getElementById('historyList');
const historyClear = document.getElementById('historyClear');
const suggestArea  = document.getElementById('suggestArea');
const wallpaperStage      = document.getElementById('wallpaperStage');
const staticWallpaperImg  = document.getElementById('staticWallpaperImg');
const dynamicWallpaperVideo = document.getElementById('dynamicWallpaperVideo');
const dynamicWallpaperGif = document.getElementById('dynamicWallpaperGif');
const staticWallpaperInput  = document.getElementById('staticWallpaperInput');
const dynamicWallpaperInput = document.getElementById('dynamicWallpaperInput');
const wallpaperMeta   = document.getElementById('wallpaperMeta');
const wallpaperClear  = document.getElementById('wallpaperClear');

// ==================== 辅助函数 ====================
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(str) {
  return String(str).replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]);
}

function iconHTML(url, alt, fb) {
  const fallback = fb || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23999%27 stroke-width=%272%27%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%2710%27/%3E%3Cpath d=%27M12 8v4M12 16h.01%27/%3E%3C/svg%3E';
  return `<img src="${esc(url)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-fallback="${esc(fallback)}">`;
}

// MV3 扩展 CSP 会屏蔽内联 onerror，因此用容器级事件委托实现图标加载失败兜底
function handleIconError(e) {
  const img = e.target;
  if (img && img.tagName === 'IMG' && img.dataset.fallback && !img.dataset.fallbackTried) {
    img.dataset.fallbackTried = '1';
    img.src = img.dataset.fallback;
  }
}
engineIcon.addEventListener('error', handleIconError, true);
engineDrop.addEventListener('error', handleIconError, true);

function loadCustomEngines() {
  try {
    const arr = JSON.parse(localStorage.getItem(CUSTOM_ENGINES_KEY));
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function saveCustomEngines(list) {
  localStorage.setItem(CUSTOM_ENGINES_KEY, JSON.stringify(list));
}

function normalizeCustomEngine(e) {
  const known = e && e.url ? findKnownEngineByUrl(e.url) : null;
  let url = (e && e.url) || '';
  if (known && !/\{q\}|%s/.test(url)) url = known.template;
  const suggestUrl = (e && e.suggestUrl) || (known && known.suggestTemplate) || '';
  const logo = engineLogoParts(url);
  return {
    ...e,
    custom: true,
    url,
    suggestUrl,
    iconUrl: (e && e.iconUrl) || logo.iconUrl,
    fallback: (e && e.fallback) || logo.fallback
  };
}

function syncEngines() {
  ENGINES = DEFAULT_ENGINES.concat(loadCustomEngines().map(normalizeCustomEngine));
}

// 根据搜索地址自动取该网站的官方图标 / favicon 作为 logo
function engineLogoParts(searchUrl) {
  try {
    const u = new URL(searchUrl);
    return {
      iconUrl: `${u.origin}/favicon.ico`,
      fallback: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=64`
    };
  } catch (e) {
    return { iconUrl: '', fallback: '' };
  }
}

function buildSearchUrl(template, query) {
  const q = encodeURIComponent(query);
  if (/\{q\}/.test(template)) return template.replace(/\{q\}/g, q);
  if (/%s/.test(template)) return template.replace(/%s/g, q);
  return template + q;
}

// 常见搜索网站：输入根域名即可自动补全为完整搜索模板
const KNOWN_SEARCH_TEMPLATES = {
  'bing.com': { name: 'Bing', template: 'https://www.bing.com/search?q={q}', suggestTemplate: 'https://api.bing.com/osjson.aspx?query={q}' },
  'yandex.com': { name: 'Yandex', template: 'https://yandex.com/search/?text={q}', suggestTemplate: 'https://suggest.yandex.com/suggest-ff.cgi?part={q}&uil=en' },
  'yandex.ru':  { name: 'Yandex', template: 'https://yandex.ru/search/?text={q}', suggestTemplate: 'https://suggest.yandex.ru/suggest-ff.cgi?part={q}&uil=ru' },
  'duckduckgo.com': { name: 'DuckDuckGo', template: 'https://duckduckgo.com/?q={q}', suggestTemplate: 'https://ac.duckduckgo.com/ac/?q={q}&type=list' },
  'ecosia.org': { name: 'Ecosia', template: 'https://www.ecosia.org/search?q={q}' },
  'github.com': { name: 'GitHub', template: 'https://github.com/search?q={q}' },
  'youtube.com': { name: 'YouTube', template: 'https://www.youtube.com/results?search_query={q}' },
  'zhihu.com': { name: '知乎', template: 'https://www.zhihu.com/search?type=content&q={q}' },
  'bilibili.com': { name: '哔哩哔哩', template: 'https://search.bilibili.com/all?keyword={q}' }
};

function findKnownEngineByUrl(input) {
  try {
    const u = new URL((input || '').trim());
    const host = u.hostname.toLowerCase();
    return KNOWN_SEARCH_TEMPLATES[host] ||
           KNOWN_SEARCH_TEMPLATES[host.replace(/^www\./, '')] ||
           null;
  } catch (e) { return null; }
}

function autoCompleteSearchTemplate(input) {
  const raw = (input || '').trim();
  if (!raw || /\{q\}|%s/.test(raw)) return null;
  let u;
  try {
    u = new URL(raw);
  } catch (e) { return null; }

  const known = findKnownEngineByUrl(raw);
  if (known) return known;

  // 通用兜底：形如 /search、/results 的页面按最常见的 q= 参数补全
  if (/\/search\/?$/.test(u.pathname) || /\/results\/?$/.test(u.pathname)) {
    const paramKey = 'q';
    if (/[?&]q=$/.test(u.search)) {
      return { name: u.hostname, template: raw.replace(/q=$/, 'q={q}') };
    }
    if (/[?&]q=/.test(u.search)) return null;
    const sep = u.search ? (u.search.endsWith('&') ? '' : '&') : '?';
    return { name: u.hostname, template: raw + sep + paramKey + '={q}' };
  }
  return null;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('search_history')) || []; }
  catch (e) { return []; }
}

function doSearch(query) {
  let list = getHistory().filter(q => q !== query);
  list.unshift(query);
  if (list.length > HISTORY_LIMIT) list = list.slice(0, HISTORY_LIMIT);
  localStorage.setItem('search_history', JSON.stringify(list));
  window.location.href = buildSearchUrl(ENGINES[curEngine].url, query);
}

// ==================== 时钟与问候 ====================
let clockTimer = null;

function scheduleNextClockTick() {
  const now = new Date();
  const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 40;
  clearTimeout(clockTimer);
  clockTimer = setTimeout(tick, Math.max(250, delay));
}

function tick() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const timeText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  if (clockEl.textContent !== timeText) clockEl.textContent = timeText;
  const greetText = h >= 5 && h < 12
    ? '☀️ 早安，今天也要闪闪发光'
    : h >= 12 && h < 18
      ? '🌤️ 午后小憩，灵感涌现'
      : h >= 18 && h < 22
        ? '🌙 暮色温柔，晚风浪漫'
        : '✨ 星辰指引，好梦将至';
  if (greetEl.textContent !== greetText) greetEl.textContent = greetText;
  scheduleNextClockTick();
}
tick();

// ==================== 浏览器识别 ====================
(function () {
  const ua = navigator.userAgent;
  let name = '极速浏览器';
  if (ua.includes('Edg'))     name = 'Microsoft Edge';
  else if (ua.includes('Chrome'))  name = 'Google Chrome';
  else if (ua.includes('Firefox')) name = 'Mozilla Firefox';
  else if (ua.includes('Safari'))  name = 'Safari';
  browserEl.textContent = ` ${name} `;
})();

// ==================== 面板控制 ====================
function closeDropdown() {
  engineDrop.classList.remove('show');
  engineDrop.classList.remove('form-mode');
  engineDrop.innerHTML = '';
  dropdownOn = false;
  engineBtn.setAttribute('aria-expanded', 'false');
}

function toggleDropdown() {
  if (dropdownOn) { closeDropdown(); return; }
  renderEngineDropdown();
  engineDrop.classList.add('show');
  dropdownOn = true;
  engineBtn.setAttribute('aria-expanded', 'true');
  if (historyOn) closeHistory();
}

function closeHistory() {
  historyPanel.classList.remove('show');
  historyList.innerHTML = '';
  suggestArea.innerHTML = '';
  historyOn = false;
  historyBtn.classList.remove('active');
}

function openHistory(filter) {
  if (historyOn) return;
  renderHistory(filter);
  historyPanel.classList.add('show');
  historyOn = true;
  historyBtn.classList.add('active');
  if (dropdownOn) closeDropdown();
}

function toggleHistory() {
  if (historyOn) { closeHistory(); return; }
  openHistory();
}

// ==================== 引擎 ====================
function renderEngineDropdown() {
  engineDrop.classList.remove('form-mode');
  engineDrop.innerHTML = '';
  ENGINES.forEach((eng, i) => {
    const el = document.createElement('div');
    el.className = `engine-option${i === curEngine ? ' active' : ''}`;
    const delHtml = eng.custom
      ? `<button class="engine-del" title="删除引擎" aria-label="删除 ${esc(eng.name)}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`
      : '';
    el.innerHTML = `<span class="engine-logo-img">${iconHTML(eng.iconUrl, eng.name, eng.fallback)}</span><span class="engine-name">${esc(eng.name)}</span>${delHtml}`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setEngine(i);
      closeDropdown();
    });
    const delBtn = el.querySelector('.engine-del');
    if (delBtn) {
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        deleteCustomEngine(eng);
      });
    }
    engineDrop.appendChild(el);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'engine-add-btn';
  addBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>添加搜索引擎`;
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEngineForm();
  });
  engineDrop.appendChild(addBtn);
}

function setEngine(i) {
  const idx = Math.min(Math.max(i, 0), ENGINES.length - 1);
  curEngine = idx;
  suggestArea.innerHTML = '';
  engineIconEl.innerHTML = iconHTML(ENGINES[idx].iconUrl, ENGINES[idx].name, ENGINES[idx].fallback);
  preconnectEngine(ENGINES[idx].url);
  localStorage.setItem('search_engine_id', ENGINES[idx].id);
  localStorage.setItem('search_engine_idx', idx);
  document.querySelectorAll('.engine-option').forEach((el, j) => el.classList.toggle('active', j === idx));
}

// 预热当前搜索引擎连接，缩短搜索跳转时 DNS/TLS 握手耗时
function preconnectEngine(searchUrl) {
  try {
    const origin = new URL(searchUrl).origin;
    let link = document.head.querySelector('link[data-engine-preconnect]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'preconnect';
      link.dataset.enginePreconnect = '';
      document.head.appendChild(link);
    }
    link.href = origin;
  } catch (e) { /* 忽略无效地址 */ }
}

function deleteCustomEngine(eng) {
  const list = loadCustomEngines().filter(e => e.id !== eng.id);
  saveCustomEngines(list);
  syncEngines();
  const activeId = localStorage.getItem('search_engine_id');
  const idx = ENGINES.findIndex(e => e.id === activeId);
  setEngine(idx >= 0 ? idx : 0);
  renderEngineDropdown();
}

function renderEngineLogoPreview(inputEl, previewEl, nameInputEl) {
  const url = (inputEl.value || '').trim();
  const name = (nameInputEl && nameInputEl.value.trim()) || '网站';
  const parts = engineLogoParts(url);
  if (!parts.iconUrl) {
    previewEl.innerHTML = '<span class="engine-preview-hint">输入搜索地址后自动获取该网站官方图标</span>';
    return;
  }
  previewEl.innerHTML = `<span>Logo</span><span class="engine-preview-icon">${iconHTML(parts.iconUrl, name, parts.fallback)}</span>`;
}

function openEngineForm() {
  engineDrop.classList.add('form-mode');
  engineDrop.innerHTML = `
    <div class="engine-form-title">添加搜索引擎</div>
    <div class="engine-form-body">
      <label class="engine-form-label">名称</label>
      <input class="engine-form-input" id="engineNameInput" placeholder="如：Bing" maxlength="24">
      <label class="engine-form-label">搜索地址（可只填网站主页，已识别网站自动补全）</label>
      <input class="engine-form-input" id="engineSearchInput" placeholder="https://www.bing.com/">
      <div class="engine-logo-preview" id="engineLogoPreview"><span class="engine-preview-hint">输入搜索地址后自动获取该网站官方图标</span></div>
      <div class="engine-form-note" id="engineFormNote"></div>
      <div class="engine-form-error" id="engineFormError"></div>
      <div class="engine-form-actions">
        <button class="engine-form-btn primary" id="engineSaveBtn">保存并启用</button>
        <button class="engine-form-btn" id="engineCancelBtn">取消</button>
      </div>
    </div>`;

  const nameInput = engineDrop.querySelector('#engineNameInput');
  const searchInputEl = engineDrop.querySelector('#engineSearchInput');
  const previewEl = engineDrop.querySelector('#engineLogoPreview');
  const noteEl = engineDrop.querySelector('#engineFormNote');
  const errorEl = engineDrop.querySelector('#engineFormError');
  const saveBtn = engineDrop.querySelector('#engineSaveBtn');

  const updateAutoNote = () => {
    const raw = searchInputEl.value.trim();
    if (!raw || /\{q\}|%s/.test(raw)) { noteEl.textContent = ''; return; }
    const auto = autoCompleteSearchTemplate(raw);
    noteEl.textContent = auto
      ? `已识别为 ${auto.name}，保存时将自动补全为：${auto.template}`
      : '';
  };

  searchInputEl.addEventListener('input', () => {
    renderEngineLogoPreview(searchInputEl, previewEl, nameInput);
    updateAutoNote();
  });
  nameInput.addEventListener('input', () => renderEngineLogoPreview(searchInputEl, previewEl, nameInput));

  const handleSave = () => {
    const name = nameInput.value.trim();
    let searchUrl = searchInputEl.value.trim();

    if (!name) { errorEl.textContent = '请先填写搜索引擎名称'; return; }
    if (!searchUrl) { errorEl.textContent = '请填写搜索地址'; return; }
    if (DEFAULT_ENGINES.some(e => e.name.toLowerCase() === name.toLowerCase()) || loadCustomEngines().some(e => e.name.toLowerCase() === name.toLowerCase())) {
      errorEl.textContent = '已有同名搜索引擎';
      return;
    }
    try {
      const u = new URL(searchUrl);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol');
    } catch (e) {
      errorEl.textContent = '搜索地址不是有效的 http(s) 链接';
      return;
    }
    let suggestUrl = '';
    if (!/\{q\}/.test(searchUrl) && !/%s/.test(searchUrl)) {
      const auto = autoCompleteSearchTemplate(searchUrl);
      if (!auto) {
        errorEl.textContent = '未能识别该网站搜索模板，请手动用 {q} 标记关键词位置';
        return;
      }
      searchUrl = auto.template;
      suggestUrl = auto.suggestTemplate || '';
      searchInputEl.value = searchUrl;
      renderEngineLogoPreview(searchInputEl, previewEl, nameInput);
      updateAutoNote();
    } else {
      const known = findKnownEngineByUrl(searchUrl);
      suggestUrl = (known && known.suggestTemplate) || '';
    }
    errorEl.textContent = '';

    const logo = engineLogoParts(searchUrl);
    const engine = {
      id: 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
      name,
      iconUrl: logo.iconUrl,
      fallback: logo.fallback,
      url: searchUrl,
      suggestUrl,
      created: Date.now()
    };
    const list = loadCustomEngines();
    list.push(engine);
    saveCustomEngines(list);
    syncEngines();
    const idx = ENGINES.findIndex(e => e.id === engine.id);
    setEngine(idx >= 0 ? idx : 0);
    closeDropdown();
    renderEngineDropdown();
  };

  saveBtn.addEventListener('click', (e) => { e.stopPropagation(); handleSave(); });
  engineDrop.querySelector('#engineCancelBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    renderEngineDropdown();
  });
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } });
  searchInputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(); } });
}

// ==================== 搜索建议 ====================
let suggestTimer = null;
let suggestSeq = 0;
const SUGGEST_CACHE_LIMIT = 20;
const DIRECT_FETCH_TIMEOUT_MS = 6000;
const suggestCache = new Map();

async function directFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DIRECT_FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': navigator.userAgent, 'Accept': '*/*' },
      signal: controller.signal
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSuggests(query) {
  clearTimeout(suggestTimer);
  if (!query) {
    suggestSeq += 1;
    suggestArea.innerHTML = '';
    return;
  }
  suggestSeq += 1;
  const seq = suggestSeq;
  suggestTimer = setTimeout(async () => {
    const eng = ENGINES[curEngine];
    if (!eng.suggestUrl) return;
    if (!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage)) {
      suggestArea.innerHTML = '';
      return;
    }
    const cacheKey = `${eng.id}\u0000${query}`;
    if (suggestCache.has(cacheKey)) {
      if (seq === suggestSeq) renderSuggestions(suggestCache.get(cacheKey));
      return;
    }
    const url = buildSearchUrl(eng.suggestUrl, query);

    // 优先通过 Service Worker 代理（可绕过 CORS）
    try {
      const res = await Promise.race([
        new Promise(resolve => {
          chrome.runtime.sendMessage({ type: 'fetchSuggest', url }, response => resolve(response));
        }),
        new Promise(resolve => setTimeout(() => resolve(null), 2500))
      ]);
      if (seq !== suggestSeq) return;
      if (res && res.ok) {
        const sugs = parseSuggest(res.text, eng.name);
        suggestCache.set(cacheKey, sugs);
        if (suggestCache.size > SUGGEST_CACHE_LIMIT) suggestCache.delete(suggestCache.keys().next().value);
        renderSuggestions(sugs);
        return;
      }
    } catch (e) {
      // Service Worker 不可用时继续走页面直连兜底
    }

    // 兜底：直接请求（部分引擎可能允许跨域）
    try {
      const text = await directFetch(url);
      if (seq !== suggestSeq) return;
      const sugs = parseSuggest(text, eng.name);
      suggestCache.set(cacheKey, sugs);
      if (suggestCache.size > SUGGEST_CACHE_LIMIT) suggestCache.delete(suggestCache.keys().next().value);
      renderSuggestions(sugs);
    } catch (e) {
      if (seq !== suggestSeq) return;
      suggestArea.innerHTML = '';
    }
  }, 150);
}

function parseSuggest(text, name) {
  try {
    if (name === 'Google') {
      const d = JSON.parse(text);
      if (Array.isArray(d) && d.length > 1 && Array.isArray(d[1])) return d[1];
    }
  } catch (e) { /* 忽略解析失败 */ }

  // 通用 JSON：Yandex / Google / DuckDuckGo(list) / 自定义引擎
  try {
    const d = JSON.parse(text);
    if (!Array.isArray(d)) return [];
    if (d.length > 1 && Array.isArray(d[1])) return d[1].filter(v => typeof v === 'string').slice(0, 10);
    if (d.length > 0 && Array.isArray(d[0])) return d.map(x => Array.isArray(x) ? x[0] : x).filter(Boolean).map(String).slice(0, 10);
    if (d.every(x => x && typeof x === 'object' && typeof x.phrase === 'string')) {
      return d.map(x => x.phrase).slice(0, 10);
    }
    return d.filter(v => typeof v === 'string' || typeof v === 'number').map(String).slice(0, 10);
  } catch (e) { /* 非纯 JSON，继续处理 JSONP */ }

  // 百度 JSONP：window.baidu.sug({q:'...', s:['...']})
  try {
    const m = text.match(/"s"\s*:\s*(\[[^\]]*\])/);
    if (m) return JSON.parse(m[1]);
  } catch (e) { /* 解析失败 */ }

  // 搜狗 JSONP：sogouSuggest([...])
  try {
    const idx = text.indexOf('([');
    if (idx !== -1) {
      let depth = 0, start = -1, end = -1;
      for (let i = idx + 1; i < text.length; i++) {
        if      (text[i] === '[') { if (depth === 0) start = i; depth++; }
        else if (text[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
      }
      if (start >= 0 && end >= 0) {
        const arr = JSON.parse(text.substring(start, end + 1));
        if (Array.isArray(arr)) return arr.map(x => Array.isArray(x) ? x[0] : x).filter(Boolean);
      }
    }
  } catch (e) { /* 解析失败 */ }
  return [];
}

function renderSuggestions(sugs) {
  suggestArea.innerHTML = '';
  if (!sugs || sugs.length === 0) return;
  const frag = document.createDocumentFragment();
  const header = document.createElement('div');
  header.className = 'suggest-header';
  header.textContent = '搜索建议';
  frag.appendChild(header);
  const histSet = new Set(getHistory().map(q => q.toLowerCase()));
  sugs.filter(s => !histSet.has(s.toLowerCase())).slice(0, 6).forEach(s => {
    const el = document.createElement('div');
    el.className = 'history-item suggest-item';
    el.innerHTML = `<span class="history-item-text">${esc(s)}</span>`;
    frag.appendChild(el);
  });
  suggestArea.appendChild(frag);
}

// ==================== 搜索历史 ====================
function renderHistory(filter) {
  let list = getHistory();
  const kw = (filter || '').trim().toLowerCase();
  if (kw) {
    const matched = [];
    const others = [];
    for (const q of list) {
      (q.toLowerCase().includes(kw) ? matched : others).push(q);
    }
    list = matched.concat(others);
  }
  historyList.innerHTML = '';
  if (list.length === 0) { historyList.innerHTML = '<div class="history-empty">暂无搜索记录</div>'; return; }
  const frag = document.createDocumentFragment();
  list.forEach(q => {
    const el = document.createElement('div');
    el.className = `history-item${kw && q.toLowerCase().includes(kw) ? ' history-match' : ''}`;
    el.innerHTML = `<span class="history-item-text">${esc(q)}</span><button class="history-item-del" title="删除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    frag.appendChild(el);
  });
  historyList.appendChild(frag);
}

function deleteHistoryItem(query) {
  const list = getHistory().filter(q => q !== query);
  localStorage.setItem('search_history', JSON.stringify(list));
  renderHistory(searchInput.value.trim() || undefined);
}

function clearHistory() {
  localStorage.removeItem('search_history');
  renderHistory();
  closeHistory();
}

// ==================== 自定义壁纸 ====================
let wallpaperDBPromise = null;

function openWallpaperDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(WALLPAPER_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(WALLPAPER_STORE)) db.createObjectStore(WALLPAPER_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('wallpaper db blocked'));
    } catch (e) { reject(e); }
  });
}

function getWallpaperDB() {
  if (!wallpaperDBPromise) {
    wallpaperDBPromise = openWallpaperDB().catch(err => {
      wallpaperDBPromise = null;
      throw err;
    });
  }
  return wallpaperDBPromise;
}

async function wallpaperGet() {
  const db = await getWallpaperDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(WALLPAPER_STORE, 'readonly');
      const req = tx.objectStore(WALLPAPER_STORE).get(WALLPAPER_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
}

async function wallpaperSet(value) {
  const db = await getWallpaperDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(WALLPAPER_STORE, 'readwrite');
      tx.objectStore(WALLPAPER_STORE).delete(WALLPAPER_KEY);
      tx.objectStore(WALLPAPER_STORE).put(value, WALLPAPER_KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('save aborted'));
    } catch (e) { reject(e); }
  });
}

async function wallpaperRemove() {
  const db = await getWallpaperDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(WALLPAPER_STORE, 'readwrite');
      tx.objectStore(WALLPAPER_STORE).delete(WALLPAPER_KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('delete aborted'));
    } catch (e) { reject(e); }
  });
}

function readOpfsWallpaperMeta() {
  try {
    const meta = JSON.parse(localStorage.getItem(WALLPAPER_OPFS_META_KEY));
    return meta && meta.fileName ? meta : null;
  } catch (e) { return null; }
}

async function getOpfsRoot() {
  try {
    if (!navigator.storage || typeof navigator.storage.getDirectory !== 'function') return null;
    return await navigator.storage.getDirectory();
  } catch (e) { return null; }
}

async function writeOpfsWallpaper(meta, blob) {
  const root = await getOpfsRoot();
  if (!root) throw new Error('opfs unavailable');
  const ext = String(meta.name || 'wallpaper.bin').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const fileName = `wallpaper-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  let handle;
  try {
    handle = await root.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    try {
      await writable.write(blob);
    } finally {
      await writable.close();
    }
  } catch (e) {
    if (handle) { try { await root.removeEntry(fileName); } catch (e2) {} }
    throw e;
  }

  const previous = readOpfsWallpaperMeta();
  if (previous && previous.fileName !== fileName) {
    try { await root.removeEntry(previous.fileName); } catch (e) {}
  }
  localStorage.setItem(WALLPAPER_OPFS_META_KEY, JSON.stringify({ ...meta, fileName }));
}

async function removeOpfsWallpaper() {
  const meta = readOpfsWallpaperMeta();
  localStorage.removeItem(WALLPAPER_OPFS_META_KEY);
  if (!meta) return;
  const root = await getOpfsRoot();
  if (!root) return;
  try { await root.removeEntry(meta.fileName); } catch (e) {}
}

async function readOpfsWallpaper(meta) {
  const root = await getOpfsRoot();
  if (!root) return null;
  try {
    const handle = await root.getFileHandle(meta.fileName);
    return await handle.getFile();
  } catch (e) { return null; }
}

function validateWallpaper(file, dynamic) {
  if (dynamic && file.size > WALLPAPER_DYNAMIC_MAX_MB * 1024 * 1024) {
    return `动态壁纸文件不能超过 ${WALLPAPER_DYNAMIC_MAX_MB} MB`;
  }
  if (!dynamic && file.size > WALLPAPER_IMAGE_MAX_MB * 1024 * 1024) {
    return `图片不能超过 ${WALLPAPER_IMAGE_MAX_MB} MB`;
  }
  const name = (file.name || '').toLowerCase();
  if (dynamic) {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogv|mov|m4v)$/.test(name);
    const isGif = file.type === 'image/gif' || /\.gif$/.test(name);
    return isVideo || isGif ? '' : '请选择 MP4 / WebM 视频或 GIF 动图';
  }
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|avif|bmp)$/.test(name);
  return isImage ? '' : '请选择常见图片格式（PNG / JPG / WebP）';
}

function formatWallpaperSize(bytes) {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

async function optimizeStaticWallpaper(file) {
  try {
    if (typeof createImageBitmap !== 'function') return file;
    const bitmap = await createImageBitmap(file);
    try {
      const maxEdge = Math.max(bitmap.width, bitmap.height);
      if (maxEdge <= WALLPAPER_MAX_EDGE) return file;
      const scale = WALLPAPER_MAX_EDGE / maxEdge;
      const canvas = document.createElement('canvas');
      canvas.width  = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.88));
      return blob || file;
    } finally {
      bitmap.close();
    }
  } catch (e) {
    return file;
  }
}

function guessWallpaperMime(name) {
  const n = (name || '').toLowerCase();
  if (/\.gif$/.test(n))  return 'image/gif';
  if (/\.png$/.test(n))  return 'image/png';
  if (/\.jpe?g$/.test(n)) return 'image/jpeg';
  if (/\.webp$/.test(n)) return 'image/webp';
  if (/\.avif$/.test(n)) return 'image/avif';
  if (/\.bmp$/.test(n))  return 'image/bmp';
  if (/\.mp4$|\.m4v$|\.mov$/.test(n)) return 'video/mp4';
  if (/\.webm$/.test(n)) return 'video/webm';
  if (/\.ogv$/.test(n))  return 'video/ogg';
  return '';
}

function applyAdaptivePalette(mode) {
  if (mode) {
    const palette = WALLPAPER_TEXT_PALETTES[mode];
    if (palette) {
      Object.entries(palette).forEach(([key, value]) => document.body.style.setProperty(key, value));
    }
  } else if (wallpaperColorMode) {
    ADAPTIVE_TEXT_KEYS.forEach(key => document.body.style.removeProperty(key));
  }
  wallpaperColorMode = mode || null;
  if (mode) document.body.dataset.wallpaperMode = mode;
  else document.body.removeAttribute('data-wallpaper-mode');
}

function readWallpaperModeCache(updatedAt) {
  try {
    const cached = JSON.parse(localStorage.getItem(WALLPAPER_MODE_KEY));
    if (!cached || (cached.mode !== 'light' && cached.mode !== 'dark')) return null;
    if (updatedAt !== undefined && cached.ts !== updatedAt) return null;
    return cached.mode;
  } catch (e) {
    return null;
  }
}

function rememberWallpaperMode(updatedAt, mode) {
  if (!mode || updatedAt === undefined || updatedAt === null) {
    localStorage.removeItem(WALLPAPER_MODE_KEY);
    return;
  }
  localStorage.setItem(WALLPAPER_MODE_KEY, JSON.stringify({ mode, ts: updatedAt }));
}

function luminanceModeForCanvas(canvas, ctx) {
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;
  let total = 0;
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha < 12) continue;
    total += (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
    count += 1;
  }
  if (!count) return null;
  return total / count > 0.55 ? 'light' : 'dark';
}

function analyzeWallpaperElement(element) {
  return new Promise(resolve => {
    let settled = false;
    let timer = null;
    const finish = mode => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(mode);
    };
    const measure = () => {
      try {
        const width = element.tagName === 'VIDEO' ? element.videoWidth : element.naturalWidth;
        const height = element.tagName === 'VIDEO' ? element.videoHeight : element.naturalHeight;
        if (!width || !height) { finish(null); return; }
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 64 / width);
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { finish(null); return; }
        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
        finish(luminanceModeForCanvas(canvas, ctx));
      } catch (e) {
        finish(null);
      }
    };

    if (element.tagName === 'IMG') {
      if (element.complete && element.naturalWidth) measure();
      else {
        element.addEventListener('load', measure, { once: true });
        element.addEventListener('error', () => finish(null), { once: true });
      }
    } else if (element.tagName === 'VIDEO') {
      if (element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) measure();
      else {
        element.addEventListener('loadeddata', () => setTimeout(measure, 900), { once: true });
        element.addEventListener('error', () => finish(null), { once: true });
      }
    } else {
      finish(null);
      return;
    }
    timer = setTimeout(() => finish(null), 4000);
  });
}

function releaseWallpaperMedia() {
  if (wallpaperObjectUrl) {
    URL.revokeObjectURL(wallpaperObjectUrl);
    wallpaperObjectUrl = null;
  }
  staticWallpaperImg.removeAttribute('src');
  staticWallpaperImg.classList.remove('active');
  dynamicWallpaperGif.removeAttribute('src');
  dynamicWallpaperGif.classList.remove('active');
  dynamicWallpaperVideo.pause();
  dynamicWallpaperVideo.removeAttribute('src');
  dynamicWallpaperVideo.load();
  dynamicWallpaperVideo.classList.remove('active');
}

function currentWallpaperMedia() {
  if (dynamicWallpaperVideo.classList.contains('active')) return dynamicWallpaperVideo;
  if (dynamicWallpaperGif.classList.contains('active')) return dynamicWallpaperGif;
  if (staticWallpaperImg.classList.contains('active')) return staticWallpaperImg;
  return null;
}

// 根据标签页可见性统一起停壁纸：隐藏时不播放/不解码，可见时再恢复
function syncWallpaperPlayback() {
  if (!wallpaperObjectUrl) return;
  if (document.hidden) {
    dynamicWallpaperVideo.pause();
    // GIF 没有暂停接口，移除 src 可让浏览器停止解码动画帧
    if (dynamicWallpaperGif.classList.contains('active')) {
      dynamicWallpaperGif.removeAttribute('src');
    }
    return;
  }
  if (dynamicWallpaperVideo.classList.contains('active')) {
    if (!dynamicWallpaperVideo.getAttribute('src')) dynamicWallpaperVideo.src = wallpaperObjectUrl;
    dynamicWallpaperVideo.play().catch(() => {});
  } else if (dynamicWallpaperGif.classList.contains('active')) {
    if (!dynamicWallpaperGif.getAttribute('src')) dynamicWallpaperGif.src = wallpaperObjectUrl;
  } else if (staticWallpaperImg.classList.contains('active')) {
    if (!staticWallpaperImg.getAttribute('src')) staticWallpaperImg.src = wallpaperObjectUrl;
  }
}

function analyzeCurrentWallpaper(rec) {
  if (!rec || document.hidden || wallpaperAnalysisPromise) return;
  if (wallpaperModeUpdatedAt === rec.updatedAt) return;
  const cachedMode = readWallpaperModeCache(rec.updatedAt);
  if (cachedMode) {
    applyAdaptivePalette(cachedMode);
    wallpaperModeUpdatedAt = rec.updatedAt;
    return;
  }
  const media = currentWallpaperMedia();
  if (!media || (media.tagName !== 'IMG' && media.tagName !== 'VIDEO')) return;
  const colorSeq = wallpaperColorSeq;
  const promise = analyzeWallpaperElement(media).then(mode => {
    if (wallpaperAnalysisPromise === promise) wallpaperAnalysisPromise = null;
    if (colorSeq !== wallpaperColorSeq) return;
    applyAdaptivePalette(mode);
    rememberWallpaperMode(rec.updatedAt, mode);
    wallpaperModeUpdatedAt = rec.updatedAt;
  });
  wallpaperAnalysisPromise = promise;
}

function refreshWallpaperMeta() {
  wallpaperMeta.classList.remove('error');
  if (!wallpaperRecord) {
    wallpaperMeta.textContent = '支持 JPG / PNG / WebP 静态图与 MP4 / WebM / GIF 动态壁纸';
    wallpaperClear.disabled = true;
    return;
  }
  const kindLabel = wallpaperRecord.kind === 'dynamic' ? '动态壁纸' : '静态壁纸';
  const sizeText = formatWallpaperSize(wallpaperRecord.blob && wallpaperRecord.blob.size);
  wallpaperMeta.textContent = `${kindLabel}已启用：${wallpaperRecord.name || '自定义壁纸'}${sizeText ? '（' + sizeText + '）' : ''}`;
  wallpaperClear.disabled = false;
}

async function refreshWallpaper() {
  let rec = null;
  const opfsMeta = readOpfsWallpaperMeta();
  if (opfsMeta) {
    const file = await readOpfsWallpaper(opfsMeta);
    if (file) {
      rec = { ...opfsMeta, blob: file };
      try { await wallpaperRemove(); } catch (e) {}
    } else {
      await removeOpfsWallpaper();
    }
  }
  if (!rec) {
    try { rec = await wallpaperGet(); } catch (e) { rec = null; }
  }
  wallpaperColorSeq += 1;
  wallpaperAnalysisPromise = null;
  wallpaperModeUpdatedAt = null;
  wallpaperRecord = rec;
  releaseWallpaperMedia();
  if (!rec) {
    wallpaperStage.classList.add('hidden');
    rememberWallpaperMode(null, null);
    applyAdaptivePalette(null);
    refreshWallpaperMeta();
    return;
  }

  wallpaperStage.classList.remove('hidden');
  wallpaperObjectUrl = URL.createObjectURL(rec.blob);
  const isGif = rec.type === 'image/gif' || /\.gif$/i.test(rec.name || '');

  // 动态媒体先只标记激活；是否真正加载/播放交由 syncWallpaperPlayback 按可见性决定
  if (rec.kind === 'dynamic' && !isGif) {
    dynamicWallpaperVideo.classList.add('active');
  } else if (rec.kind === 'dynamic') {
    dynamicWallpaperGif.classList.add('active');
  } else {
    staticWallpaperImg.classList.add('active');
  }
  syncWallpaperPlayback();
  analyzeCurrentWallpaper(rec);
  refreshWallpaperMeta();
}

function showWallpaperError(msg) {
  wallpaperMeta.classList.add('error');
  wallpaperMeta.textContent = msg;
}

function isQuotaError(err) {
  if (!err) return false;
  const name = err.name || '';
  const message = String(err.message || err);
  return name.includes('Quota') ||
         name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
         /quota|space|storage/i.test(message);
}

function wallpaperSaveErrorMessage(err) {
  if (isQuotaError(err)) {
    return '浏览器存储空间不足：请先在 chrome://extensions 移除并重新加载本扩展（使 unlimitedStorage 生效），或先清除旧壁纸/浏览器缓存后重试';
  }
  return '保存失败，请重试';
}

async function handleWallpaperUpload(dynamic) {
  const input = dynamic ? dynamicWallpaperInput : staticWallpaperInput;
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;

  const err = validateWallpaper(file, dynamic);
  if (err) { showWallpaperError(err); return; }

  try {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
    const opfsRoot = dynamic && file.size >= WALLPAPER_OPFS_MIN_BYTES ? await getOpfsRoot() : null;
    if (!opfsRoot && navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota;
      const usage = estimate.usage;
      const oldBytes = wallpaperRecord && wallpaperRecord.blob ? wallpaperRecord.blob.size : 0;
      if (typeof quota === 'number' && typeof usage === 'number' && (quota - usage) + oldBytes < file.size) {
        showWallpaperError('浏览器可用存储不足，无法保存该文件；请先移除旧壁纸或重新加载扩展使 unlimitedStorage 生效');
        return;
      }
    }
    const source = dynamic ? file : await optimizeStaticWallpaper(file);
    const mime = source.type || file.type || guessWallpaperMime(file.name);
    const blob = source.type ? source : new Blob([source], { type: mime });
    const recordMeta = {
      name: file.name,
      type: mime,
      kind: dynamic ? 'dynamic' : 'static',
      updatedAt: Date.now()
    };

    let storedToOpfs = false;
    if (opfsRoot) {
      try {
        await writeOpfsWallpaper(recordMeta, blob);
        try { await wallpaperRemove(); } catch (idbError) {}
        storedToOpfs = true;
      } catch (opfsError) {
        storedToOpfs = false;
      }
    }
    if (!storedToOpfs) {
      await wallpaperSet({ ...recordMeta, blob });
      await removeOpfsWallpaper();
    }
    await refreshWallpaper();
  } catch (e) {
    showWallpaperError(wallpaperSaveErrorMessage(e));
  }
}

async function clearWallpaper() {
  wallpaperClear.disabled = true;
  try {
    const hadOpfs = !!readOpfsWallpaperMeta();
    await removeOpfsWallpaper();
    try {
      await wallpaperRemove();
    } catch (idbError) {
      if (!hadOpfs) throw idbError;
    }
    await refreshWallpaper();
  } catch (e) {
    showWallpaperError('移除失败，请重试');
    wallpaperClear.disabled = !wallpaperRecord;
  }
}

staticWallpaperInput.addEventListener('change', () => handleWallpaperUpload(false));
dynamicWallpaperInput.addEventListener('change', () => handleWallpaperUpload(true));
wallpaperClear.addEventListener('click', (e) => {
  e.stopPropagation();
  clearWallpaper();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearTimeout(clockTimer);
    clearTimeout(suggestTimer);
    syncWallpaperPlayback();
  } else {
    tick();
    syncWallpaperPlayback();
    analyzeCurrentWallpaper(wallpaperRecord);
    const currentQuery = searchInput.value.trim();
    if (historyOn && currentQuery) fetchSuggests(currentQuery);
  }
});

// ==================== 事件委托（历史面板 / 建议区） ====================
historyPanel.addEventListener('click', (e) => {
  const textEl = e.target.closest('.history-item-text');
  const delBtn = e.target.closest('.history-item-del');

  if (delBtn) {
    e.stopPropagation();
    const query = delBtn.parentElement.querySelector('.history-item-text').textContent;
    deleteHistoryItem(query);
    return;
  }

  if (textEl) {
    e.stopPropagation();
    const query = textEl.textContent;
    searchInput.value = query;
    doSearch(query);
  }
});

suggestArea.addEventListener('click', (e) => {
  const textEl = e.target.closest('.history-item-text');
  if (textEl) {
    e.stopPropagation();
    const sug = textEl.textContent;
    searchInput.value = sug;
    doSearch(sug);
  }
});

// ==================== 主题 ====================
let themePanelRendered = false;

function applyTheme(id) {
  const t = THEMES.find(x => x.id === id);
  if (!t) return;
  curTheme = id;
  document.body.dataset.theme = id;
  Object.entries(t.colors).forEach(([k, v]) => document.body.style.setProperty(k, v));
  document.body.style.background = t.gradientBg;
  if (wallpaperColorMode) applyAdaptivePalette(wallpaperColorMode);
  document.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
  localStorage.setItem('last_theme', id);
}

function renderThemePanel() {
  colorGrid.innerHTML = '';
  THEMES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'theme-card';
    el.dataset.id = t.id;
    el.innerHTML = `<div class="theme-circle" style="background:${t.gradientBg};"></div><div class="theme-label">${t.label}</div>`;
    el.addEventListener('click', (ev) => { ev.stopPropagation(); applyTheme(t.id); themePanel.classList.remove('open'); });
    colorGrid.appendChild(el);
  });
  const active = document.querySelector(`.theme-card[data-id="${curTheme}"]`);
  if (active) active.classList.add('active');
}

function loadPrefs() {
  const sid = localStorage.getItem('search_engine_id');
  let idx = ENGINES.findIndex(e => e.id === sid);
  if (idx < 0) {
    const ei = localStorage.getItem('search_engine_idx');
    if (ei !== null && !isNaN(parseInt(ei))) idx = Math.min(parseInt(ei), ENGINES.length - 1);
    else idx = 0;
  }
  setEngine(idx);
  const tid = localStorage.getItem('last_theme');
  applyTheme(tid && THEMES.some(t => t.id === tid) ? tid : 'dawn');
}

// ==================== 全局点击关闭 ====================
document.addEventListener('click', (e) => {
  if (dropdownOn && !engineDrop.contains(e.target) && !engineBtn.contains(e.target)) closeDropdown();
  if (themePanel.classList.contains('open') && !themePanel.contains(e.target) && !settingsBtn.contains(e.target)) themePanel.classList.remove('open');
  if (historyOn && !historyPanel.contains(e.target) && !historyBtn.contains(e.target) && e.target !== searchInput) closeHistory();
});

// ==================== 按钮事件 ====================
engineBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(); });
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!themePanelRendered) {
    renderThemePanel();
    themePanelRendered = true;
  }
  themePanel.classList.toggle('open');
});
searchSubmit.addEventListener('click', (e) => { e.preventDefault(); if (searchInput.value.trim()) doSearch(searchInput.value.trim()); });
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (searchInput.value.trim()) doSearch(searchInput.value.trim()); } });
searchInput.addEventListener('click', (e) => { e.stopPropagation(); openHistory(); });
searchInput.addEventListener('input', () => {
  const v = searchInput.value.trim();
  if (!v) {
    if (historyOn) renderHistory();
    fetchSuggests('');
    return;
  }
  if (historyOn) renderHistory(v);
  else openHistory(v);
  fetchSuggests(v);
});
historyBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleHistory(); });
historyClear.addEventListener('click', (e) => { e.stopPropagation(); clearHistory(); });

// ==================== 启动 ====================
syncEngines();
// 主题面板与引擎下拉改为首次打开时渲染，减少启动时的 DOM 构建与图标网络请求
loadPrefs();
const cachedWallpaperMode = readWallpaperModeCache();
if (cachedWallpaperMode) applyAdaptivePalette(cachedWallpaperMode);
refreshWallpaper();
searchInput.focus();
if (document.hidden) {
  // 若标签页一开始就在后台打开，取消时钟定时并待壁纸加载后保持停播状态
  clearTimeout(clockTimer);
  syncWallpaperPlayback();
}
