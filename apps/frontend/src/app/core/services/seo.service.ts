import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LocaleService } from './locale.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private localeService = inject(LocaleService);

  private readonly defaultTitle = 'Portfolio - Full-Stack Developer';
  private readonly defaultDescription = 'Personal portfolio website showcasing projects, skills, and experience';

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.updateMetaTags();
    });
  }

  private updateMetaTags() {
    const url = this.router.url;
    const locale = this.localeService.getLocale();

    // Generate title based on route
    const routeTitle = this.getRouteTitle(url);
    const fullTitle = routeTitle ? `${routeTitle} | Portfolio` : this.defaultTitle;

    this.title.setTitle(fullTitle);

    // Update meta tags
    this.meta.updateTag({ name: 'description', content: this.defaultDescription });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: this.defaultDescription });
    this.meta.updateTag({ property: 'og:url', content: `https://yourdomain.com${url}` });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: this.defaultDescription });

    // Update hreflang tags
    this.updateHreflangTags(url, locale);
  }

  private getRouteTitle(url: string): string {
    const segments = url.split('/').filter(Boolean);
    const route = segments.slice(1).join('/'); // Remove locale prefix

    const titles: Record<string, string> = {
      '': 'Home',
      'about': 'About',
      'skills': 'Skills',
      'projects': 'Projects',
      'experience': 'Experience',
      'education': 'Education',
      'testimonials': 'Testimonials',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
    };

    return titles[route] || '';
  }

  private updateHreflangTags(currentUrl: string, currentLocale: string) {
    // Remove existing hreflang tags
    const existingTags = document.querySelectorAll('link[hreflang]');
    existingTags.forEach(tag => tag.remove());

    // Add hreflang tags for all locales
    const locales = ['en', 'fa', 'de'];
    const urlWithoutLocale = currentUrl.replace(/^\/(en|fa|de)/, '');

    locales.forEach(locale => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', locale);
      link.setAttribute('href', `https://yourdomain.com/${locale}${urlWithoutLocale}`);
      document.head.appendChild(link);
    });

    // Add x-default
    const defaultLink = document.createElement('link');
    defaultLink.setAttribute('rel', 'alternate');
    defaultLink.setAttribute('hreflang', 'x-default');
    defaultLink.setAttribute('href', `https://yourdomain.com/en${urlWithoutLocale}`);
    document.head.appendChild(defaultLink);
  }
}
