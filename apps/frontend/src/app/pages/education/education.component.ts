import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Education } from '../../core/models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Education</h1>
        <div class="education-grid">
          @for (edu of education; track edu.id) {
            <app-glass-card>
              <h3>{{ edu.degree | translate }}</h3>
              <p class="field">{{ edu.fieldOfStudy | translate }}</p>
              <p class="institution">{{ edu.institution | translate }}</p>
              <p class="date">{{ formatDate(edu.startDate) }} – {{ formatDate(edu.endDate) }}</p>
              <p class="description">{{ edu.description | translate }}</p>
            </app-glass-card>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .field {
      color: var(--color-primary);
      font-weight: 500;
    }

    .institution {
      color: var(--color-text-secondary);
    }

    .date {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }
  `],
})
export class EducationComponent implements OnInit {
  private api = inject(ApiService);
  education: Education[] = [];

  ngOnInit() {
    this.api.getEducation().subscribe(e => this.education = e);
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
