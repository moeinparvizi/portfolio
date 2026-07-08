import { Component, OnInit, inject } from '@angular/core';
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
        <div class="skills-grid">
          @for (skill of skills; track skill.id) {
            <app-glass-card>
              <h3>{{ skill.name | translate }}</h3>
              @if (skill.category) {
                <p class="category">{{ skill.category }}</p>
              }
              @if (skill.level) {
                <div class="skill-bar">
                  <div class="skill-fill" [style.width.%]="skill.level * 20"></div>
                </div>
              }
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

    .category {
      font-size: var(--text-sm);
      color: var(--color-primary);
      margin-bottom: var(--space-md);
    }

    .skill-bar {
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
      margin-top: var(--space-md);
    }

    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 3px;
      transition: width var(--transition-slow);
    }
  `],
})
export class SkillsComponent implements OnInit {
  private api = inject(ApiService);
  skills: Skill[] = [];

  ngOnInit() {
    this.api.getSkills().subscribe(s => this.skills = s);
  }
}
