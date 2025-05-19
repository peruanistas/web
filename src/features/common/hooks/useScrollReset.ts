import { useEffect } from 'react';

export function useScrollReset() {
  useEffect(() => {
    if (window.location.href.indexOf('#') === -1) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, []);
}
