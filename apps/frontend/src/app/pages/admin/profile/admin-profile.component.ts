import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import type { Profile } from '../../../core/models';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <div class="admin-page">
      <h1>Edit Profile</h1>

      @if (loading) {
        <p>Loading profile...</p>
      }

      @if (profile; as p) {
        <app-glass-card>
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
              <label>Avatar URL</label>
              <input type="text" [(ngModel)]="formData.avatarUrl" name="avatarUrl" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label>Social Links (JSON)</label>
              <textarea [(ngModel)]="socialLinksJson" name="socialLinks" rows="3" placeholder='{"github":"...","linkedin":"..."}'></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>

            @if (saved) {
              <p class="success">Profile saved successfully!</p>
            }
            @if (error) {
              <p class="error">{{ error }}</p>
            }
          </form>
        </app-glass-card>
      }
    </div>
  `,
  styles: [`
    .admin-page {
      padding: var(--space-xl);
      max-width: 800px;
    }

    .lang-tabs {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
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
      }

      input, textarea {
        width: 100%;
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        color: var(--color-text);
        font-family: var(--font-body);

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }
    }

    .success {
      color: var(--color-success);
      margin-top: var(--space-md);
    }

    .error {
      color: var(--color-error);
      margin-top: var(--space-md);
    }
  `],
})
export class AdminProfileComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  profile: Profile | null = null;
  formData: any = {};
  activeLang: 'fa' | 'en' | 'de' = 'en';
  socialLinksJson = '{}';
  saving = false;
  saved = false;
  loading = true;
  error = '';

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
        // Create deep copy for form data
        this.formData = {
          fullName: { ...(p.fullName || { en: '', fa: '', de: '' }) },
          jobTitle: { ...(p.jobTitle || { en: '', fa: '', de: '' }) },
          summary: { ...(p.summary || { en: '', fa: '', de: '' }) },
          heroText: { ...(p.heroText || { en: '', fa: '', de: '' }) },
          heroCtaLabel: { ...(p.heroCtaLabel || { en: '', fa: '', de: '' }) },
          avatarUrl: p.avatarUrl || '',
          logoUrl: p.logoUrl || '',
          heroCtaLink: p.heroCtaLink || '',
        };
        this.socialLinksJson = JSON.stringify(p.socialLinks || {}, null, 2);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
        this.error = 'Failed to load profile';
        this.cdr.detectChanges();
      },
    });
  }

  save() {
    if (!this.profile) return;
    this.saving = true;
    this.error = '';

    let socialLinks = {};
    try {
      socialLinks = JSON.parse(this.socialLinksJson);
    } catch {
      this.error = 'Invalid JSON in Social Links';
      this.saving = false;
      return;
    }

    const data = {
      fullName: this.formData.fullName,
      jobTitle: this.formData.jobTitle,
      summary: this.formData.summary,
      heroText: this.formData.heroText,
      heroCtaLabel: this.formData.heroCtaLabel,
      avatarUrl: this.formData.avatarUrl,
      logoUrl: this.formData.logoUrl,
      heroCtaLink: this.formData.heroCtaLink,
      socialLinks: socialLinks,
    };

    this.api.updateProfile(data).subscribe({
      next: (result) => {
        this.saving = false;
        this.saved = true;
        this.profile = result;
        setTimeout(() => this.saved = false, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.saving = false;
        this.error = 'Failed to save profile: ' + (err.error?.message || 'Unknown error');
        this.cdr.detectChanges();
      },
    });
  }
}
