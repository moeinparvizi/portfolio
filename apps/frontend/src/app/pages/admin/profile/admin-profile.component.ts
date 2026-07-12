import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import type { Profile } from '../../../core/models';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent, TranslatePipe],
  template: `
    <div class="admin-page">
      <h1>Edit Profile</h1>

      <div class="profile-layout">
        <!-- Form Panel -->
        <div class="form-panel">
          @if (loading) {
            <app-glass-card>
              <p>Loading profile...</p>
            </app-glass-card>
          }

          @if (profile; as p) {
            <app-glass-card>
              <form (ngSubmit)="save()">
                <!-- Photo Upload -->
                <div class="photo-section">
                  <div class="photo-preview">
                    @if (formData.avatarUrl) {
                      <img [src]="formData.avatarUrl" alt="Avatar" />
                    } @else {
                      <div class="photo-placeholder">
                        {{ formData.fullName['en']?.charAt(0) || '?' }}
                      </div>
                    }
                  </div>
                  <div class="photo-actions">
                    <button type="button" class="btn btn-ghost btn-sm" (click)="fileInput.click()">
                      📷 Upload Photo
                    </button>
                    @if (formData.avatarUrl) {
                      <button type="button" class="btn btn-ghost btn-sm btn-danger" (click)="removePhoto()">
                        Remove
                      </button>
                    }
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
                    @if (uploading) {
                      <span class="uploading">Uploading...</span>
                    }
                  </div>
                </div>

                <!-- Language Tabs -->
                <div class="lang-tabs">
                  @for (lang of languages; track lang.code) {
                    <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
                      {{ lang.label }}
                    </button>
                  }
                </div>

                <div class="form-group">
                  <label>Full Name ({{ activeLang.toUpperCase() }})</label>
                  <input type="text" [(ngModel)]="formData.fullName[activeLang]" [name]="'fullName_' + activeLang" />
                </div>

                <div class="form-group">
                  <label>Job Title ({{ activeLang.toUpperCase() }})</label>
                  <input type="text" [(ngModel)]="formData.jobTitle[activeLang]" [name]="'jobTitle_' + activeLang" />
                </div>

                <div class="form-group">
                  <label>Summary ({{ activeLang.toUpperCase() }})</label>
                  <textarea [(ngModel)]="formData.summary[activeLang]" [name]="'summary_' + activeLang" rows="4"></textarea>
                </div>

                <div class="form-group">
                  <label>Hero Text ({{ activeLang.toUpperCase() }})</label>
                  <input type="text" [(ngModel)]="formData.heroText[activeLang]" [name]="'heroText_' + activeLang" />
                </div>

                <div class="form-group">
                  <label>Hero CTA Label ({{ activeLang.toUpperCase() }})</label>
                  <input type="text" [(ngModel)]="formData.heroCtaLabel[activeLang]" [name]="'ctaLabel_' + activeLang" />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input type="email" [(ngModel)]="formData.socialLinks.email" name="email" placeholder="your@email.com" />
                </div>

                <div class="form-group">
                  <label>GitHub URL</label>
                  <input type="text" [(ngModel)]="formData.socialLinks.github" name="github" placeholder="https://github.com/..." />
                </div>

                <div class="form-group">
                  <label>LinkedIn URL</label>
                  <input type="text" [(ngModel)]="formData.socialLinks.linkedin" name="linkedin" placeholder="https://linkedin.com/..." />
                </div>

                <div class="form-group">
                  <label>Twitter URL</label>
                  <input type="text" [(ngModel)]="formData.socialLinks.twitter" name="twitter" placeholder="https://twitter.com/..." />
                </div>

                <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
                  {{ saving ? 'Saving...' : 'Save Profile' }}
                </button>

                @if (saved) {
                  <p class="success">✅ Profile saved successfully!</p>
                }
                @if (error) {
                  <p class="error">{{ error }}</p>
                }
              </form>
            </app-glass-card>
          }
        </div>

        <!-- Preview Panel -->
        <div class="preview-panel">
          <app-glass-card>
            <h3>📱 Live Preview</h3>
            <div class="preview-card">
              <!-- Hero Preview -->
              <div class="preview-hero">
                @if (formData.avatarUrl) {
                  <img [src]="formData.avatarUrl" alt="Avatar" class="preview-avatar" />
                }
                <h1>{{ formData.fullName['en'] || 'Your Name' }}</h1>
                <p class="preview-job">{{ formData.jobTitle['en'] || 'Your Job Title' }}</p>
                <p class="preview-summary">{{ formData.summary['en'] || 'Your summary...' }}</p>
              </div>

              <!-- CTA Preview -->
              <div class="preview-cta">
                <span class="preview-btn">{{ formData.heroCtaLabel['en'] || 'View My Work' }}</span>
              </div>

              <!-- Social Preview -->
              <div class="preview-social">
                @if (formData.socialLinks.github) {
                  <span class="social-link">GitHub</span>
                }
                @if (formData.socialLinks.linkedin) {
                  <span class="social-link">LinkedIn</span>
                }
              </div>
            </div>

            <a href="http://localhost:4200/en" target="_blank" class="btn btn-ghost full-width">
              Open Public Site ↗
            </a>
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

    .profile-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--space-xl);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .lang-tabs {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
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

    .photo-section {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
      padding-bottom: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .photo-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .photo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary);
      color: white;
      font-size: var(--text-2xl);
      font-weight: 700;
    }

    .photo-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .uploading {
      font-size: var(--text-sm);
      color: var(--color-primary);
    }

    .success {
      color: var(--color-success);
      margin-top: var(--space-md);
    }

    .error {
      color: var(--color-error);
      margin-top: var(--space-md);
    }

    .btn-danger {
      color: var(--color-error);
      &:hover { background: rgba(239, 68, 68, 0.1); }
    }

    .full-width { width: 100%; }

    /* Preview Panel */
    .preview-panel h3 {
      margin: 0 0 var(--space-lg);
    }

    .preview-card {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      color: white;
      margin-bottom: var(--space-lg);
    }

    .preview-hero {
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    .preview-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(255,255,255,0.2);
      margin-bottom: var(--space-md);
    }

    .preview-hero h1 {
      font-size: var(--text-xl);
      margin: 0 0 var(--space-xs);
      color: white;
    }

    .preview-job {
      color: #60a5fa;
      font-weight: 500;
      margin: 0 0 var(--space-sm);
    }

    .preview-summary {
      font-size: var(--text-sm);
      color: rgba(255,255,255,0.7);
      margin: 0;
    }

    .preview-cta {
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    .preview-btn {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      background: #2563EB;
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .preview-social {
      display: flex;
      justify-content: center;
      gap: var(--space-md);
    }

    .social-link {
      font-size: var(--text-sm);
      color: rgba(255,255,255,0.6);
    }
  `],
})
export class AdminProfileComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  profile: Profile | null = null;
  formData: any = {};
  activeLang: 'fa' | 'en' | 'de' = 'en';
  socialLinksJson = '{}';
  saving = false;
  saved = false;
  loading = true;
  error = '';
  uploading = false;

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.api.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.formData = {
          fullName: { ...(p.fullName || { en: '', fa: '', de: '' }) },
          jobTitle: { ...(p.jobTitle || { en: '', fa: '', de: '' }) },
          summary: { ...(p.summary || { en: '', fa: '', de: '' }) },
          heroText: { ...(p.heroText || { en: '', fa: '', de: '' }) },
          heroCtaLabel: { ...(p.heroCtaLabel || { en: '', fa: '', de: '' }) },
          avatarUrl: p.avatarUrl || '',
          logoUrl: p.logoUrl || '',
          heroCtaLink: p.heroCtaLink || '',
          socialLinks: { email: '', github: '', linkedin: '', twitter: '', ...(p.socialLinks || {}) },
        };
        this.socialLinksJson = JSON.stringify(p.socialLinks || {}, null, 2);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load profile';
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.formData.avatarUrl = base64;
      this.uploading = false;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.formData.avatarUrl = '';
  }

  save() {
    if (!this.profile) return;
    this.saving = true;
    this.error = '';

    const data = {
      fullName: this.formData.fullName,
      jobTitle: this.formData.jobTitle,
      summary: this.formData.summary,
      heroText: this.formData.heroText,
      heroCtaLabel: this.formData.heroCtaLabel,
      avatarUrl: this.formData.avatarUrl,
      logoUrl: this.formData.logoUrl,
      heroCtaLink: this.formData.heroCtaLink,
      socialLinks: this.formData.socialLinks,
    };

    this.api.updateProfile(data).subscribe({
      next: (result) => {
        this.saving = false;
        this.saved = true;
        this.profile = result;
        this.toast.success('Profile saved successfully!');
        setTimeout(() => this.saved = false, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Failed to save profile';
        this.toast.error('Failed to save profile');
        this.cdr.detectChanges();
      },
    });
  }
}
