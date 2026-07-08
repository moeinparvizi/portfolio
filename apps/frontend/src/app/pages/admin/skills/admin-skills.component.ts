import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Skill } from '../../../core/models';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Skills Management</h1>
        <button class="btn btn-primary" (click)="openNewForm()">
          + Add New Skill
        </button>
      </div>

      <!-- Edit Form -->
      @if (showForm) {
        <app-glass-card>
          <div class="form-header">
            <h3>{{ editingId ? 'Edit Skill' : 'New Skill' }}</h3>
            <button class="btn btn-ghost btn-sm" (click)="cancel()">✕</button>
          </div>

          <form (ngSubmit)="save()">
            <!-- Language Tabs -->
            <div class="lang-tabs">
              @for (lang of languages; track lang.code) {
                <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                  {{ lang.label }}
                </button>
              }
            </div>

            <div class="form-group">
              <label>Skill Name ({{ activeLang.toUpperCase() }})</label>
              <input type="text" [(ngModel)]="formData.name[activeLang]" [name]="'name_' + activeLang" placeholder="e.g., Angular, React, Node.js" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <input type="text" [(ngModel)]="formData.category" name="category" placeholder="e.g., Frontend, Backend, DevOps" />
              </div>
              <div class="form-group">
                <label>Proficiency Level</label>
                <div class="level-selector">
                  @for (level of [1,2,3,4,5]; track level) {
                    <button type="button" class="level-btn" [class.active]="formData.level === level" (click)="formData.level = level">
                      {{ level }}
                    </button>
                  }
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Icon URL (optional)</label>
              <input type="text" [(ngModel)]="formData.icon" name="icon" placeholder="https://..." />
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="cancel()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                {{ saving ? 'Saving...' : (editingId ? 'Update Skill' : 'Create Skill') }}
              </button>
            </div>

            @if (error) {
              <p class="error">{{ error }}</p>
            }
          </form>
        </app-glass-card>
      }

      <!-- Skills List -->
      <div class="skills-grid">
        @for (skill of skills; track skill.id) {
          <app-glass-card>
            <div class="skill-card">
              <div class="skill-header">
                <h4>{{ skill.name['en'] || skill.name['fa'] || 'Untitled' }}</h4>
                <div class="skill-actions">
                  <button class="btn btn-ghost btn-sm" (click)="edit(skill)">Edit</button>
                  <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(skill.id)">Delete</button>
                </div>
              </div>

              @if (skill.category) {
                <span class="skill-category">{{ skill.category }}</span>
              }

              @if (skill.level) {
                <div class="skill-level">
                  @for (i of [1,2,3,4,5]; track i) {
                    <span class="dot" [class.filled]="i <= skill.level!"></span>
                  }
                </div>
              }

              <div class="skill-names">
                <span class="lang-badge">EN: {{ skill.name['en'] || '-' }}</span>
                <span class="lang-badge">FA: {{ skill.name['fa'] || '-' }}</span>
                <span class="lang-badge">DE: {{ skill.name['de'] || '-' }}</span>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No skills yet. Click "Add New Skill" to create one.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteSkill()"
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

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);

      h3 {
        margin: 0;
        font-size: var(--text-xl);
      }
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
      transition: all var(--transition-fast);

      &.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
    }

    .form-group {
      margin-bottom: var(--space-lg);

      label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--space-sm);
        color: var(--color-text);
      }

      input {
        width: 100%;
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        color: var(--color-text);
        font-family: var(--font-body);
        transition: border-color var(--transition-fast);

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        &::placeholder {
          color: var(--color-text-muted);
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .level-selector {
      display: flex;
      gap: var(--space-sm);
    }

    .level-btn {
      width: 40px;
      height: 40px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: var(--text-lg);
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }

      &.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }
    }

    .form-actions {
      display: flex;
      gap: var(--space-sm);
      justify-content: flex-end;
      margin-top: var(--space-lg);
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      h4 {
        margin: 0;
        font-size: var(--text-lg);
      }
    }

    .skill-actions {
      display: flex;
      gap: var(--space-xs);
    }

    .skill-category {
      display: inline-block;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: rgba(37, 99, 235, 0.1);
      color: var(--color-primary);
      font-size: var(--text-xs);
      font-weight: 500;
      width: fit-content;
    }

    .skill-level {
      display: flex;
      gap: 4px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-border);

      &.filled {
        background: var(--color-primary);
      }
    }

    .skill-names {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-top: var(--space-sm);
    }

    .lang-badge {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      padding: 2px 6px;
      background: var(--color-surface-alt);
      border-radius: var(--radius-sm);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }

    .btn-danger {
      color: var(--color-error);

      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .error {
      color: var(--color-error);
      margin-top: var(--space-md);
      text-align: center;
    }
  `],
})
export class AdminSkillsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  skills: Skill[] = [];
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

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getSkills().subscribe({
      next: (s) => {
        this.skills = s;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading skills:', err);
      },
    });
  }

  emptyForm() {
    return {
      name: { fa: '', en: '', de: '' },
      category: '',
      level: 3,
      icon: '',
      sortOrder: 0,
    };
  }

  openNewForm() {
    this.editingId = null;
    this.formData = this.emptyForm();
    this.showForm = true;
    this.error = '';
    this.activeLang = 'en';
  }

  edit(skill: Skill) {
    this.editingId = skill.id;
    this.formData = {
      name: { ...(skill.name || { en: '', fa: '', de: '' }) },
      category: skill.category || '',
      level: skill.level || 3,
      icon: skill.icon || '',
      sortOrder: skill.sortOrder || 0,
    };
    this.showForm = true;
    this.error = '';
    this.activeLang = 'en';
  }

  save() {
    if (!this.formData.name.en && !this.formData.name.fa && !this.formData.name.de) {
      this.error = 'Please enter at least one skill name';
      return;
    }

    this.saving = true;
    this.error = '';

    const data = {
      name: this.formData.name,
      category: this.formData.category,
      level: this.formData.level,
      icon: this.formData.icon,
      sortOrder: this.formData.sortOrder,
    };

    const obs = this.editingId
      ? this.api.updateSkill(this.editingId, data)
      : this.api.createSkill(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.cancel();
        this.load();
      },
      error: (err) => {
        console.error('Error saving skill:', err);
        this.saving = false;
        this.error = 'Failed to save skill';
      },
    });
  }

  cancel() {
    this.showForm = false;
    this.editingId = null;
    this.formData = this.emptyForm();
    this.error = '';
  }

  confirmDelete(id: string) {
    this.deleteId = id;
    this.showConfirm = true;
  }

  deleteSkill() {
    if (this.deleteId) {
      this.api.deleteSkill(this.deleteId).subscribe({
        next: () => {
          this.load();
          this.showConfirm = false;
        },
        error: (err) => {
          console.error('Error deleting skill:', err);
          this.showConfirm = false;
        },
      });
    }
  }
}
