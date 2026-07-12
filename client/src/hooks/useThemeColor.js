import { useEffect } from 'react';

export const useThemeColor = () => {
  useEffect(() => {
    const updateThemeColor = () => {
      // Create a temporary element with bg-base-200
      const tempEl = document.createElement('div');
      tempEl.className = 'bg-base-200 hidden';
      document.body.appendChild(tempEl);

      // Get the computed background color
      const computedColor = getComputedStyle(tempEl).backgroundColor;
      document.body.removeChild(tempEl);
      
      // Helper to convert rgb(r, g, b) or rgba(r, g, b, a) to hex
      const rgbToHex = (rgb) => {
        const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb; // fallback if parsing fails
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      };

      const hexColor = rgbToHex(computedColor);

      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', hexColor);
    };

    // Initial update. Wait a bit for CSS to load.
    setTimeout(updateThemeColor, 100);

    // Observe changes to data-theme on html tag
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTimeout(updateThemeColor, 50);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);
};
