import React from 'react';
import { Bookmark } from 'lucide-react';

type Messages = {
  iosAddToHome?: string;
  pressKeysMac?: string;
  pressKeysWin?: string;
  copied?: string;
};

type Props = {
  label?: string;
  className?: string;
  messages?: Messages; // 支持注入多语言文案
};

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: any;
    external?: any;
    sidebar?: any;
  }
}

function toast(msg: string) {
  if (!msg) return;
  try {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText =
      'position:fixed;left:50%;top:16px;transform:translateX(-50%);background:rgba(17,24,39,.95);color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:9999';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  } catch {}
}

const BookmarkButton: React.FC<Props> = ({ label = 'Bookmark', className = '', messages }) => {
  const onClick = async () => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isMac = /Macintosh|Mac OS X/.test(ua);

    // 默认英文文案，支持被 props.messages 覆盖为你的 i18n
    const msgs: Required<Messages> = {
      iosAddToHome: messages?.iosAddToHome ?? 'Tap Share, then "Add to Home Screen" to save fevergame.space.',
      pressKeysMac: messages?.pressKeysMac ?? 'Press Cmd + D to bookmark fevergame.space.',
      pressKeysWin: messages?.pressKeysWin ?? 'Press Ctrl + D to bookmark fevergame.space.',
      copied: messages?.copied ?? 'Link to fevergame.space copied.',
    };

    // 0) 旧版浏览器原生收藏接口（若存在则真正加入书签）
    try {
      if (window.external && typeof (window.external as any).AddFavorite === 'function') {
        (window.external as any).AddFavorite('https://fevergame.space', document.title || 'Fever Game Today');
        return;
      }
      if (window.sidebar && typeof (window.sidebar as any).addPanel === 'function') {
        (window.sidebar as any).addPanel(document.title || 'Fever Game Today', 'https://fevergame.space', '');
        return;
      }
    } catch {}

    // 1) Android/支持的浏览器：尝试触发 PWA 安装（等价“收藏到主屏幕”）
    const promptEvt = window.__deferredPWAInstallPrompt;
    if (promptEvt?.prompt) {
      try {
        promptEvt.prompt();
        await promptEvt.userChoice;
      } finally {
        window.__deferredPWAInstallPrompt = undefined;
      }
      return;
    }

    // 2) iOS Safari：最短路径提示
    if (isIOS && isSafari) {
      toast(msgs.iosAddToHome);
      return;
    }

    // 3) 现代桌面浏览器：复制链接 + 快捷键提示（无法直接写入书签栏）
    try {
      await navigator.clipboard.writeText('https://fevergame.space');
      toast(`${msgs.copied} ${isMac ? msgs.pressKeysMac : msgs.pressKeysWin}`);
    } catch {
      toast(isMac ? msgs.pressKeysMac : msgs.pressKeysWin);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center transition-colors ${className}`}
      aria-label={label}
      title={label}
    >
      <Bookmark className="h-4 w-4 mr-1" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

export default BookmarkButton;