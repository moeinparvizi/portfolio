import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import type { Profile, Skill, Project, Experience, Education } from '../../../core/models';

@Component({
  selector: 'app-admin-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, TranslatePipe],
  template: `
    <div class="admin-page">
      <h1>Resume Builder</h1>

      <div class="resume-layout">
        <!-- Settings Panel -->
        <div class="settings-panel">
          <app-glass-card>
            <h3>Resume Settings</h3>

            <div class="form-group">
              <label>Language</label>
              <div class="lang-tabs">
                @for (lang of languages; track lang.code) {
                  <button type="button" class="tab" [class.active]="locale === lang.code" (click)="locale = lang.code">
                    {{ lang.label }}
                  </button>
                }
              </div>
            </div>

            <div class="form-group">
              <label>Template</label>
              <div class="template-grid">
                @for (tmpl of templates; track tmpl.id) {
                  <button class="template-btn" [class.active]="selectedTemplate === tmpl.id" (click)="selectedTemplate = tmpl.id">
                    <div class="template-preview" [class]="'template-' + tmpl.id">
                      <div class="mini-header"></div>
                      <div class="mini-content">
                        <div class="mini-line"></div>
                        <div class="mini-line short"></div>
                        <div class="mini-line"></div>
                      </div>
                    </div>
                    <span>{{ tmpl.name }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="form-group">
              <label>Photo</label>
              <div class="photo-options">
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="showPhoto" />
                  <span class="toggle-slider"></span>
                  <span>{{ showPhoto ? 'Show Photo' : 'No Photo' }}</span>
                </label>
              </div>

              @if (showPhoto) {
                <div class="photo-upload">
                  @if (profile?.avatarUrl) {
                    <div class="current-photo">
                      <img [src]="profile!.avatarUrl" alt="Current photo" />
                      <button class="btn btn-ghost btn-sm" (click)="removePhoto()">Remove</button>
                    </div>
                  }
                  <div class="upload-zone" (click)="fileInput.click()">
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
                    <span>📷 Click to upload photo</span>
                  </div>
                  @if (uploading) {
                    <p class="uploading">Uploading...</p>
                  }
                </div>
              }
            </div>

            <button class="btn btn-primary btn-lg full-width" (click)="generate()" [disabled]="generating">
              {{ generating ? 'Generating PDF...' : '📄 Generate Resume PDF' }}
            </button>
          </app-glass-card>
        </div>

        <!-- Preview Panel -->
        <div class="preview-panel">
          <app-glass-card>
            <h3>Preview</h3>
            <div class="resume-preview" [class]="'preview-' + selectedTemplate">
              <!-- Header -->
              <div class="preview-header">
                @if (showPhoto && profile?.avatarUrl) {
                  <img [src]="profile!.avatarUrl" alt="Photo" class="preview-photo" />
                }
                <div class="preview-header-text">
                  <h1>{{ profile?.fullName | translate }}</h1>
                  <p class="preview-job">{{ profile?.jobTitle | translate }}</p>
                </div>
              </div>

              <!-- Summary -->
              @if (profile?.summary; as summary) {
                <div class="preview-section">
                  <h2>{{ locale === 'fa' ? 'خلاصه' : locale === 'de' ? 'Zusammenfassung' : 'Summary' }}</h2>
                  <p>{{ summary | translate }}</p>
                </div>
              }

              <!-- Skills -->
              @if (skills.length > 0) {
                <div class="preview-section">
                  <h2>{{ locale === 'fa' ? 'مهارت‌ها' : locale === 'de' ? 'Fähigkeiten' : 'Skills' }}</h2>
                  <div class="preview-skills">
                    @for (skill of skills.slice(0, 8); track skill.id) {
                      <span class="skill-tag">{{ skill.name | translate }}</span>
                    }
                  </div>
                </div>
              }

              <!-- Experience -->
              @if (experience.length > 0) {
                <div class="preview-section">
                  <h2>{{ locale === 'fa' ? 'سوابق کاری' : locale === 'de' ? 'Berufserfahrung' : 'Experience' }}</h2>
                  @for (exp of experience.slice(0, 3); track exp.id) {
                    <div class="preview-item">
                      <div class="item-header">
                        <strong>{{ exp.position | translate }}</strong>
                        <span class="date">{{ formatDate(exp.startDate) }} – {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}</span>
                      </div>
                      <p class="item-subtitle">{{ exp.company | translate }}</p>
                    </div>
                  }
                </div>
              }

              <!-- Education -->
              @if (education.length > 0) {
                <div class="preview-section">
                  <h2>{{ locale === 'fa' ? 'تحصیلات' : locale === 'de' ? 'Bildung' : 'Education' }}</h2>
                  @for (edu of education.slice(0, 2); track edu.id) {
                    <div class="preview-item">
                      <div class="item-header">
                        <strong>{{ edu.degree | translate }}</strong>
                        <span class="date">{{ formatDate(edu.startDate) }}</span>
                      </div>
                      <p class="item-subtitle">{{ edu.institution | translate }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          </app-glass-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: var(--space-xl);
    }

    h1 {
      font-size: var(--text-2xl);
      margin: 0 0 var(--space-xl);
    }

    .resume-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: var(--space-xl);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .settings-panel h3, .preview-panel h3 {
      margin: 0 0 var(--space-lg);
    }

    .form-group {
      margin-bottom: var(--space-lg);

      label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--space-sm);
      }
    }

    .lang-tabs {
      display: flex;
      gap: var(--space-sm);
    }

    .tab {
      flex: 1;
      padding: var(--space-sm);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-family: var(--font-body);
      &.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-sm);
    }

    .template-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      background: transparent;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: var(--text-xs);

      &:hover { border-color: var(--color-primary); }
      &.active { border-color: var(--color-primary); background: rgba(37, 99, 235, 0.1); }
    }

    .template-preview {
      width: 50px;
      height: 65px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 4px;
      background: white;
    }

    .mini-header {
      height: 12px;
      background: var(--color-primary);
      border-radius: 2px;
      margin-bottom: 4px;
    }

    .mini-line {
      height: 3px;
      background: var(--color-border);
      border-radius: 1px;
      margin-bottom: 2px;

      &.short { width: 60%; }
    }

    .photo-options {
      margin-bottom: var(--space-md);
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      cursor: pointer;

      input { display: none; }

      .toggle-slider {
        width: 50px;
        height: 26px;
        background: var(--color-border);
        border-radius: 13px;
        position: relative;
        transition: background var(--transition-fast);

        &::after {
          content: '';
          position: absolute;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform var(--transition-fast);
        }
      }

      input:checked + .toggle-slider {
        background: var(--color-primary);
        &::after { transform: translateX(24px); }
      }
    }

    .photo-upload {
      margin-top: var(--space-md);
    }

    .current-photo {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .upload-zone {
      padding: var(--space-lg);
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-md);
      text-align: center;
      cursor: pointer;
      color: var(--color-text-muted);
      transition: border-color var(--transition-fast);

      &:hover { border-color: var(--color-primary); }
    }

    .uploading {
      color: var(--color-primary);
      font-size: var(--text-sm);
      margin-top: var(--space-sm);
    }

    .full-width { width: 100%; }

    /* Preview Styles */
    .resume-preview {
      background: white;
      color: #1a1a2e;
      padding: 24px;
      border-radius: var(--radius-md);
      font-size: 11px;
      line-height: 1.5;
      min-height: 400px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #2563EB;
    }

    .preview-photo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2563EB;
    }

    .preview-header-text h1 {
      font-size: 18px;
      margin: 0;
      color: #0f172a;
    }

    .preview-job {
      color: #2563EB;
      font-weight: 500;
      margin: 2px 0 0;
    }

    .preview-section {
      margin-bottom: 14px;

      h2 {
        font-size: 12px;
        color: #2563EB;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid #e2e8f0;
      }

      p {
        color: #475569;
        margin: 0;
      }
    }

    .preview-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .skill-tag {
      background: #eff6ff;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
    }

    .preview-item {
      margin-bottom: 10px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
    }

    .item-subtitle {
      color: #475569;
      margin: 2px 0 0;
      font-size: 10px;
    }

    .date {
      font-size: 10px;
      color: #64748b;
    }

    /* Template Variations */
    .preview-modern .preview-header { border-bottom-color: #7C3AED; }
    .preview-modern .preview-photo { border-color: #7C3AED; }
    .preview-modern .preview-job { color: #7C3AED; }
    .preview-modern .preview-section h2 { color: #7C3AED; }
    .preview-modern .skill-tag { background: #f3e8ff; color: #6b21a8; }

    .preview-minimal .preview-header { border-bottom: 1px solid #e2e8f0; }
    .preview-minimal .preview-photo { border: 1px solid #e2e8f0; }
    .preview-minimal .preview-section h2 { color: #1a1a2e; border-bottom: 1px solid #e2e8f0; }
    .preview-minimal .skill-tag { background: #f1f5f9; color: #475569; }
  `],
})
export class AdminResumeComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  locale = 'en';
  showPhoto = true;
  selectedTemplate = 'classic';
  generating = false;
  uploading = false;

  profile: Profile | null = null;
  skills: Skill[] = [];
  experience: Experience[] = [];
  education: Education[] = [];

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  templates = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getProfile().subscribe(p => {
      this.profile = p;
      this.cdr.detectChanges();
    });
    this.api.getSkills().subscribe(s => this.skills = s);
    this.api.getExperience().subscribe(e => this.experience = e);
    this.api.getEducation().subscribe(e => this.education = e);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', file);

    // Upload to a hypothetical endpoint or use base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Save to profile
      this.api.updateProfile({ avatarUrl: base64 }).subscribe({
        next: (p) => {
          this.profile = p;
          this.uploading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.uploading = false;
        },
      });
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.api.updateProfile({ avatarUrl: '' }).subscribe({
      next: (p) => {
        this.profile = p;
        this.cdr.detectChanges();
      },
    });
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  generate() {
    this.generating = true;
    this.api.generateResume(this.locale, this.showPhoto).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${this.locale}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.generating = false;
      },
      error: () => {
        this.generating = false;
        alert('Failed to generate resume');
      },
    });
  }
}
