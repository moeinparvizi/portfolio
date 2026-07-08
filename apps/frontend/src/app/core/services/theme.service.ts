import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'portfolio-theme';
  private platformId = inject(PLATFORM_ID);

  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const current = this.theme();
        document.documentElement.setAttribute('data-theme', current);
        localStorage.setItem(this.STORAGE_KEY, current);
      });
    }
  }

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (stored) return stored;

      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    }
    return 'dark';
  }
}
