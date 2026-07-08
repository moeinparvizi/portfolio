import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import type { Experience } from '../../core/models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="section">
      <div class="container">
        <h1>Experience</h1>
        <div class="timeline">
          @for (exp of experiences; track exp.id) {
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <h3>{{ exp.position | translate }}</h3>
                <p class="company">{{ exp.company | translate }}</p>
                <p class="date">
                  {{ formatDate(exp.startDate) }} – {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}
                </p>
                @if (exp.location) {
                  <p class="location">{{ exp.location }}</p>
                }
                <p class="description">{{ exp.description | translate }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline {
      margin-top: var(--space-xl);
      position: relative;
      padding-left: var(--space-xl);

      &::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--color-border);
      }
    }

    .timeline-item {
      position: relative;
      margin-bottom: var(--space-xl);
    }

    .timeline-dot {
      position: absolute;
      left: calc(-1 * var(--space-xl) + 3px);
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-primary);
      border: 2px solid var(--color-surface);
    }

    .company {
      color: var(--color-primary);
      font-weight: 500;
    }

    .date, .location {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .description {
      margin-top: var(--space-sm);
      color: var(--color-text-secondary);
    }
  `],
})
export class ExperienceComponent implements OnInit {
  private api = inject(ApiService);
  experiences: Experience[] = [];

  ngOnInit() {
    this.api.getExperience().subscribe(e => this.experiences = e);
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
