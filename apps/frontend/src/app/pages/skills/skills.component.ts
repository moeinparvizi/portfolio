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

        <!-- Technical Skills -->
        @if (technicalSkills.length > 0) {
          <div class="skills-section">
            <h2>🛠️ Technical Skills</h2>
            <div class="skills-grid">
              @for (skill of technicalSkills; track skill.id) {
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
        }

        <!-- Soft Skills -->
        @if (softSkills.length > 0) {
          <div class="skills-section">
            <h2>💼 Soft Skills</h2>
            <div class="soft-skills-grid">
              @for (skill of softSkills; track skill.id) {
                <div class="soft-skill-item">
                  <span class="soft-skill-name">{{ skill.name | translate }}</span>
                  @if (skill.level) {
                    <div class="soft-skill-dots">
                      @for (i of [1,2,3,4,5]; track i) {
                        <span class="dot" [class.filled]="i <= skill.level!"></span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (skills.length === 0) {
          <p class="empty">No skills yet.</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .skills-section {
      margin-bottom: var(--space-3xl);

      h2 {
        font-size: var(--text-2xl);
        margin-bottom: var(--space-xl);
      }
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-lg);
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

    .soft-skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .soft-skill-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-md) var(--space-lg);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
    }

    .soft-skill-name {
      font-weight: 500;
    }

    .soft-skill-dots {
      display: flex;
      gap: 4px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-border);
      &.filled {
        background: var(--color-primary);
      }
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

  get technicalSkills(): Skill[] {
    return this.skills.filter(s => s.category !== 'Soft Skills');
  }

  get softSkills(): Skill[] {
    return this.skills.filter(s => s.category === 'Soft Skills');
  }

  ngOnInit() {
    this.api.getSkills().subscribe({
      next: (s) => {
        this.skills = s;
        this.cdr.detectChanges();
      },
    });
  }
}
