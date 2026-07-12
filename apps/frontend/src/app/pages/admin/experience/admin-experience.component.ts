import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Experience } from '../../../core/models';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Experience Management</h1>
        <button class="btn btn-primary" (click)="openNewForm()">+ Add Experience</button>
      </div>

      @if (showForm) {
        <app-glass-card>
          <div class="form-header">
            <h3>{{ editingId ? 'Edit Experience' : 'New Experience' }}</h3>
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

            <div class="form-group required">
              <label>Position ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
              <input type="text" [(ngModel)]="formData.position[activeLang]" [name]="'pos_' + activeLang" placeholder="e.g., Senior Developer" required />
            </div>

            <div class="form-group required">
              <label>Company ({{ activeLang.toUpperCase() }}) <span class="req">*</span></label>
              <input type="text" [(ngModel)]="formData.company[activeLang]" [name]="'comp_' + activeLang" placeholder="e.g., Google" required />
            </div>

            <div class="form-group">
              <label>Description ({{ activeLang.toUpperCase() }})</label>
              <textarea [(ngModel)]="formData.description[activeLang]" [name]="'desc_' + activeLang" rows="4" placeholder="What did you do?"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group required">
                <label>Start Date <span class="req">*</span></label>
                <input type="date" [(ngModel)]="formData.startDate" name="startDate" required />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="formData.endDate" name="endDate" [disabled]="formData.isCurrent" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="formData.location" name="location" placeholder="e.g., Remote, Tehran" />
              </div>
              <div class="form-group">
                <label>Options</label>
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" [(ngModel)]="formData.isCurrent" name="isCurrent" />
                    <span>Currently working here</span>
                  </label>
                  <label class="checkbox">
                    <input type="checkbox" [(ngModel)]="formData.includeInResume" name="resume" />
                    <span>Include in Resume</span>
                  </label>
                </div>
              </div>
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
        @for (exp of items; track exp.id) {
          <app-glass-card>
            <div class="item-card">
              <div class="item-header">
                <div>
                  <h4>{{ exp.position['en'] || 'Untitled' }}</h4>
                  <p class="company">{{ exp.company['en'] || '' }}</p>
                </div>
                <div class="item-date">
                  {{ formatDate(exp.startDate) }} – {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                </div>
              </div>
              @if (exp.location) {
                <p class="location">📍 {{ exp.location }}</p>
              }
              <div class="item-actions">
                <button class="btn btn-ghost btn-sm" (click)="edit(exp)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(exp.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state"><p>No experience yet. Click "Add Experience" to create one.</p></div>
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
    .required label { color: var(--color-text); }
    .req { color: var(--color-error); margin-left: 2px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); @media (max-width: 600px) { grid-template-columns: 1fr; } }
    .checkbox-group { display: flex; gap: var(--space-lg); }
    .checkbox { display: flex; align-items: center; gap: var(--space-sm); cursor: pointer; input { width: auto; } }
    .form-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-lg); }
    .list { display: flex; flex-direction: column; gap: var(--space-lg); }
    .item-card { display: flex; flex-direction: column; gap: var(--space-sm); }
    .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .item-header h4 { margin: 0; }
    .company { color: var(--color-primary); margin: 0; }
    .item-date { font-size: var(--text-sm); color: var(--color-text-muted); }
    .location { font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0; }
    .item-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-3xl); color: var(--color-text-muted); }
  `],
})
export class AdminExperienceComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  items: Experience[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;

  formData: any = this.emptyForm();
  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  ngOnInit() { this.load(); }

  load() {
    this.api.getExperience().subscribe({
      next: (e) => { this.items = []; this.cdr.detectChanges(); this.items = e; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load experience'),
    });
  }

  emptyForm() {
    return { position: { fa: '', en: '', de: '' }, company: { fa: '', en: '', de: '' }, description: { fa: '', en: '', de: '' }, startDate: '', endDate: '', isCurrent: false, location: '', includeInResume: false };
  }

  openNewForm() { this.editingId = null; this.formData = this.emptyForm(); this.showForm = true; }

  edit(item: Experience) {
    this.editingId = item.id;
    this.formData = { ...item, position: { ...item.position }, company: { ...item.company }, description: { ...item.description } };
    this.showForm = true;
  }

  save() {
    if (!this.formData.position.en && !this.formData.position.fa && !this.formData.position.de) { this.toast.warning('Position is required'); return; }
    if (!this.formData.company.en && !this.formData.company.fa && !this.formData.company.de) { this.toast.warning('Company is required'); return; }
    if (!this.formData.startDate) { this.toast.warning('Start date is required'); return; }

    this.saving = true;
    const wasEditing = !!this.editingId;
    const obs = this.editingId ? this.api.updateExperience(this.editingId, this.formData) : this.api.createExperience(this.formData);
    obs.subscribe({
      next: () => { this.saving = false; this.cancel(); this.load(); this.toast.success(wasEditing ? 'Experience updated!' : 'Experience created!'); },
      error: () => { this.saving = false; this.toast.error('Failed to save experience'); },
    });
  }

  cancel() { this.showForm = false; this.editingId = null; this.formData = this.emptyForm(); }
  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }
  deleteItem() {
    if (this.deleteId) {
      this.api.deleteExperience(this.deleteId).subscribe({
        next: () => { this.load(); this.showConfirm = false; this.toast.success('Experience deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete'); },
      });
    }
  }
  formatDate(d?: string) { return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''; }
}
