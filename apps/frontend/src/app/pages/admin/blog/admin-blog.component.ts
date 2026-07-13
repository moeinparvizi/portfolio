import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SpotlightSearchComponent } from '../../../shared/components/spotlight-search/spotlight-search.component';
import type { BlogPost, BlogCategory } from '../../../core/models';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GlassCardComponent, ConfirmDialogComponent, ModalComponent, SpotlightSearchComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Blog Management</h1>
        <button class="btn btn-primary" (click)="openNewForm()">+ New Post</button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Status:</label>
          <select class="galaxy-select" [(ngModel)]="filterStatus" (change)="loadPosts()">
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Sort:</label>
          <select class="galaxy-select" [(ngModel)]="sortBy" (change)="loadPosts()">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Views</option>
          </select>
        </div>
        <button class="btn btn-glass" (click)="showSearch = true">🔍 Search</button>
      </div>

      <!-- Stats -->
      <div class="stats">
        <span class="stat">{{ posts.length }} Total</span>
        <span class="stat draft">{{ draftCount }} Draft</span>
        <span class="stat published">{{ publishedCount }} Published</span>
      </div>

      <!-- Edit Modal -->
      <app-modal [open]="showForm" [title]="editingId ? 'Edit Post' : 'New Post'" (close)="cancel()">
        <form (ngSubmit)="save()">
          <div class="lang-tabs">
            @for (lang of languages; track lang.code) {
              <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                {{ lang.label }}
              </button>
            }
          </div>

          <div class="form-group required">
            <label>Title ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.title[activeLang]" [name]="'title_' + activeLang" class="galaxy-input" required />
          </div>

          <div class="form-group required">
            <label>Excerpt ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
            <textarea [(ngModel)]="formData.excerpt[activeLang]" [name]="'excerpt_' + activeLang" rows="2" class="galaxy-textarea" required></textarea>
          </div>

          <div class="form-group required">
            <label>Content ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
            <textarea [(ngModel)]="formData.content[activeLang]" [name]="'content_' + activeLang" rows="8" class="galaxy-textarea" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select class="galaxy-select" [(ngModel)]="formData.categoryId" name="categoryId">
                <option value="">No Category</option>
                @for (cat of categories; track cat.id) {
                  <option [value]="cat.id">{{ cat.name['en'] }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="galaxy-select" [(ngModel)]="formData.status" name="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" [(ngModel)]="tagsInput" name="tags" placeholder="angular, typescript, web" class="galaxy-input" />
          </div>

          <div class="form-group">
            <label>Cover Image URL</label>
            <input type="text" [(ngModel)]="formData.coverImage" name="coverImage" placeholder="https://..." class="galaxy-input" />
          </div>

          <div class="form-group">
            <label class="galaxy-checkbox">
              <input type="checkbox" [(ngModel)]="formData.featured" name="featured" />
              <span class="checkbox-box"></span>
              <span class="checkbox-label">Featured Post</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Posts List -->
      <div class="list">
        @for (post of posts; track post.id) {
          <app-glass-card>
            <div class="post-card">
              <div class="post-header">
                <div class="post-info">
                  <h4>{{ post.title['en'] || 'Untitled' }}</h4>
                  @if (post.category) {
                    <span class="category">{{ post.category.name['en'] }}</span>
                  }
                </div>
                <div class="post-badges">
                  <span class="badge" [class]="post.status">{{ post.status }}</span>
                  @if (post.featured) {
                    <span class="badge featured">Featured</span>
                  }
                </div>
              </div>
              <p class="post-excerpt">{{ post.excerpt['en'] || '' }}</p>
              <div class="post-meta">
                <span>👁 {{ post.views }} views</span>
                <span>💬 {{ post.comments?.length || 0 }} comments</span>
                <span>📅 {{ formatDate(post.createdAt) }}</span>
              </div>
              <div class="post-actions">
                <a [routerLink]="['/admin/blog', post.id]" class="btn btn-ghost btn-sm">👁 View</a>
                <button class="btn btn-ghost btn-sm" (click)="edit(post)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(post.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No posts found.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Post"
        message="Are you sure you want to delete this post?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deletePost()"
        (cancel)="showConfirm = false"
      />

      <!-- Spotlight Search -->
      <app-spotlight-search [open]="showSearch" mode="admin" (close)="showSearch = false" />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 1000px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); h1 { font-size: var(--text-2xl); margin: 0; } }
    .filters { display: flex; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-lg); align-items: flex-end; }
    .filter-group { display: flex; flex-direction: column; gap: var(--space-xs); label { font-size: var(--text-xs); color: var(--color-text-muted); } select { min-width: 120px; } }
    .search-box { display: flex; gap: var(--space-xs); input { width: 200px; } }
    .stats { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .stat { font-size: var(--text-sm); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-md); background: var(--color-surface-alt); &.draft { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); } &.published { background: rgba(16, 185, 129, 0.1); color: var(--color-success); } }
    .lang-tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); }
    .tab { padding: var(--space-sm) var(--space-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-family: var(--font-body); &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); } }
    .form-group { margin-bottom: var(--space-lg); label { display: block; font-weight: 500; margin-bottom: var(--space-sm); } }
    .required label { color: var(--color-text); }
    .req { color: var(--color-error); margin-left: 2px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); @media (max-width: 600px) { grid-template-columns: 1fr; } }
    .form-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
    .list { display: flex; flex-direction: column; gap: var(--space-lg); }
    .post-card { display: flex; flex-direction: column; gap: var(--space-sm); }
    .post-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .post-info h4 { margin: 0; }
    .post-badges { display: flex; gap: var(--space-sm); }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.draft { background: var(--color-warning); color: white; } &.published { background: var(--color-success); color: white; } &.featured { background: var(--color-primary); color: white; } }
    .category { font-size: var(--text-xs); color: var(--color-primary); }
    .post-excerpt { color: var(--color-text-secondary); font-size: var(--text-sm); margin: 0; }
    .post-meta { display: flex; gap: var(--space-md); font-size: var(--text-xs); color: var(--color-text-muted); }
    .post-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-3xl); color: var(--color-text-muted); }
  `],
})
export class AdminBlogComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  posts: BlogPost[] = [];
  categories: BlogCategory[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;
  tagsInput = '';
  showSearch = false;
  filterStatus = 'all';
  sortBy = 'newest';

  formData: any = this.emptyForm();

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  get draftCount(): number {
    return this.posts.filter(p => p.status === 'draft').length;
  }

  get publishedCount(): number {
    return this.posts.filter(p => p.status === 'published').length;
  }

  ngOnInit() {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts() {
    this.api.getBlogPosts(this.filterStatus, undefined, this.sortBy).subscribe({
      next: (p) => { this.posts = []; this.cdr.detectChanges(); this.posts = p; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load posts'),
    });
  }

  loadCategories() {
    this.api.getBlogCategories().subscribe({
      next: (c) => { this.categories = c; this.cdr.detectChanges(); },
    });
  }

  emptyForm() {
    return {
      title: { fa: '', en: '', de: '' },
      excerpt: { fa: '', en: '', de: '' },
      content: { fa: '', en: '', de: '' },
      categoryId: '',
      status: 'draft',
      tags: [],
      coverImage: '',
      featured: false,
    };
  }

  openNewForm() {
    this.editingId = null;
    this.formData = this.emptyForm();
    this.tagsInput = '';
    this.showForm = true;
  }

  edit(post: BlogPost) {
    this.editingId = post.id;
    this.formData = {
      title: { ...(post.title || { en: '', fa: '', de: '' }) },
      excerpt: { ...(post.excerpt || { en: '', fa: '', de: '' }) },
      content: { ...(post.content || { en: '', fa: '', de: '' }) },
      categoryId: post.categoryId || '',
      status: post.status,
      tags: post.tags || [],
      coverImage: post.coverImage || '',
      featured: post.featured,
    };
    this.tagsInput = (post.tags || []).join(', ');
    this.showForm = true;
  }

  save() {
    if (!this.formData.title.en && !this.formData.title.fa && !this.formData.title.de) {
      this.toast.warning('Title is required');
      return;
    }
    if (!this.formData.content.en && !this.formData.content.fa && !this.formData.content.de) {
      this.toast.warning('Content is required');
      return;
    }

    this.saving = true;
    const data = {
      ...this.formData,
      tags: this.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    const wasEditing = !!this.editingId;
    const obs = this.editingId
      ? this.api.updateBlogPost(this.editingId, data)
      : this.api.createBlogPost(data);

    obs.subscribe({
      next: () => { this.saving = false; this.cancel(); this.loadPosts(); this.toast.success(wasEditing ? 'Post updated!' : 'Post created!'); },
      error: () => { this.saving = false; this.toast.error('Failed to save post'); },
    });
  }

  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.formData = this.emptyForm();
    this.tagsInput = '';
  }

  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }

  deletePost() {
    if (this.deleteId) {
      this.api.deleteBlogPost(this.deleteId).subscribe({
        next: () => { this.loadPosts(); this.showConfirm = false; this.toast.success('Post deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete'); },
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
