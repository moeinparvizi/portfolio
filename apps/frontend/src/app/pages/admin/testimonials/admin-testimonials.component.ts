import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Testimonial } from '../../../core/models';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Testimonials Management</h1>
        <div class="stats">
          <span class="stat">{{ testimonials.length }} Total</span>
          <span class="stat approved">{{ approvedCount }} Approved</span>
          <span class="stat pending">{{ pendingCount }} Pending</span>
        </div>
      </div>

      <!-- Edit Form -->
      @if (showForm) {
        <app-glass-card>
          <div class="form-header">
            <h3>{{ editingId ? 'Edit Testimonial' : 'New Testimonial' }}</h3>
            <button class="btn btn-ghost btn-sm" (click)="cancel()">✕</button>
          </div>

          <form (ngSubmit)="save()">
            <div class="form-row">
              <div class="form-group">
                <label>Author Name</label>
                <input type="text" [(ngModel)]="formData.name" name="name" placeholder="John Doe" required />
              </div>
              <div class="form-group">
                <label>Company</label>
                <input type="text" [(ngModel)]="formData.company" name="company" placeholder="Google" />
              </div>
            </div>

            <div class="lang-tabs">
              @for (lang of languages; track lang.code) {
                <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                  {{ lang.label }}
                </button>
              }
            </div>

            <div class="form-group">
              <label>Role ({{ activeLang.toUpperCase() }})</label>
              <input type="text" [(ngModel)]="formData.role[activeLang]" [name]="'role_' + activeLang" placeholder="Software Engineer" />
            </div>

            <div class="form-group">
              <label>Testimonial Content ({{ activeLang.toUpperCase() }})</label>
              <textarea [(ngModel)]="formData.content[activeLang]" [name]="'content_' + activeLang" rows="4" placeholder="What did they say about you?" required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Avatar URL</label>
                <input type="text" [(ngModel)]="formData.avatarUrl" name="avatarUrl" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>Rating</label>
                <div class="rating-selector">
                  @for (r of [1,2,3,4,5]; track r) {
                    <button type="button" class="star" [class.filled]="formData.rating >= r" (click)="formData.rating = r">
                      ★
                    </button>
                  }
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Status</label>
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" [(ngModel)]="formData.approved" name="approved" />
                  <span>Approved</span>
                </label>
                <label class="checkbox">
                  <input type="checkbox" [(ngModel)]="formData.visible" name="visible" />
                  <span>Visible on site</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
              </button>
            </div>

            @if (error) {
              <p class="error">{{ error }}</p>
            }
          </form>
        </app-glass-card>
      }

      <!-- Testimonials List -->
      <div class="list">
        @for (t of testimonials; track t.id) {
          <app-glass-card>
            <div class="testimonial-item">
              <div class="testimonial-content">
                <div class="header">
                  <div class="author-info">
                    @if (t.avatarUrl) {
                      <img [src]="t.avatarUrl" [alt]="t.name" class="avatar" />
                    }
                    <div>
                      <strong>{{ t.name }}</strong>
                      @if (t.role) {
                        <span class="role">{{ t.role['en'] || '' }}</span>
                      }
                      @if (t.company) {
                        <span class="company">at {{ t.company }}</span>
                      }
                    </div>
                  </div>
                  <div class="badges">
                    @if (t.approved) {
                      <span class="badge approved">Approved</span>
                    } @else {
                      <span class="badge pending">Pending</span>
                    }
                    @if (!t.visible) {
                      <span class="badge hidden">Hidden</span>
                    }
                  </div>
                </div>

                <p class="content">"{{ t.content['en'] || t.content['fa'] || '' }}"</p>

                @if (t.rating) {
                  <div class="rating">
                    @for (r of [1,2,3,4,5]; track r) {
                      <span [class.filled]="r <= t.rating!">★</span>
                    }
                  </div>
                }
              </div>

              <div class="actions">
                @if (!t.approved) {
                  <button class="btn btn-success btn-sm" (click)="approve(t.id)">✓ Approve</button>
                }
                @if (t.approved && !t.visible) {
                  <button class="btn btn-ghost btn-sm" (click)="toggleVisible(t)">Show</button>
                }
                @if (t.approved && t.visible) {
                  <button class="btn btn-ghost btn-sm" (click)="toggleVisible(t)">Hide</button>
                }
                <button class="btn btn-ghost btn-sm" (click)="edit(t)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(t.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No testimonials yet.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteItem()"
        (cancel)="showConfirm = false"
      />
    </div>
  `,
  styles: [`
    .admin-page {
      padding: var(--space-xl);
      max-width: 1000px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);

      h1 {
        font-size: var(--text-2xl);
        margin: 0;
      }
    }

    .stats {
      display: flex;
      gap: var(--space-md);
    }

    .stat {
      font-size: var(--text-sm);
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-md);
      background: var(--color-surface-alt);

      &.approved { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
      &.pending { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      h3 { margin: 0; }
    }

    .lang-tabs {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .tab {
      padding: var(--space-sm) var(--space-lg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-family: var(--font-body);
      &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
    }

    .form-group {
      margin-bottom: var(--space-lg);
      label { display: block; font-weight: 500; margin-bottom: var(--space-sm); }
      input, textarea {
        width: 100%;
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        color: var(--color-text);
        font-family: var(--font-body);
        &:focus { outline: none; border-color: var(--color-primary); }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
    }

    .rating-selector {
      display: flex;
      gap: var(--space-xs);
    }

    .star {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--color-border);
      cursor: pointer;
      padding: 0;
      &.filled { color: var(--color-warning); }
    }

    .checkbox-group {
      display: flex;
      gap: var(--space-lg);
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      cursor: pointer;
      input { width: auto; }
    }

    .form-actions {
      display: flex;
      gap: var(--space-sm);
      justify-content: flex-end;
      margin-top: var(--space-lg);
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .testimonial-item {
      display: flex;
      justify-content: space-between;
      gap: var(--space-lg);
    }

    .testimonial-content {
      flex: 1;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-md);
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .role {
      display: block;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .company {
      font-size: var(--text-sm);
      color: var(--color-primary);
    }

    .badges {
      display: flex;
      gap: var(--space-sm);
    }

    .badge {
      font-size: var(--text-xs);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      &.approved { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }
      &.pending { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
      &.hidden { background: rgba(107, 114, 128, 0.1); color: var(--color-text-muted); }
    }

    .content {
      font-style: italic;
      color: var(--color-text-secondary);
      margin: 0 0 var(--space-md);
    }

    .rating {
      color: var(--color-border);
      span.filled { color: var(--color-warning); }
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      align-items: flex-end;
    }

    .btn-success {
      background: var(--color-success);
      color: white;
      &:hover { background: #059669; }
    }

    .btn-danger {
      color: var(--color-error);
      &:hover { background: rgba(239, 68, 68, 0.1); }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }

    .error {
      color: var(--color-error);
      margin-top: var(--space-md);
      text-align: center;
    }
  `],
})
export class AdminTestimonialsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  testimonials: Testimonial[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;
  error = '';

  formData: any = this.emptyForm();

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  get approvedCount(): number {
    return this.testimonials.filter(t => t.approved).length;
  }

  get pendingCount(): number {
    return this.testimonials.filter(t => !t.approved).length;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAllTestimonials().subscribe({
      next: (t) => {
        this.testimonials = t;
        this.cdr.detectChanges();
      },
    });
  }

  emptyForm() {
    return {
      name: '',
      company: '',
      role: { fa: '', en: '', de: '' },
      content: { fa: '', en: '', de: '' },
      avatarUrl: '',
      rating: 5,
      approved: false,
      visible: true,
    };
  }

  openNewForm() {
    this.editingId = null;
    this.formData = this.emptyForm();
    this.showForm = true;
    this.error = '';
  }

  edit(t: Testimonial) {
    this.editingId = t.id;
    this.formData = {
      name: t.name || '',
      company: t.company || '',
      role: { ...(t.role || { en: '', fa: '', de: '' }) },
      content: { ...(t.content || { en: '', fa: '', de: '' }) },
      avatarUrl: t.avatarUrl || '',
      rating: t.rating || 5,
      approved: t.approved,
      visible: t.visible,
    };
    this.showForm = true;
    this.error = '';
  }

  save() {
    if (!this.formData.name || !this.formData.content.en) {
      this.error = 'Name and English content are required';
      return;
    }

    this.saving = true;
    this.error = '';

    const obs = this.editingId
      ? this.api.updateTestimonial(this.editingId, this.formData)
      : this.api.submitTestimonial(this.formData);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.cancel();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Failed to save testimonial';
      },
    });
  }

  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.formData = this.emptyForm();
    this.error = '';
  }

  approve(id: string) {
    this.api.approveTestimonial(id).subscribe(() => this.load());
  }

  toggleVisible(t: Testimonial) {
    this.api.updateTestimonial(t.id, { visible: !t.visible }).subscribe(() => this.load());
  }

  confirmDelete(id: string) {
    this.deleteId = id;
    this.showConfirm = true;
  }

  deleteItem() {
    if (this.deleteId) {
      this.api.deleteTestimonial(this.deleteId).subscribe({
        next: () => {
          this.load();
          this.showConfirm = false;
        },
        error: () => {
          this.showConfirm = false;
        },
      });
    }
  }
}
