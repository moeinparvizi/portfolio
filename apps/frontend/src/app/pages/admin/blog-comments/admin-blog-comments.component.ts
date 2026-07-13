import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { BlogComment } from '../../../core/models';

@Component({
  selector: 'app-admin-blog-comments',
  standalone: true,
  imports: [CommonModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Blog Comments</h1>
        <div class="stats">
          <span class="stat">{{ comments.length }} Total</span>
          <span class="stat pending">{{ pendingCount }} Pending</span>
          <span class="stat approved">{{ approvedCount }} Approved</span>
        </div>
      </div>

      <!-- Pending Comments -->
      @if (pendingComments.length > 0) {
        <div class="section">
          <h2>⏳ Pending Approval ({{ pendingCount }})</h2>
          <div class="list">
            @for (comment of pendingComments; track comment.id) {
              <app-glass-card>
                <div class="comment-card pending">
                  <div class="comment-header">
                    <div class="author-info">
                      <strong>{{ comment.name }}</strong>
                      <span class="email">{{ comment.email }}</span>
                    </div>
                    <span class="badge pending">Pending</span>
                  </div>
                  @if (comment.post) {
                    <p class="post-link">Post: {{ comment.post.title['en'] || 'Untitled' }}</p>
                  }
                  <p class="comment-content">{{ comment.content }}</p>
                  <div class="comment-meta">
                    <span>{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <div class="comment-actions">
                    <button class="btn btn-primary btn-sm" (click)="approve(comment.id)">✓ Approve</button>
                    <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(comment.id)">Delete</button>
                  </div>
                </div>
              </app-glass-card>
            }
          </div>
        </div>
      }

      <!-- Approved Comments -->
      <div class="section">
        <h2>✅ Approved ({{ approvedCount }})</h2>
        @if (approvedComments.length === 0) {
          <div class="empty-state">
            <p>No approved comments yet.</p>
          </div>
        } @else {
          <div class="list">
            @for (comment of approvedComments; track comment.id) {
              <app-glass-card>
                <div class="comment-card">
                  <div class="comment-header">
                    <div class="author-info">
                      <strong>{{ comment.name }}</strong>
                      <span class="email">{{ comment.email }}</span>
                    </div>
                    <span class="badge approved">Approved</span>
                  </div>
                  @if (comment.post) {
                    <p class="post-link">Post: {{ comment.post.title['en'] || 'Untitled' }}</p>
                  }
                  <p class="comment-content">{{ comment.content }}</p>
                  <div class="comment-meta">
                    <span>{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <div class="comment-actions">
                    <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(comment.id)">Delete</button>
                  </div>
                </div>
              </app-glass-card>
            }
          </div>
        }
      </div>

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
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md); h1 { font-size: var(--text-2xl); margin: 0; } }
    .stats { display: flex; gap: var(--space-md); }
    .stat { font-size: var(--text-sm); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-md); background: var(--color-surface-alt); &.pending { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); } &.approved { background: rgba(16, 185, 129, 0.1); color: var(--color-success); } }
    .section { margin-bottom: var(--space-2xl); h2 { font-size: var(--text-xl); margin-bottom: var(--space-lg); } }
    .list { display: flex; flex-direction: column; gap: var(--space-md); }
    .comment-card { display: flex; flex-direction: column; gap: var(--space-sm); &.pending { border-left: 3px solid var(--color-warning); } }
    .comment-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .author-info { display: flex; flex-direction: column; gap: 2px; }
    .email { font-size: var(--text-xs); color: var(--color-text-muted); }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.pending { background: var(--color-warning); color: white; } &.approved { background: var(--color-success); color: white; } }
    .post-link { font-size: var(--text-sm); color: var(--color-primary); margin: 0; }
    .comment-content { color: var(--color-text-secondary); margin: 0; }
    .comment-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
    .comment-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-xl); color: var(--color-text-muted); }
  `],
})
export class AdminBlogCommentsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  comments: BlogComment[] = [];
  showConfirm = false;
  deleteId: string | null = null;

  get pendingComments(): BlogComment[] {
    return this.comments.filter(c => !c.approved);
  }

  get approvedComments(): BlogComment[] {
    return this.comments.filter(c => c.approved);
  }

  get pendingCount(): number {
    return this.pendingComments.length;
  }

  get approvedCount(): number {
    return this.approvedComments.length;
  }

  ngOnInit() { this.load(); }

  load() {
    // Get all comments from all posts
    this.api.getBlogPosts().subscribe({
      next: (posts) => {
        const allComments: BlogComment[] = [];
        posts.forEach(post => {
          if (post.comments) {
            post.comments.forEach(comment => {
              allComments.push({ ...comment, post: { title: post.title, slug: post.slug } } as any);
            });
          }
        });
        this.comments = allComments.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.cdr.detectChanges();
      },
    });
  }

  approve(id: string) {
    this.api.approveBlogComment(id).subscribe({
      next: () => { this.load(); this.toast.success('Comment approved!'); },
      error: () => this.toast.error('Failed to approve'),
    });
  }

  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }

  deleteComment() {
    if (this.deleteId) {
      this.api.deleteBlogComment(this.deleteId).subscribe({
        next: () => { this.load(); this.showConfirm = false; this.toast.success('Comment deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete'); },
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
