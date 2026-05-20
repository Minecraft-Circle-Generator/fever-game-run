export type MessageTable = Record<string, string>;

function detectLang(): 'en' | 'zh' {
  try {
    const lang = (document.documentElement.lang || navigator.language || 'en').toLowerCase();
    if (lang.startsWith('zh')) return 'zh';
    return 'en';
  } catch {
    return 'en';
  }
}

const en: MessageTable = {
  'bookmark.label': 'Bookmark',
  'bookmark.iosAddToHome': 'Tap Share in Safari, then "Add to Home Screen".',
  'bookmark.pressKeysMac': 'Press Cmd + D to bookmark.',
  'bookmark.pressKeysWin': 'Press Ctrl + D to bookmark.',
  'bookmark.copied': 'Link copied.',
  'recap.title': 'Game Recap',
  'recap.metaDesc': 'Game Recap',
  'recap.theme': 'Theme',
  'recap.highlights': 'Key Highlights',
  'recap.storyline': 'Game Storyline',
  'recap.tactics': 'Tactical Analysis',
  'recap.advancedData': 'Advanced Data',
  'recap.gameSummary': 'Game Summary',
  'recap.playerStats': 'Player Stats',
  'recap.gameHighlights': 'Game Highlights'
};

const zh: MessageTable = {
  'bookmark.label': '收藏',
  'bookmark.iosAddToHome': '在 Safari 分享菜单中选择“添加到主屏幕”。',
  'bookmark.pressKeysMac': '按 Cmd + D 将本站加入书签。',
  'bookmark.pressKeysWin': '按 Ctrl + D 将本站加入书签。',
  'bookmark.copied': '已复制链接。',
  'recap.title': '比赛回顾',
  'recap.metaDesc': '比赛回顾',
  'recap.theme': '主题',
  'recap.highlights': '关键看点',
  'recap.storyline': '比赛故事线',
  'recap.tactics': '战术解读',
  'recap.advancedData': '高级数据',
  'recap.gameSummary': '比赛综述',
  'recap.playerStats': '球员数据',
  'recap.gameHighlights': '比赛集锦'
};

const builtin = { en, zh };

/**
 * 使用 Vite 的 import.meta.glob 预打包 JSON 翻译文件（若存在）
 * - 构建期静态分析，避免 CommonJS require 兼容问题
 * - 不存在时返回空对象，不会报错
 */
let fileEn: MessageTable | undefined;
let fileZh: MessageTable | undefined;
try {
  const modules = import.meta.glob('../locales/*.json', { eager: true, import: 'default' }) as Record<string, MessageTable>;
  fileEn = modules['../locales/en.json'];
  fileZh = modules['../locales/zh.json'];
} catch {}

// 轻量 t：优先全局 i18n → 本地 JSON → 内置 → fallback/key
export function t(key: string, fallback?: string): string {
  try {
    const anyWin = window as any;
    if (anyWin?.i18n?.t) {
      return anyWin.i18n.t(key) ?? fallback ?? key;
    }
    if (typeof anyWin?.t === 'function') {
      return anyWin.t(key) ?? fallback ?? key;
    }
  } catch {}
  const lang = detectLang();
  const tblFromFile = lang === 'zh' ? (fileZh || {}) : (fileEn || {});
  if (tblFromFile && key in tblFromFile) return tblFromFile[key];
  const tbl = builtin[lang] || builtin.en;
  return tbl[key] ?? fallback ?? key;
}