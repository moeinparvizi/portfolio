import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private document = inject(DOCUMENT);

  setPersonSchema(data: {
    name: string;
    jobTitle: string;
    url?: string;
    sameAs?: string[];
  }) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      url: data.url || 'https://yourdomain.com',
      sameAs: data.sameAs || [],
    };

    this.setSchema(schema);
  }

  setWebSiteSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Portfolio',
      url: 'https://yourdomain.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://yourdomain.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };

    this.setSchema(schema);
  }

  private setSchema(schema: any) {
    // Remove existing schema
    const existing = this.document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new schema
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
