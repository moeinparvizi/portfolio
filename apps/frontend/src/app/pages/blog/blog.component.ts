import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { LocaleService } from '../../core/services/locale.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { BlogPost, BlogCategory } from '../../core/models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <div class="blog-header">
          <h1>Blog</h1>
          <div class="search-box">
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search posts..." (keyup.enter)="search()" class="galaxy-input" />
            <button class="btn btn-primary btn-sm" (click)="search()">Search</button>
          </div>
        </div>

        <!-- Categories -->
        @if (categories.length > 0) {
          <div class="categories">
            <button class="category-btn" [class.active]="!activeCategory" (click)="filterByCategory('')">All</button>
            @for (cat of categories; track cat.id) {
              <button class="category-btn" [class.active]="activeCategory === cat.id" (click)="filterByCategory(cat.id)">
                {{ cat.name | translate }}
              </button>
            }
          </div>
        }

        <!-- Posts Grid -->
        <div class="posts-grid">
          @for (post of filteredPosts; track post.id) {
            <app-glass-card [hoverable]="true">
              <a [routerLink]="getLink('/blog/' + post.slug)" class="post-link">
                @if (post.coverImage) {
                  <img [src]="post.coverImage" [alt]="post.title | translate" class="post-image" />
                }
                <div class="post-content">
                  @if (post.category) {
                    <span class="post-category">{{ post.category.name | translate }}</span>
                  }
                  <h3>{{ post.title | translate }}</h3>
                  <p class="post-excerpt">{{ post.excerpt | translate }}</p>
                  <div class="post-meta">
                    <span>{{ post.authorName || 'Admin' }}</span>
                    <span>{{ formatDate(post.createdAt) }}</span>
                    <span>{{ post.views }} views</span>
                  </div>
                  @if (post.tags?.length) {
                    <div class="post-tags">
                      @for (tag of post.tags; track tag) {
                        <span class="tag">{{ tag }}</span>
                      }
                    </div>
                  }
                </div>
              </a>
            </app-glass-card>
          } @empty {
            <div class="empty-state">
              <p>No blog posts yet.</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .blog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;
      gap: var(--space-md);

      h1 { margin: 0; }
    }

    .search-box {
      display: flex;
      gap: var(--space-sm);

      input {
        width: 250px;
      }
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
    }

    .category-btn {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-family: var(--font-body);
      transition: all var(--transition-fast);

      &.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      &:hover:not(.active) {
        border-color: var(--color-primary);
      }
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-lg);
    }

    .post-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .post-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
    }

    .post-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .post-category {
      font-size: var(--text-xs);
      color: var(--color-primary);
      font-weight: 500;
    }

    h3 {
      margin: 0;
      font-size: var(--text-lg);
    }

    .post-excerpt {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      margin: 0;
    }

    .post-meta {
      display: flex;
      gap: var(--space-md);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }

    .tag {
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      font-size: var(--text-xs);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }
  `],
})
export class BlogComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private localeService = inject(LocaleService);

  posts: BlogPost[] = [];
  categories: BlogCategory[] = [];
  activeCategory = '';
  searchQuery = '';

  get filteredPosts(): BlogPost[] {
    if (this.activeCategory) {
      return this.posts.filter(p => p.categoryId === this.activeCategory);
    }
    return this.posts;
  }

  getLink(path: string): string {
    const locale = this.localeService.getLocale();
    return `/${locale}${path}`;
  }

  ngOnInit() {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts() {
    this.api.getBlogPosts().subscribe({
      next: (p) => {
        this.posts = p;
        this.cdr.detectChanges();
      },
    });
  }

  loadCategories() {
    this.api.getBlogCategories().subscribe({
      next: (c) => {
        this.categories = c;
        this.cdr.detectChanges();
      },
    });
  }

  filterByCategory(categoryId: string) {
    this.activeCategory = categoryId;
  }

  search() {
    if (this.searchQuery.trim()) {
      this.api.searchBlog(this.searchQuery).subscribe({
        next: (p) => {
          this.posts = p;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.loadPosts();
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
