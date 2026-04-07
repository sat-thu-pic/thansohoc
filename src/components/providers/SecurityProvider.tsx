'use client';

import { useEffect } from 'react';

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Chặn chuột phải
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Chặn phím tắt (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    // 3. Debugger Loop (Làm treo DevTools nếu cố tình mở)
    const debuggerLoop = setInterval(() => {
      (function () {
        (function a() {
          try {
            (function b(i) {
              if (('' + i / i).length !== 1 || i % 20 === 0) {
                (function () {}.constructor('debugger')());
              } else {
                (function () {}.constructor('debugger')());
              }
              b(++i);
            })(0);
          } catch (e) {
            setTimeout(a, 50);
          }
        })();
      })();
    }, 100);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(debuggerLoop);
    };
  }, []);

  return <>{children}</>;
}
