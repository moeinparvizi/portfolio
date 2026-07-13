import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import type { BlogCategory } from '../../../core/models';

@Component({
  selector: 'app-admin-blog-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent, ModalComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Blog Categories</h1>
        <button class="btn btn-primary" (click)="openNewForm()">+ New Category</button>
      </div>

      <!-- Edit Modal -->
      <app-modal [open]="showForm" [title]="editingId ? 'Edit Category' : 'New Category'" (close)="cancel()">
        <form (ngSubmit)="save()">
          <div class="lang-tabs">
            @for (lang of languages; track lang.code) {
              <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                {{ lang.label }}
              </button>
            }
          </div>

          <div class="form-group required">
            <label>Name ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name[activeLang]" [name]="'name_' + activeLang" class="galaxy-input" placeholder="e.g., Frontend, Backend" required />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Categories List -->
      <div class="list">
        @for (cat of categories; track cat.id) {
          <app-glass-card>
            <div class="category-card">
              <div class="category-info">
                <h4>{{ cat.name['en'] || cat.name['fa'] || 'Untitled' }}</h4>
                <span class="post-count">{{ cat._count?.posts || 0 }} posts</span>
              </div>
              <div class="category-actions">
                <button class="btn btn-ghost btn-sm" (click)="edit(cat)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(cat.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No categories yet. Click "New Category" to create one.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteCategory()"
        (cancel)="showConfirm = false"
      />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 800px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); h1 { font-size: var(--text-2xl); margin: 0; } }
    .lang-tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); }
    .tab { padding: var(--space-sm) var(--space-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-family: var(--font-body); &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); } }
    .form-group { margin-bottom: var(--space-lg); label { display: block; font-weight: 500; margin-bottom: var(--space-sm); } }
    .required label { color: var(--color-text); }
    .req { color: var(--color-error); margin-left: 2px; }
    .form-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
    .list { display: flex; flex-direction: column; gap: var(--space-md); }
    .category-card { display: flex; justify-content: space-between; align-items: center; }
    .category-info h4 { margin: 0; }
    .post-count { font-size: var(--text-sm); color: var(--color-text-muted); }
    .category-actions { display: flex; gap: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-3xl); color: var(--color-text-muted); }
  `],
})
export class AdminBlogCategoriesComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  categories: BlogCategory[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;

  formData: any = { name: { fa: '', en: '', de: '' } };

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  ngOnInit() { this.load(); }

  load() {
    this.api.getBlogCategories().subscribe({
      next: (c) => { this.categories = []; this.cdr.detectChanges(); this.categories = c; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load categories'),
    });
  }

  openNewForm() {
    this.editingId = null;
    this.formData = { name: { fa: '', en: '', de: '' } };
    this.showForm = true;
  }

  edit(cat: BlogCategory) {
    this.editingId = cat.id;
    this.formData = { name: { ...(cat.name || { en: '', fa: '', de: '' }) } };
    this.showForm = true;
  }

  save() {
    if (!this.formData.name.en && !this.formData.name.fa && !this.formData.name.de) {
      this.toast.warning('Category name is required');
      return;
    }

    this.saving = true;
    const wasEditing = !!this.editingId;
    const obs = this.editingId
      ? this.api.updateBlogCategory(this.editingId, this.formData)
      : this.api.createBlogCategory(this.formData);

    obs.subscribe({
      next: () => { this.saving = false; this.cancel(); this.load(); this.toast.success(wasEditing ? 'Category updated!' : 'Category created!'); },
      error: () => { this.saving = false; this.toast.error('Failed to save category'); },
    });
  }

  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.formData = { name: { fa: '', en: '', de: '' } };
  }

  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }

  deleteCategory() {
    if (this.deleteId) {
      this.api.deleteBlogCategory(this.deleteId).subscribe({
        next: () => { this.load(); this.showConfirm = false; this.toast.success('Category deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete'); },
      });
    }
  }
}
