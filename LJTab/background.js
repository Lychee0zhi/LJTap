/**
 * 灵境 · 新标签页 — 后台 Service Worker
 * 代理搜索建议请求，绕过 CORS 限制
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 单次请求超时：避免响应缓慢的站点让 Service Worker 长期保持存活
const SUGGEST_FETCH_TIMEOUT_MS = 6000;
const MAX_SUGGEST_URL_LENGTH = 2048;

function headersFor(url) {
  const h = { 'User-Agent': UA, 'Accept': '*/*' };
  if (url.includes('api.bing.com') || url.includes('www.bing.com')) {
    h['Referer'] = 'https://www.bing.com/';
  } else if (url.includes('suggest.yandex.com') || url.includes('suggest.yandex.ru')) {
    h['Referer'] = 'https://yandex.com/';
  } else if (url.includes('sogou.com')) {
    h['Referer'] = 'https://www.sogou.com/';
  } else if (url.includes('suggestion.baidu.com')) {
    h['Referer'] = 'https://www.baidu.com/';
  }
  return h;
}

function isValidSuggestUrl(url) {
  if (typeof url !== 'string' || url.length < 8 || url.length > MAX_SUGGEST_URL_LENGTH) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch (e) {
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== 'fetchSuggest') return;
  const url = message.url;
  if (!isValidSuggestUrl(url)) {
    sendResponse({ ok: false, error: 'invalid url' });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUGGEST_FETCH_TIMEOUT_MS);

  fetch(url, { headers: headersFor(url), signal: controller.signal })
    .then(resp => {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.text();
    })
    .then(text => {
      sendResponse({ ok: true, text });
    })
    .catch(err => {
      sendResponse({ ok: false, error: err && err.name === 'AbortError' ? 'timeout' : (err && err.message) || 'fetch failed' });
    })
    .finally(() => {
      clearTimeout(timer);
    });

  return true; // 异步响应
});
