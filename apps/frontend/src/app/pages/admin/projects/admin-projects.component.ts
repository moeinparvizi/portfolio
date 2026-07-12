import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import type { Project } from '../../../core/models';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent, ModalComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Projects Management</h1>
        <button class="btn btn-primary" (click)="openNewForm()">+ Add New Project</button>
      </div>

      <!-- Edit Modal -->
      <app-modal [open]="showForm" [title]="editingId ? 'Edit Project' : 'New Project'" (close)="cancel()">
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
            <input type="text" [(ngModel)]="formData.title[activeLang]" [name]="'title_' + activeLang" placeholder="Project name" required />
          </div>

          <div class="form-group">
            <label>Summary ({{ activeLang.toUpperCase() }})</label>
            <textarea [(ngModel)]="formData.summary[activeLang]" [name]="'summary_' + activeLang" rows="2" placeholder="Short description for cards"></textarea>
          </div>

          <div class="form-group">
            <label>Description ({{ activeLang.toUpperCase() }})</label>
            <textarea [(ngModel)]="formData.description[activeLang]" [name]="'desc_' + activeLang" rows="4" placeholder="Full project description"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" [(ngModel)]="tagsInput" name="tags" placeholder="Angular, TypeScript, Node.js" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" [(ngModel)]="formData.category" name="category" placeholder="Web App, Mobile, etc." />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Live URL</label>
              <input type="text" [(ngModel)]="formData.liveUrl" name="liveUrl" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>GitHub URL</label>
              <input type="text" [(ngModel)]="formData.githubUrl" name="githubUrl" placeholder="https://github.com/..." />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="formData.status" name="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div class="form-group">
              <label>Options</label>
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" [(ngModel)]="formData.featured" name="featured" />
                  <span>Featured</span>
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
              {{ saving ? 'Saving...' : (editingId ? 'Update Project' : 'Create Project') }}
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Projects List -->
      <div class="list">
        @for (project of projects; track project.id) {
          <app-glass-card>
            <div class="project-card">
              <div class="project-header">
                <div class="project-info">
                  <h4>{{ project.title['en'] || project.title['fa'] || 'Untitled' }}</h4>
                  @if (project.category) {
                    <span class="category">{{ project.category }}</span>
                  }
                </div>
                <div class="project-badges">
                  <span class="badge" [class]="project.status">{{ project.status }}</span>
                  @if (project.featured) {
                    <span class="badge featured">Featured</span>
                  }
                </div>
              </div>

              <p class="project-summary">{{ project.summary['en'] || '' }}</p>

              <div class="project-tags">
                @for (tag of project.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>

              <div class="project-actions">
                <button class="btn btn-ghost btn-sm" (click)="edit(project)">Edit</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(project.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No projects yet. Click "Add New Project" to create one.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteProject()"
        (cancel)="showConfirm = false"
      />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 1000px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); h1 { font-size: var(--text-2xl); margin: 0; } }
    .lang-tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-lg); }
    .tab { padding: var(--space-sm) var(--space-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-family: var(--font-body); &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); } }
    .form-group { margin-bottom: var(--space-lg); label { display: block; font-weight: 500; margin-bottom: var(--space-sm); } input, textarea, select { width: 100%; padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-text); font-family: var(--font-body); &:focus { outline: none; border-color: var(--color-primary); } } }
    .required label { color: var(--color-text); }
    .req { color: var(--color-error); margin-left: 2px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); @media (max-width: 600px) { grid-template-columns: 1fr; } }
    .checkbox-group { display: flex; gap: var(--space-lg); }
    .checkbox { display: flex; align-items: center; gap: var(--space-sm); cursor: pointer; input { width: auto; } }
    .form-actions { display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-border); }
    .list { display: flex; flex-direction: column; gap: var(--space-lg); }
    .project-card { display: flex; flex-direction: column; gap: var(--space-sm); }
    .project-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .project-info h4 { margin: 0; }
    .project-badges { display: flex; gap: var(--space-sm); }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.draft { background: var(--color-warning); color: white; } &.published { background: var(--color-success); color: white; } &.featured { background: var(--color-primary); color: white; } }
    .project-summary { color: var(--color-text-secondary); font-size: var(--text-sm); margin: 0; }
    .project-tags { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
    .tag { padding: 2px 8px; border-radius: var(--radius-sm); background: rgba(99, 102, 241, 0.1); color: var(--color-primary); font-size: var(--text-xs); }
    .project-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
    .btn-danger { color: var(--color-error); &:hover { background: rgba(239, 68, 68, 0.1); } }
    .empty-state { text-align: center; padding: var(--space-3xl); color: var(--color-text-muted); }
  `],
})
export class AdminProjectsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  projects: Project[] = [];
  showForm = false;
  editingId: string | null = null;
  activeLang: 'fa' | 'en' | 'de' = 'en';
  showConfirm = false;
  deleteId: string | null = null;
  saving = false;
  error = '';
  tagsInput = '';

  formData: any = this.emptyForm();

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  ngOnInit() { this.load(); }

  load() {
    this.api.getProjects().subscribe({
      next: (p) => { this.projects = []; this.cdr.detectChanges(); this.projects = p; this.cdr.detectChanges(); },
      error: () => this.toast.error('Failed to load projects'),
    });
  }

  emptyForm() {
    return {
      title: { fa: '', en: '', de: '' },
      summary: { fa: '', en: '', de: '' },
      description: { fa: '', en: '', de: '' },
      tags: [],
      category: '',
      liveUrl: '',
      githubUrl: '',
      status: 'draft',
      featured: false,
      includeInResume: false,
    };
  }

  openNewForm() {
    this.editingId = null;
    this.formData = this.emptyForm();
    this.tagsInput = '';
    this.showForm = true;
    this.error = '';
  }

  edit(project: Project) {
    this.editingId = project.id;
    this.formData = {
      title: { ...(project.title || { en: '', fa: '', de: '' }) },
      summary: { ...(project.summary || { en: '', fa: '', de: '' }) },
      description: { ...(project.description || { en: '', fa: '', de: '' }) },
      tags: project.tags || [],
      category: project.category || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      status: project.status,
      featured: project.featured,
      includeInResume: project.includeInResume,
    };
    this.tagsInput = (project.tags || []).join(', ');
    this.showForm = true;
    this.error = '';
  }

  save() {
    if (!this.formData.title.en && !this.formData.title.fa && !this.formData.title.de) {
      this.error = 'Title is required in at least one language';
      this.toast.warning('Please enter a project title');
      return;
    }

    this.saving = true;
    this.error = '';

    const data = {
      ...this.formData,
      tags: this.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    const obs = this.editingId
      ? this.api.updateProject(this.editingId, data)
      : this.api.createProject(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        const wasEditing = !!this.editingId;
        this.cancel();
        this.load();
        this.toast.success(wasEditing ? 'Project updated!' : 'Project created!');
      },
      error: (err) => {
        console.error('Error saving project:', err);
        this.saving = false;
        this.error = 'Failed to save project';
        this.toast.error('Failed to save project');
      },
    });
  }

  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.formData = this.emptyForm();
    this.tagsInput = '';
    this.error = '';
  }

  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }

  deleteProject() {
    if (this.deleteId) {
      this.api.deleteProject(this.deleteId).subscribe({
        next: () => { this.load(); this.showConfirm = false; this.toast.success('Project deleted!'); },
        error: () => { this.showConfirm = false; this.toast.error('Failed to delete project'); },
      });
    }
  }
}
