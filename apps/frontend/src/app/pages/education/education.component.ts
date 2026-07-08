import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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

        @if (education.length === 0) {
          <p class="empty">No education records yet.</p>
        }

        <div class="education-grid">
          @for (edu of education; track edu.id) {
            <app-glass-card [hoverable]="true">
              <div class="edu-card">
                <h3>{{ edu.degree | translate }}</h3>
                <p class="field">{{ edu.fieldOfStudy | translate }}</p>
                <p class="institution">{{ edu.institution | translate }}</p>
                <p class="date">{{ formatDate(edu.startDate) }} – {{ edu.endDate ? formatDate(edu.endDate) : 'Present' }}</p>
                @if (edu.description | translate; as desc) {
                  <p class="description">{{ desc }}</p>
                }
              </div>
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

    .edu-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    h3 {
      margin: 0;
      font-size: var(--text-xl);
    }

    .field {
      color: var(--color-primary);
      font-weight: 500;
      margin: 0;
    }

    .institution {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .date {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .description {
      margin-top: var(--space-sm);
      color: var(--color-text-secondary);
    }

    .empty {
      color: var(--color-text-muted);
      text-align: center;
      padding: var(--space-3xl);
    }
  `],
})
export class EducationComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  education: Education[] = [];

  ngOnInit() {
    this.api.getEducation().subscribe({
      next: (e) => {
        this.education = e;
        this.cdr.detectChanges();
      },
    });
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
