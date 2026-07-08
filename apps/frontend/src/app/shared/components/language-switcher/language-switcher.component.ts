import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService } from '../../../core/services/locale.service';
import type { Locale } from '../../../core/models';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lang-switcher">
      @for (lang of languages; track lang.code) {
        <button
          class="lang-btn"
          [class.active]="localeService.locale() === lang.code"
          (click)="localeService.setLocale(lang.code)"
          [attr.aria-label]="'Switch to ' + lang.label"
        >
          {{ lang.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .lang-switcher {
      display: flex;
      gap: 2px;
      padding: 2px;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
    }

    .lang-btn {
      padding: 4px 12px;
      border: none;
      border-radius: calc(var(--radius-md) - 2px);
      background: transparent;
      color: var(--color-text-secondary);
      font-family: var(--font-body);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;

      &:hover {
        color: var(--color-text);
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        background: var(--color-primary);
        color: white;
      }
    }
  `],
})
export class LanguageSwitcherComponent {
  localeService = inject(LocaleService);

  languages = [
    { code: 'en' as Locale, label: 'EN' },
    { code: 'fa' as Locale, label: 'FA' },
    { code: 'de' as Locale, label: 'DE' },
  ];
}
