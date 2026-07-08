import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Skill } from '../../core/models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Skills</h1>
        @if (skills.length === 0) {
          <p class="empty">No skills yet.</p>
        }
        <div class="skills-grid">
          @for (skill of skills; track skill.id) {
            <app-glass-card [hoverable]="true">
              <div class="skill-card">
                <h3>{{ skill.name | translate }}</h3>
                @if (skill.category) {
                  <p class="category">{{ skill.category }}</p>
                }
                @if (skill.level) {
                  <div class="skill-bar">
                    <div class="skill-fill" [style.width.%]="skill.level * 20"></div>
                  </div>
                  <p class="level-text">{{ skill.level }}/5</p>
                }
              </div>
            </app-glass-card>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .skill-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    h3 { margin: 0; }

    .category {
      font-size: var(--text-sm);
      color: var(--color-primary);
      margin: 0;
      font-weight: 500;
    }

    .skill-bar {
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
      margin-top: var(--space-sm);
    }

    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 3px;
      transition: width var(--transition-slow);
    }

    .level-text {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .empty {
      color: var(--color-text-muted);
      text-align: center;
      padding: var(--space-3xl);
    }
  `],
})
export class SkillsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  skills: Skill[] = [];

  ngOnInit() {
    this.api.getSkills().subscribe({
      next: (s) => {
        this.skills = s;
        this.cdr.detectChanges();
      },
    });
  }
}
