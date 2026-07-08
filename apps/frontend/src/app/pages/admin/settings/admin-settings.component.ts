import { Component, OnInit, inject } from '@angular/core';
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

      @for (setting of settings; track setting.key) {
        <app-glass-card>
          <h3>{{ setting.key }}</h3>
          <div class="form-group">
            <textarea
              [(ngModel)]="setting.valueJson"
              rows="6"
              class="json-input"
            ></textarea>
          </div>
          <button class="btn btn-primary" (click)="save(setting)">Save {{ setting.key }}</button>
          @if (setting.saved) {
            <span class="saved">Saved!</span>
          }
        </app-glass-card>
      }
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 800px; display: flex; flex-direction: column; gap: var(--space-lg); }
    .json-input {
      width: 100%;
      padding: var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text);
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      &:focus { outline: none; border-color: var(--color-primary); }
    }
    .saved { color: var(--color-success); margin-left: var(--space-md); }
  `],
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(ApiService);
  settings: (SiteSettings & { valueJson: string; saved: boolean })[] = [];

  ngOnInit() {
    this.api.getAllSettings().subscribe(s => {
      this.settings = s.map(item => ({
        ...item,
        valueJson: JSON.stringify(item.value, null, 2),
        saved: false,
      }));
    });
  }

  save(setting: any) {
    try {
      const value = JSON.parse(setting.valueJson);
      this.api.updateSetting(setting.key, value).subscribe(() => {
        setting.saved = true;
        setTimeout(() => setting.saved = false, 2000);
      });
    } catch {
      alert('Invalid JSON');
    }
  }
}
