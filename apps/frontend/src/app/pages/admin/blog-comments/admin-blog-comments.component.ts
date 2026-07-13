import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { BlogComment } from '../../../core/models';

@Component({
  selector: 'app-admin-blog-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Blog Comments</h1>
        <div class="stats">
          <span class="stat">{{ filteredComments.length }} Total</span>
          <span class="stat pending">{{ pendingCount }} Pending</span>
          <span class="stat approved">{{ approvedCount }} Approved</span>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="filters">
        <div class="search-box">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search comments..." class="galaxy-input" (input)="filterComments()" />
        </div>
        <select class="galaxy-select" [(ngModel)]="filterStatus" (change)="filterComments()">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <!-- Comments List -->
      <div class="list">
        @for (comment of filteredComments; track comment.id) {
          <app-glass-card>
            <div class="comment-card" [class.pending]="!comment.approved">
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
              @if (comment.post) {
                <p class="post-link">Post: {{ comment.post.title['en'] || 'Untitled' }}</p>
              }
              <p class="comment-content">{{ comment.content }}</p>
              <div class="comment-meta">
                <span>{{ formatDate(comment.createdAt) }}</span>
              </div>
              <div class="comment-actions">
                @if (!comment.approved) {
                  <button class="btn btn-primary btn-sm" (click)="approve(comment.id)">✓ Approve</button>
                }
                <button class="btn btn-ghost btn-sm" (click)="toggleReply(comment.id)">💬 Reply</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(comment.id)">Delete</button>
              </div>

              <!-- Reply Form -->
              @if (replyingTo === comment.id) {
                <div class="reply-form">
                  <form (ngSubmit)="submitReply(comment.id)">
                    <input type="text" [(ngModel)]="replyForm.name" name="name" placeholder="Your Name" class="galaxy-input" required />
                    <textarea [(ngModel)]="replyForm.content" name="content" rows="3" placeholder="Write your reply..." class="galaxy-textarea" required></textarea>
                    <div class="reply-actions">
                      <button type="button" class="btn btn-ghost btn-sm" (click)="cancelReply()">Cancel</button>
                      <button type="submit" class="btn btn-primary btn-sm" [disabled]="replying">Send Reply</button>
                    </div>
                  </form>
                </div>
              }
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No comments found.</p>
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
    .filters { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); align-items: center; }
    .search-box { flex: 1; max-width: 300px; }
    .list { display: flex; flex-direction: column; gap: var(--space-md); }
    .comment-card { display: flex; flex-direction: column; gap: var(--space-sm); &.pending { border-left: 3px solid var(--color-warning); } }
    .comment-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .author-info { display: flex; flex-direction: column; gap: 2px; }
    .email { font-size: var(--text-xs); color: var(--color-text-muted); }
    .comment-badges { display: flex; gap: var(--space-sm); }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.pending { background: var(--color-warning); color: white; } &.approved { background: var(--color-success); color: white; } }
    .post-link { font-size: var(--text-sm); color: var(--color-primary); margin: 0; }
    .comment-content { color: var(--color-text-secondary); margin: 0; }
    .comment-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
    .comment-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .reply-form { margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); .reply-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; } }
    .empty-state { text-align: center; padding: var(--space-xl); color: var(--color-text-muted); }
  `],
})
export class AdminBlogCommentsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  allComments: BlogComment[] = [];
  filteredComments: BlogComment[] = [];
  showConfirm = false;
  deleteId: string | null = null;
  replyingTo: string | null = null;
  replying = false;
  replyForm = { name: 'Admin', content: '' };
  searchQuery = '';
  filterStatus = 'all';

  get pendingCount(): number {
    return this.allComments.filter(c => !c.approved).length;
  }

  get approvedCount(): number {
    return this.allComments.filter(c => c.approved).length;
  }

  ngOnInit() { this.load(); }

  load() {
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
        this.allComments = allComments.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filterComments();
        this.cdr.detectChanges();
      },
    });
  }

  filterComments() {
    let filtered = [...this.allComments];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(c =>
        this.filterStatus === 'pending' ? !c.approved : c.approved
      );
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.content.toLowerCase().includes(query)
      );
    }

    this.filteredComments = filtered;
  }

  approve(id: string) {
    this.api.approveBlogComment(id).subscribe({
      next: () => { this.load(); this.toast.success('Comment approved!'); },
      error: () => this.toast.error('Failed to approve'),
    });
  }

  toggleReply(commentId: string) {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyForm = { name: 'Admin', content: '' };
  }

  cancelReply() {
    this.replyingTo = null;
    this.replyForm = { name: 'Admin', content: '' };
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
        this.load();
        this.toast.success('Reply sent!');
      },
      error: () => {
        this.replying = false;
        this.toast.error('Failed to send reply');
      },
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
