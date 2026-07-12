import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Education } from '../../../core/models';

@Component({
  selector: 'app-admin-education',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Education Management</h1>
        <button class="btn btn-primary" (click)="openNewForm()">+ Add Education</button>
      </div>

      @if (showForm) {
        <app-glass-card>
          <div class="form-header">
            <h3>{{ editingId ? 'Edit Education' : 'New Education' }}</h3>
            <button class="btn btn-ghost btn-sm" (click)="cancel()">✕</button>
          </div>

          <form (ngSubmit)="save()">
            <div class="lang-tabs">
              @for (lang of languages; track lang.code) {
                <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                  {{ lang.label }}
                </button>
              }
            </div>

            <div class="form-group">
              <label>Institution ({{ activeLang.toUpperCase() }})</label>
              <input type="text" [(ngModel)]="formData.institution[activeLang]" [name]="'inst_' + activeLang" placeholder="e.g., University of Tehran" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Degree ({{ activeLang.toUpperCase() }})</label>
                <input type="text" [(ngModel)]="formData.degree[activeLang]" [name]="'deg_' + activeLang" placeholder="e.g., BSc, MSc" required />
              </div>
              <div class="form-group">
                <label>Field of Study ({{ activeLang.toUpperCase() }})</label>
                <input type="text" [(ngModel)]="formData.fieldOfStudy[activeLang]" [name]="'field_' + activeLang" placeholder="e.g., Computer Science" />
              </div>
            </div>

            <div class="form-group">
              <label>Description ({{ activeLang.toUpperCase() }})</label>
              <textarea [(ngModel)]="formData.description[activeLang]" [name]="'desc_' + activeLang" rows="3" placeholder="Additional details"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="formData.startDate" name="startDate" required />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="formData.endDate" name="endDate" />
              </div>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="formData.includeInResume" name="resume" />
                Include in Resume
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </app-glass-card>
      }

      <div class="list">
        @for (edu of items; track edu.id) {
          <app-glass-card>
            <div class="item-card">
              <div class="item-header">
                <div>
                  <h4>{{ edu.degree['en'] || 'Untitled' }} – {{ edu.fieldOfStudy['en'] || '' }}</h4>
                  <p class="institution">{{ edu.institution['en'] || '' }}</p>
                </div>
                <div class="item-date">
                  {{ formatDate(edu.startDate) }} – {{ formatDate(edu.endDate) }}
                </div>
              </div>
              <div class="item-actions">
                <button class="btn btn-ghost btn-sm" (click)="edit(edu)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(edu.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state"><p>No education yet.</p></div>
        }
      </div>

      <app-confirm-dialog [open]="showConfirm" title="Delete" message="Are you sure?" [danger]="true" (confirm)="deleteItem()" (cancel)="showConfirm = false" />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 1000px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); h1 { font-size: var(--text-2xl); margin: 0; } }
    .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); h3 { margin: 0; } }
    .lang-tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); }
    .tab { padding: var(--space-sm) var(--space-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-family: var(--font-body); &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); } }
    .form-group { margin-bottom: var(--space-lg); label { display: block; font-weight: 500; margin-bottom: var(--space-sm); } input, textarea { width: 100%; padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-text); font-family: var(--font-body); &:focus { outline: none; border-color: var(--color-primary); } } }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
    .form-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-lg); }
    .list { display: flex; flex-direction: column; gap: var(--space-lg); }
    .item-card { display: flex; flex-direction: column; gap: var(--space-sm); }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .item-header h4 { margin: 0; }
    .institution { color: var(--color-primary); margin: 0; }
    .item-date { font-size: var(--text-sm); color: var(--color-text-muted); }
    .item-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-3xl); color: var(--color-text-muted); }
  `],
})
export class AdminEducationComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  items: Education[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;

  formData: any = this.emptyForm();
  languages = [{ code: 'fa' as const, label: 'فارسی' }, { code: 'en' as const, label: 'English' }, { code: 'de' as const, label: 'Deutsch' }];

  ngOnInit() { this.load(); }

  load() {
    this.api.getEducation().subscribe({
      next: (e) => { this.items = e; this.cdr.detectChanges(); },
    });
  }

  emptyForm() {
    return { institution: { fa: '', en: '', de: '' }, degree: { fa: '', en: '', de: '' }, fieldOfStudy: { fa: '', en: '', de: '' }, description: { fa: '', en: '', de: '' }, startDate: '', endDate: '', includeInResume: false };
  }

  openNewForm() { this.editingId = null; this.formData = this.emptyForm(); this.showForm = true; }

  edit(item: Education) {
    this.editingId = item.id;
    this.formData = { ...item, institution: { ...item.institution }, degree: { ...item.degree }, fieldOfStudy: { ...item.fieldOfStudy }, description: { ...item.description } };
    this.showForm = true;
  }

  save() {
    if (!this.formData.institution.en && !this.formData.institution.fa && !this.formData.institution.de) {
      this.toast.warning('Institution is required');
      return;
    }
    if (!this.formData.degree.en && !this.formData.degree.fa && !this.formData.degree.de) {
      this.toast.warning('Degree is required');
      return;
    }
    if (!this.formData.startDate) {
      this.toast.warning('Start date is required');
      return;
    }

    this.saving = true;
    const obs = this.editingId ? this.api.updateEducation(this.editingId, this.formData) : this.api.createEducation(this.formData);
    obs.subscribe({
      next: () => { this.saving = false; this.cancel(); this.load(); this.toast.success('Education saved!'); },
      error: () => { this.saving = false; this.toast.error('Failed to save education'); },
    });
  }

  cancel() { this.showForm = false; this.editingId = null; this.formData = this.emptyForm(); }
  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }
  deleteItem() {
    if (this.deleteId) {
      this.api.deleteEducation(this.deleteId).subscribe({
        next: () => { this.load(); this.showConfirm = false; this.toast.success('Education deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete'); },
      });
    }
  }
  formatDate(d?: string) { return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''; }
}
