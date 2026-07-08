import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from '../../core/services/locale.service';
import type { LocaleText, Locale } from '../../core/models';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: true,
})
export class TranslatePipe implements PipeTransform {
  private localeService = inject(LocaleService);

  transform(value: LocaleText | null | undefined): string {
    if (!value) return '';

    const locale = this.localeService.getLocale();

    // Try current locale, then fallback to English
    return value[locale] || value['en'] || Object.values(value)[0] || '';
  }
}
