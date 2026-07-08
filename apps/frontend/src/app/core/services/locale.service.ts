import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type { Locale } from '../models';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly STORAGE_KEY = 'portfolio-locale';
  private readonly SUPPORTED: Locale[] = ['en', 'fa', 'de'];
  private platformId = inject(PLATFORM_ID);

  locale = signal<Locale>(this.getInitialLocale());
  direction = signal<'ltr' | 'rtl'>(this.locale() === 'fa' ? 'rtl' : 'ltr');

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const current = this.locale();
        document.documentElement.setAttribute('dir', current === 'fa' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', current);
        localStorage.setItem(this.STORAGE_KEY, current);
        this.direction.set(current === 'fa' ? 'rtl' : 'ltr');
      });
    }
  }

  setLocale(locale: Locale) {
    if (!this.SUPPORTED.includes(locale)) return;

    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean);

    // Remove old locale prefix if present
    if (this.SUPPORTED.includes(segments[0] as Locale)) {
      segments.shift();
    }

    // Add new locale prefix
    const newUrl = `/${locale}/${segments.join('/')}`;
    this.locale.set(locale);
    this.router.navigateByUrl(newUrl);
  }

  getLocale(): Locale {
    return this.locale();
  }

  isRtl(): boolean {
    return this.locale() === 'fa';
  }

  private getInitialLocale(): Locale {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Locale | null;
      if (stored && this.SUPPORTED.includes(stored)) return stored;

      if (navigator.language) {
        const lang = navigator.language.split('-')[0];
        if (this.SUPPORTED.includes(lang as Locale)) {
          return lang as Locale;
        }
      }
    }

    return 'en';
  }
}
