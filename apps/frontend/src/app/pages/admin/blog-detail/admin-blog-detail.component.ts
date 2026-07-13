import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { BlogPost, BlogComment } from '../../../core/models';

@Component({
  selector: 'app-admin-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      @if (post) {
        <div class="header">
          <a routerLink="/admin/blog" class="back-link">← Back to Posts</a>
          <div class="header-actions">
            <a [routerLink]="'/blog/' + post.slug" target="_blank" class="btn btn-ghost btn-sm">👁 View Public</a>
            <a [routerLink]="['/admin/blog']" class="btn btn-primary btn-sm">Edit Post</a>
          </div>
        </div>

        <!-- Post Details -->
        <app-glass-card>
          <div class="post-details">
            <div class="post-header">
              <h1>{{ post.title['en'] || 'Untitled' }}</h1>
              <div class="post-badges">
                <span class="badge" [class]="post.status">{{ post.status }}</span>
                @if (post.featured) {
                  <span class="badge featured">Featured</span>
                }
              </div>
            </div>

            @if (post.category) {
              <p class="category">📁 {{ post.category.name['en'] }}</p>
            }

            <div class="post-meta">
              <span>👁 {{ post.views }} views</span>
              <span>💬 {{ getTotalComments() }} comments</span>
              <span>📅 {{ formatDate(post.createdAt) }}</span>
            </div>

            @if (post.tags?.length) {
              <div class="tags">
                @for (tag of post.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
            }

            <div class="content-section">
              <h3>Excerpt</h3>
              <p>{{ post.excerpt['en'] || 'No excerpt' }}</p>
            </div>

            <div class="content-section">
              <h3>Content</h3>
              <div class="content-preview">{{ post.content['en'] || 'No content' }}</div>
            </div>
          </div>
        </app-glass-card>

        <!-- Comments Section -->
        <div class="comments-section">
          <h2>💬 Comments ({{ getTotalComments() }})</h2>

          @if (post.comments?.length) {
            <div class="comments-list">
              @for (comment of post.comments; track comment.id) {
                <app-glass-card>
                  <div class="comment-card">
                    <div class="comment-header">
                      <div class="author-info">
                        <strong>{{ comment.name }}</strong>
                        <span class="email">{{ comment.email }}</span>
                      </div>
                      <div class="comment-badges">
                        @if (!comment.approved) {
                          <span class="badge pending">Pending</span>
                        } @else {
                          <span class="badge approved">Approved</span>
                        }
                      </div>
                    </div>
                    <p class="comment-content">{{ comment.content }}</p>
                    <div class="comment-meta">
                      <span>{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <div class="comment-actions">
                      @if (!comment.approved) {
                        <button class="btn btn-primary btn-sm" (click)="approveComment(comment.id)">✓ Approve</button>
                      }
                      <button class="btn btn-ghost btn-sm" (click)="toggleReply(comment.id)">💬 Reply</button>
                      <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDeleteComment(comment.id)">Delete</button>
                    </div>

                    <!-- Reply Form -->
                    @if (replyingTo === comment.id) {
                      <div class="reply-form">
                        <form (ngSubmit)="submitReply(comment.id)">
                          <input type="text" [(ngModel)]="replyForm.name" name="name" placeholder="Your Name" class="galaxy-input" required />
                          <textarea [(ngModel)]="replyForm.content" name="content" rows="2" placeholder="Write your reply..." class="galaxy-textarea" required></textarea>
                          <div class="reply-actions">
                            <button type="button" class="btn btn-ghost btn-sm" (click)="cancelReply()">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-sm" [disabled]="replying">Send Reply</button>
                          </div>
                        </form>
                      </div>
                    }

                    <!-- Replies -->
                    @if (comment.replies?.length) {
                      <div class="replies">
                        @for (reply of comment.replies; track reply.id) {
                          <div class="reply">
                            <div class="reply-header">
                              <strong>{{ reply.name }}</strong>
                              <span class="admin-badge">Admin</span>
                              <span class="reply-date">{{ formatDate(reply.createdAt) }}</span>
                            </div>
                            <p class="reply-content">{{ reply.content }}</p>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </app-glass-card>
              }
            </div>
          } @else {
            <div class="empty-state">
              <p>No comments yet.</p>
            </div>
          }
        </div>
      } @else {
        <p>Loading...</p>
      }

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteComment()"
        (cancel)="showConfirm = false"
      />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 1000px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
    .back-link { color: var(--color-text-secondary); text-decoration: none; &:hover { color: var(--color-primary); } }
    .header-actions { display: flex; gap: var(--space-sm); }
    .post-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm); h1 { margin: 0; } }
    .post-badges { display: flex; gap: var(--space-sm); }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.draft { background: var(--color-warning); color: white; } &.published { background: var(--color-success); color: white; } &.featured { background: var(--color-primary); color: white; } &.pending { background: var(--color-warning); color: white; } &.approved { background: var(--color-success); color: white; } }
    .category { color: var(--color-primary); font-size: var(--text-sm); }
    .post-meta { display: flex; gap: var(--space-md); font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); }
    .tags { display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-lg); }
    .tag { padding: 4px 12px; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.1); color: var(--color-primary); font-size: var(--text-sm); }
    .content-section { margin-bottom: var(--space-lg); h3 { font-size: var(--text-lg); margin-bottom: var(--space-sm); } p { color: var(--color-text-secondary); } }
    .content-preview { padding: var(--space-md); background: var(--color-surface-alt); border-radius: var(--radius-md); white-space: pre-wrap; font-size: var(--text-sm); max-height: 200px; overflow-y: auto; }
    .comments-section { margin-top: var(--space-2xl); h2 { margin-bottom: var(--space-lg); } }
    .comments-list { display: flex; flex-direction: column; gap: var(--space-md); }
    .comment-card { display: flex; flex-direction: column; gap: var(--space-sm); }
    .comment-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .author-info { display: flex; flex-direction: column; gap: 2px; }
    .email { font-size: var(--text-xs); color: var(--color-text-muted); }
    .comment-badges { display: flex; gap: var(--space-sm); }
    .comment-content { color: var(--color-text-secondary); margin: 0; }
    .comment-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
    .comment-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .reply-form { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); .reply-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; } }
    .replies { margin-top: var(--space-md); padding-left: var(--space-lg); border-left: 2px solid var(--color-border); }
    .reply { padding: var(--space-md) 0; border-bottom: 1px solid var(--color-border); &:last-child { border-bottom: none; } }
    .reply-header { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xs); }
    .admin-badge { font-size: var(--text-xs); padding: 2px 6px; border-radius: var(--radius-sm); background: var(--color-primary); color: white; }
    .reply-date { font-size: var(--text-xs); color: var(--color-text-muted); }
    .reply-content { color: var(--color-text-secondary); font-size: var(--text-sm); margin: 0; }
    .empty-state { text-align: center; padding: var(--space-xl); color: var(--color-text-muted); }
  `],
})
export class AdminBlogDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  post: BlogPost | null = null;
  showConfirm = false;
  deleteId: string | null = null;
  replyingTo: string | null = null;
  replying = false;
  replyForm = { name: 'Admin', email: 'admin@portfolio.com', content: '' };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.api.getBlogPost(id).subscribe({
      next: (p) => {
        this.post = p;
        this.cdr.detectChanges();
      },
    });
  }

  getTotalComments(): number {
    if (!this.post?.comments) return 0;
    let total = this.post.comments.length;
    this.post.comments.forEach(c => {
      if (c.replies) total += c.replies.length;
    });
    return total;
  }

  approveComment(id: string) {
    this.api.approveBlogComment(id).subscribe({
      next: () => {
        if (this.post) this.loadPost(this.post.id);
        this.toast.success('Comment approved!');
      },
      error: () => this.toast.error('Failed to approve'),
    });
  }

  toggleReply(commentId: string) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyForm = { name: 'Admin', email: 'admin@portfolio.com', content: '' };
  }

  cancelReply() {
    this.replyingTo = null;
    this.replyForm = { name: 'Admin', email: 'admin@portfolio.com', content: '' };
  }

  submitReply(commentId: string) {
    if (!this.replyForm.content) {
      this.toast.warning('Reply content is required');
      return;
    }

    this.replying = true;
    this.api.replyToComment(commentId, this.replyForm).subscribe({
      next: () => {
        this.replying = false;
        this.cancelReply();
        if (this.post) this.loadPost(this.post.id);
        this.toast.success('Reply sent!');
      },
      error: () => {
        this.replying = false;
        this.toast.error('Failed to send reply');
      },
    });
  }

  confirmDeleteComment(id: string) {
    this.deleteId = id;
    this.showConfirm = true;
  }

  deleteComment() {
    if (this.deleteId) {
      this.api.deleteBlogComment(this.deleteId).subscribe({
        next: () => {
          if (this.post) this.loadPost(this.post.id);
          this.showConfirm = false;
          this.toast.success('Comment deleted!');
        },
        error: () => {
          this.showConfirm = false;
          this.toast.error('Failed to delete');
        },
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
