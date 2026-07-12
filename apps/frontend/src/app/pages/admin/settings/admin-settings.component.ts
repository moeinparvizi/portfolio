import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import type { SiteSettings } from '../../../core/models';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <div class="admin-page">
      <h1>Site Settings</h1>

      <!-- Theme Settings -->
      <app-glass-card>
        <div class="section-header">
          <h3>🎨 Theme Settings</h3>
          <span class="badge" [class.saved]="themeSaved">{{ themeSaved ? 'Saved!' : '' }}</span>
        </div>

        <div class="theme-form">
          <div class="form-row">
            <div class="form-group">
              <label>Primary Color</label>
              <div class="color-input">
                <input type="color" [(ngModel)]="themeData.primaryColor" (change)="updateThemePreview()" />
                <input type="text" [(ngModel)]="themeData.primaryColor" (change)="updateThemePreview()" />
              </div>
            </div>
            <div class="form-group">
              <label>Secondary Color</label>
              <div class="color-input">
                <input type="color" [(ngModel)]="themeData.secondaryColor" (change)="updateThemePreview()" />
                <input type="text" [(ngModel)]="themeData.secondaryColor" (change)="updateThemePreview()" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Accent Color</label>
              <div class="color-input">
                <input type="color" [(ngModel)]="themeData.accentColor" (change)="updateThemePreview()" />
                <input type="text" [(ngModel)]="themeData.accentColor" (change)="updateThemePreview()" />
              </div>
            </div>
            <div class="form-group">
              <label>Default Mode</label>
              <div class="mode-toggle">
                <button [class.active]="themeData.defaultMode === 'light'" (click)="themeData.defaultMode = 'light'; updateThemePreview()">
                  ☀️ Light
                </button>
                <button [class.active]="themeData.defaultMode === 'dark'" (click)="themeData.defaultMode = 'dark'; updateThemePreview()">
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>

          <!-- Live Preview -->
          <div class="preview-section">
            <h4>Preview</h4>
            <div class="preview-card" [style.background]="themeData.defaultMode === 'dark' ? '#1E293B' : '#FFFFFF'">
              <div class="preview-button" [style.background]="themeData.primaryColor">Primary Button</div>
              <div class="preview-accent" [style.background]="themeData.accentColor">Accent Element</div>
              <div class="preview-secondary" [style.border-color]="themeData.secondaryColor">Secondary Border</div>
            </div>
          </div>

          <button class="btn btn-primary" (click)="saveTheme()" [disabled]="savingTheme">
            {{ savingTheme ? 'Saving...' : 'Save Theme' }}
          </button>
        </div>
      </app-glass-card>

      <!-- General Settings -->
      <app-glass-card>
        <div class="section-header">
          <h3>⚙️ General Settings</h3>
          <span class="badge" [class.saved]="generalSaved">{{ generalSaved ? 'Saved!' : '' }}</span>
        </div>

        <div class="form-group">
          <label>Default Language</label>
          <select [(ngModel)]="generalData.defaultLanguage">
            <option value="en">English</option>
            <option value="fa">فارسی (Farsi)</option>
            <option value="de">Deutsch (German)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Maintenance Mode</label>
          <label class="toggle">
            <input type="checkbox" [(ngModel)]="generalData.maintenanceMode" />
            <span class="toggle-slider"></span>
            <span>{{ generalData.maintenanceMode ? 'Enabled' : 'Disabled' }}</span>
          </label>
        </div>

        <div class="form-group">
          <label>Analytics Enabled</label>
          <label class="toggle">
            <input type="checkbox" [(ngModel)]="generalData.analyticsEnabled" />
            <span class="toggle-slider"></span>
            <span>{{ generalData.analyticsEnabled ? 'Enabled' : 'Disabled' }}</span>
          </label>
        </div>

        <button class="btn btn-primary" (click)="saveGeneral()" [disabled]="savingGeneral">
          {{ savingGeneral ? 'Saving...' : 'Save General Settings' }}
        </button>
      </app-glass-card>

      <!-- Footer Settings -->
      <app-glass-card>
        <div class="section-header">
          <h3>🔗 Footer Settings</h3>
          <span class="badge" [class.saved]="footerSaved">{{ footerSaved ? 'Saved!' : '' }}</span>
        </div>

        <div class="lang-tabs">
          @for (lang of languages; track lang.code) {
            <button type="button" class="tab" [class.active]="activeLang === lang.code" (click)="activeLang = lang.code">
              {{ lang.label }}
            </button>
          }
        </div>

        <div class="form-group">
          <label>Copyright Text ({{ activeLang.toUpperCase() }})</label>
          <input type="text" [(ngModel)]="footerData.copyrightText[activeLang]" [name]="'copyright_' + activeLang" />
        </div>

        <div class="form-group">
          <label>GitHub URL</label>
          <input type="text" [(ngModel)]="footerData.socialLinks.github" name="github" placeholder="https://github.com/..." />
        </div>

        <div class="form-group">
          <label>LinkedIn URL</label>
          <input type="text" [(ngModel)]="footerData.socialLinks.linkedin" name="linkedin" placeholder="https://linkedin.com/..." />
        </div>

        <div class="form-group">
          <label>Twitter URL</label>
          <input type="text" [(ngModel)]="footerData.socialLinks.twitter" name="twitter" placeholder="https://twitter.com/..." />
        </div>

        <!-- Footer Preview -->
        <div class="preview-section">
          <h4>Footer Preview</h4>
          <div class="footer-preview">
            <p>{{ footerData.copyrightText[activeLang] }}</p>
            <div class="preview-links">
              @if (footerData.socialLinks.github) {
                <span>GitHub</span>
              }
              @if (footerData.socialLinks.linkedin) {
                <span>LinkedIn</span>
              }
              @if (footerData.socialLinks.twitter) {
                <span>Twitter</span>
              }
            </div>
          </div>
        </div>

        <button class="btn btn-primary" (click)="saveFooter()" [disabled]="savingFooter">
          {{ savingFooter ? 'Saving...' : 'Save Footer Settings' }}
        </button>
      </app-glass-card>

      <!-- SEO Settings -->
      <app-glass-card>
        <div class="section-header">
          <h3>🔍 SEO Settings</h3>
          <span class="badge" [class.saved]="seoSaved">{{ seoSaved ? 'Saved!' : '' }}</span>
        </div>

        <p class="info">SEO settings are configured per page in the admin dashboard.</p>

        <button class="btn btn-ghost" (click)="exportSettings()">
          📥 Export All Settings (JSON)
        </button>
      </app-glass-card>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: var(--space-xl);
      max-width: 900px;
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    h1 {
      font-size: var(--text-2xl);
      margin: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);

      h3 { margin: 0; }
    }

    .badge {
      font-size: var(--text-xs);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      color: var(--color-success);
      opacity: 0;
      transition: opacity var(--transition-fast);

      &.saved { opacity: 1; }
    }

    .theme-form, .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
    }

    .form-group {
      label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--space-sm);
      }

      input, select {
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

    .color-input {
      display: flex;
      gap: var(--space-sm);

      input[type="color"] {
        width: 50px;
        height: 40px;
        padding: 0;
        cursor: pointer;
      }

      input[type="text"] {
        flex: 1;
      }
    }

    .mode-toggle {
      display: flex;
      gap: var(--space-sm);

      button {
        flex: 1;
        padding: var(--space-md);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: transparent;
        cursor: pointer;
        font-family: var(--font-body);

        &.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
      }
    }

    .preview-section {
      margin: var(--space-lg) 0;

      h4 {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        margin-bottom: var(--space-md);
      }
    }

    .preview-card {
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }

    .preview-button {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      color: white;
      font-size: var(--text-sm);
    }

    .preview-accent {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      color: white;
      font-size: var(--text-sm);
    }

    .preview-secondary {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid;
      font-size: var(--text-sm);
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

        &::after {
          transform: translateX(24px);
        }
      }
    }

    .footer-preview {
      padding: var(--space-lg);
      background: var(--color-surface-alt);
      border-radius: var(--radius-md);

      p { margin: 0 0 var(--space-sm); }
    }

    .preview-links {
      display: flex;
      gap: var(--space-md);

      span {
        color: var(--color-primary);
        font-size: var(--text-sm);
      }
    }

    .info {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
    }
  `],
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  // Theme
  themeData = { primaryColor: '#2563EB', secondaryColor: '#7C3AED', accentColor: '#06B6D4', defaultMode: 'dark' };
  savingTheme = false;
  themeSaved = false;

  // General
  generalData = { defaultLanguage: 'en', maintenanceMode: false, analyticsEnabled: false };
  savingGeneral = false;
  generalSaved = false;

  // Footer
  footerData = {
    copyrightText: { en: '', fa: '', de: '' },
    socialLinks: { github: '', linkedin: '', twitter: '' },
  };
  savingFooter = false;
  footerSaved = false;
  activeLang: 'fa' | 'en' | 'de' = 'en';

  // SEO
  seoSaved = false;

  languages = [
    { code: 'fa' as const, label: 'فارسی' },
    { code: 'en' as const, label: 'English' },
    { code: 'de' as const, label: 'Deutsch' },
  ];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.api.getAllSettings().subscribe({
      next: (settings) => {
        settings.forEach(s => {
          if (s.key === 'theme') {
            this.themeData = { ...this.themeData, ...s.value };
          } else if (s.key === 'general') {
            this.generalData = { ...this.generalData, ...s.value };
          } else if (s.key === 'footer') {
            this.footerData = {
              copyrightText: s.value.copyrightText || { en: '', fa: '', de: '' },
              socialLinks: s.value.socialLinks || { github: '', linkedin: '', twitter: '' },
            };
          }
        });
        this.cdr.detectChanges();
      },
    });
  }

  updateThemePreview() {
    // Preview is reactive via Angular binding
  }

  saveTheme() {
    this.savingTheme = true;
    this.api.updateSetting('theme', this.themeData).subscribe({
      next: () => {
        this.savingTheme = false;
        this.themeSaved = true;
        setTimeout(() => this.themeSaved = false, 2000);
      },
      error: () => {
        this.savingTheme = false;
      },
    });
  }

  saveGeneral() {
    this.savingGeneral = true;
    this.api.updateSetting('general', this.generalData).subscribe({
      next: () => {
        this.savingGeneral = false;
        this.generalSaved = true;
        setTimeout(() => this.generalSaved = false, 2000);
      },
      error: () => {
        this.savingGeneral = false;
      },
    });
  }

  saveFooter() {
    this.savingFooter = true;
    this.api.updateSetting('footer', this.footerData).subscribe({
      next: () => {
        this.savingFooter = false;
        this.footerSaved = true;
        setTimeout(() => this.footerSaved = false, 2000);
      },
      error: () => {
        this.savingFooter = false;
      },
    });
  }

  exportSettings() {
    this.api.getAllSettings().subscribe({
      next: (settings) => {
        const data = JSON.stringify(settings, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-settings.json';
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }
}
