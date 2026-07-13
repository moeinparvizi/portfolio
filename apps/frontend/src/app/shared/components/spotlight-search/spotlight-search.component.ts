import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { LocaleService } from '../../../core/services/locale.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import type { BlogPost } from '../../../core/models';

@Component({
  selector: 'app-spotlight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  template: `
    @if (open) {
      <div class="spotlight-overlay" (click)="close.emit()">
        <div class="spotlight-container" (click)="$event.stopPropagation()">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              #searchInput
              type="text"
              [(ngModel)]="query"
              (input)="onSearch()"
              (keydown.escape)="close.emit()"
              [placeholder]="placeholder"
              class="search-input"
              autofocus
            />
            <button class="close-btn" (click)="close.emit()">ESC</button>
          </div>

          @if (query.length > 0) {
            <div class="results">
              @if (loading) {
                <div class="loading">Searching...</div>
              } @else if (results.length === 0) {
                <div class="no-results">No results found for "{{ query }}"</div>
              } @else {
                <div class="results-header">
                  {{ results.length }} result{{ results.length > 1 ? 's' : '' }}
                </div>
                @for (post of results; track post.id) {
                  <a [routerLink]="getLink('/blog/' + post.slug)" (click)="close.emit()" class="result-item">
                    @if (post.coverImage) {
                      <img [src]="post.coverImage" class="result-image" />
                    } @else {
                      <div class="result-image-placeholder">📝</div>
                    }
                    <div class="result-content">
                      <h4>{{ post.title | translate }}</h4>
                      <p>{{ post.excerpt | translate }}</p>
                      <div class="result-meta">
                        @if (post.category) {
                          <span class="result-category">{{ post.category.name | translate }}</span>
                        }
                        <span>{{ post.views }} views</span>
                      </div>
                    </div>
                  </a>
                }
              }
            </div>
          } @else {
            <div class="hints">
              <p>Search by post title, content, or tags</p>
              <div class="hint-tags">
                <span class="hint-tag" (click)="query = 'angular'; onSearch()">angular</span>
                <span class="hint-tag" (click)="query = 'typescript'; onSearch()">typescript</span>
                <span class="hint-tag" (click)="query = 'web'; onSearch()">web</span>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .spotlight-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      z-index: 10000;
      animation: fadeIn 0.15s ease-out;
    }

    .spotlight-container {
      width: 100%;
      max-width: 640px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(40px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-xl);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 100px rgba(99, 102, 241, 0.1);
      overflow: hidden;
      animation: slideDown 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .search-box {
      display: flex;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid rgba(99, 102, 241, 0.15);
      gap: var(--space-md);
    }

    .search-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: var(--text-lg);
      color: #F1F5F9;
      font-family: var(--font-body);

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .close-btn {
      padding: 4px 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.5);
      font-size: var(--text-xs);
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .results {
      max-height: 400px;
      overflow-y: auto;
      padding: var(--space-sm);
    }

    .results-header {
      padding: var(--space-sm) var(--space-md);
      font-size: var(--text-xs);
      color: rgba(255, 255, 255, 0.4);
    }

    .result-item {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: inherit;
      transition: background var(--transition-fast);

      &:hover {
        background: rgba(99, 102, 241, 0.15);
      }
    }

    .result-image {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      flex-shrink: 0;
    }

    .result-image-placeholder {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .result-content {
      flex: 1;
      min-width: 0;

      h4 {
        margin: 0 0 4px;
        font-size: var(--text-sm);
        color: #F1F5F9;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        margin: 0;
        font-size: var(--text-xs);
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .result-meta {
      display: flex;
      gap: var(--space-sm);
      margin-top: 4px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.3);
    }

    .result-category {
      color: var(--color-primary);
    }

    .hints {
      padding: var(--space-xl);
      text-align: center;
      color: rgba(255, 255, 255, 0.4);

      p {
        margin: 0 0 var(--space-md);
        font-size: var(--text-sm);
      }
    }

    .hint-tags {
      display: flex;
      gap: var(--space-sm);
      justify-content: center;
    }

    .hint-tag {
      padding: 4px 12px;
      border-radius: var(--radius-md);
      background: rgba(99, 102, 241, 0.15);
      color: rgba(255, 255, 255, 0.6);
      font-size: var(--text-xs);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: rgba(99, 102, 241, 0.3);
        color: white;
      }
    }

    .loading, .no-results {
      padding: var(--space-xl);
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: var(--text-sm);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class SpotlightSearchComponent {
  @Input() open = false;
  @Input() placeholder = 'Search posts...';
  @Input() mode: 'public' | 'admin' = 'public';
  @Output() close = new EventEmitter<void>();

  private api = inject(ApiService);
  private localeService = inject(LocaleService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('searchInput') searchInput!: ElementRef;

  query = '';
  results: BlogPost[] = [];
  loading = false;
  private searchTimeout: any;

  getLink(path: string): string {
    const locale = this.localeService.getLocale();
    return `/${locale}${path}`;
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.loading = true;
    this.cdr.detectChanges();

    this.searchTimeout = setTimeout(() => {
      if (this.query.trim().length < 2) {
        this.results = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const status = this.mode === 'admin' ? undefined : 'published';
      this.api.searchBlog(this.query, status).subscribe({
        next: (posts) => {
          this.results = posts;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.results = [];
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }, 300);
  }
}
