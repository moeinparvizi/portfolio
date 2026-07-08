import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-admin-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <div class="admin-page">
      <h1>Resume Generator</h1>
      <app-glass-card>
        <div class="form-group">
          <label>Language</label>
          <select [(ngModel)]="locale">
            <option value="en">English</option>
            <option value="fa">فارسی</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" [(ngModel)]="showPhoto" />
            Show Photo
          </label>
        </div>
        <button class="btn btn-primary btn-lg" (click)="generate()" [disabled]="generating">
          {{ generating ? 'Generating...' : 'Generate PDF' }}
        </button>
      </app-glass-card>
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 600px; }
    .form-group { margin-bottom: var(--space-lg); label { display: block; font-weight: 500; margin-bottom: var(--space-sm); } select { padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-text); font-family: var(--font-body); } }
  `],
})
export class AdminResumeComponent {
  private api = inject(ApiService);
  locale = 'en';
  showPhoto = true;
  generating = false;

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
