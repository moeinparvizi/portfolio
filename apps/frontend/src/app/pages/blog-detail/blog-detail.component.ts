import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { LocaleService } from '../../core/services/locale.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { BlogPost, BlogComment } from '../../core/models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        @if (post) {
          <a [routerLink]="getLink('/blog')" class="back-link">← Back to Blog</a>

          <article class="article">
            @if (post.coverImage) {
              <img [src]="post.coverImage" [alt]="post.title | translate" class="article-image" />
            }

            <div class="article-header">
              @if (post.category) {
                <span class="article-category">{{ post.category.name | translate }}</span>
              }
              <h1>{{ post.title | translate }}</h1>
              <div class="article-meta">
                <span>{{ post.authorName || 'Admin' }}</span>
                <span>{{ formatDate(post.createdAt) }}</span>
                <span>{{ post.views }} views</span>
              </div>
            </div>

            <div class="article-content">
              {{ post.content | translate }}
            </div>

            @if (post.tags?.length) {
              <div class="article-tags">
                @for (tag of post.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
            }
          </article>

          <!-- Comments Section -->
          <div class="comments-section">
            <h2>Comments ({{ post.comments?.length || 0 }})</h2>

            @if (post.comments?.length) {
              <div class="comments-list">
                @for (comment of post.comments; track comment.id) {
                  <app-glass-card>
                    <div class="comment">
                      <div class="comment-header">
                        <strong>{{ comment.name }}</strong>
                        <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                      </div>
                      <p class="comment-content">{{ comment.content }}</p>
                    </div>
                  </app-glass-card>
                }
              </div>
            }

            <!-- Comment Form -->
            <app-glass-card>
              <h3>Leave a Comment</h3>
              <form (ngSubmit)="submitComment()" class="comment-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Name <span class="req">*</span></label>
                    <input type="text" [(ngModel)]="commentForm.name" name="name" required class="galaxy-input" />
                  </div>
                  <div class="form-group">
                    <label>Email <span class="req">*</span></label>
                    <input type="email" [(ngModel)]="commentForm.email" name="email" required class="galaxy-input" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Comment <span class="req">*</span></label>
                  <textarea [(ngModel)]="commentForm.content" name="content" rows="4" required class="galaxy-textarea"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  {{ submitting ? 'Submitting...' : 'Submit Comment' }}
                </button>
              </form>
            </app-glass-card>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: var(--space-lg);
      color: var(--color-text-secondary);
      text-decoration: none;
      &:hover { color: var(--color-primary); }
    }

    .article-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-xl);
    }

    .article-header {
      margin-bottom: var(--space-xl);
    }

    .article-category {
      font-size: var(--text-sm);
      color: var(--color-primary);
      font-weight: 500;
    }

    h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin: var(--space-sm) 0;
    }

    .article-meta {
      display: flex;
      gap: var(--space-md);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .article-content {
      font-size: var(--text-lg);
      line-height: 1.8;
      color: var(--color-text-secondary);
      white-space: pre-wrap;
    }

    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-border);
    }

    .tag {
      padding: 4px 12px;
      border-radius: var(--radius-md);
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      font-size: var(--text-sm);
    }

    .comments-section {
      margin-top: var(--space-3xl);

      h2 { margin-bottom: var(--space-xl); }
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-sm);
    }

    .comment-date {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .comment-content {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .comment-form {
      h3 { margin-bottom: var(--space-lg); }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }

    .form-group {
      margin-bottom: var(--space-md);
      label { display: block; font-weight: 500; margin-bottom: var(--space-sm); }
    }

    .req { color: var(--color-error); }
  `],
})
export class BlogDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private localeService = inject(LocaleService);
  private toast = inject(ToastService);

  post: BlogPost | null = null;
  submitting = false;
  commentForm = { name: '', email: '', content: '' };

  getLink(path: string): string {
    const locale = this.localeService.getLocale();
    return `/${locale}${path}`;
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.api.getBlogPostBySlug(slug).subscribe({
        next: (p) => {
          this.post = p;
          this.cdr.detectChanges();
        },
      });
    }
  }

  submitComment() {
    if (!this.post || !this.commentForm.name || !this.commentForm.email || !this.commentForm.content) {
      this.toast.warning('Please fill in all required fields');
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    this.api.createBlogComment(this.post.id, this.commentForm).subscribe({
      next: () => {
        this.submitting = false;
        this.commentForm = { name: '', email: '', content: '' };
        this.toast.success('Comment submitted! It will appear after approval.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.submitting = false;
        this.toast.error('Failed to submit comment');
        this.cdr.detectChanges();
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
