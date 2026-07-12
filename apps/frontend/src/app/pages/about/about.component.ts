import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Profile, Skill, Experience, Education } from '../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <!-- Hero Section -->
        <div class="about-hero">
          @if (profile?.avatarUrl) {
            <div class="avatar-wrapper">
              <img [src]="profile!.avatarUrl" [alt]="profile!.fullName | translate" class="avatar" />
              <div class="avatar-ring"></div>
            </div>
          }
          <div class="hero-text">
            <h1>{{ profile?.fullName | translate }}</h1>
            <p class="job-title">{{ profile?.jobTitle | translate }}</p>
            <p class="summary">{{ profile?.summary | translate }}</p>
            <div class="social-links">
              @if (profile?.socialLinks?.['github']) {
                <a [href]="profile!.socialLinks['github']" target="_blank" class="social-btn">
                  <span>GitHub</span>
                </a>
              }
              @if (profile?.socialLinks?.['linkedin']) {
                <a [href]="profile!.socialLinks['linkedin']" target="_blank" class="social-btn">
                  <span>LinkedIn</span>
                </a>
              }
              <a routerLink="/contact" class="social-btn primary">
                <span>Contact Me</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <app-glass-card>
            <div class="stat-item">
              <span class="stat-number">{{ skills.length }}</span>
              <span class="stat-label">Skills</span>
            </div>
          </app-glass-card>
          <app-glass-card>
            <div class="stat-item">
              <span class="stat-number">{{ experience.length }}</span>
              <span class="stat-label">Experiences</span>
            </div>
          </app-glass-card>
          <app-glass-card>
            <div class="stat-item">
              <span class="stat-number">{{ education.length }}</span>
              <span class="stat-label">Educations</span>
            </div>
          </app-glass-card>
          <app-glass-card>
            <div class="stat-item">
              <span class="stat-number">{{ yearsOfExperience }}+</span>
              <span class="stat-label">Years Experience</span>
            </div>
          </app-glass-card>
        </div>

        <!-- Skills Preview -->
        @if (skills.length > 0) {
          <div class="section-block">
            <h2>My Skills</h2>
            <div class="skills-grid">
              @for (skill of skills.slice(0, 6); track skill.id) {
                <app-glass-card [hoverable]="true">
                  <div class="skill-card">
                    <h4>{{ skill.name | translate }}</h4>
                    @if (skill.category) {
                      <span class="category">{{ skill.category }}</span>
                    }
                    @if (skill.level) {
                      <div class="skill-bar">
                        <div class="skill-fill" [style.width.%]="skill.level * 20"></div>
                      </div>
                    }
                  </div>
                </app-glass-card>
              }
            </div>
            <a routerLink="/skills" class="btn btn-ghost">View All Skills →</a>
          </div>
        }

        <!-- Experience Preview -->
        @if (experience.length > 0) {
          <div class="section-block">
            <h2>Work Experience</h2>
            <div class="timeline">
              @for (exp of experience.slice(0, 3); track exp.id) {
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <app-glass-card>
                    <div class="exp-content">
                      <h4>{{ exp.position | translate }}</h4>
                      <p class="company">{{ exp.company | translate }}</p>
                      <p class="date">{{ formatDate(exp.startDate) }} – {{ exp.isCurrent ? 'Present' : formatDate(exp.endDate) }}</p>
                      @if (exp.location) {
                        <p class="location">📍 {{ exp.location }}</p>
                      }
                    </div>
                  </app-glass-card>
                </div>
              }
            </div>
            <a routerLink="/experience" class="btn btn-ghost">View Full Experience →</a>
          </div>
        }

        <!-- CTA -->
        <div class="cta-section">
          <app-glass-card>
            <div class="cta-content">
              <h2>Let's Work Together</h2>
              <p>Have a project in mind? Let's discuss how I can help you.</p>
              <a routerLink="/contact" class="btn btn-primary btn-lg">Get In Touch</a>
            </div>
          </app-glass-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-hero {
      display: flex;
      align-items: center;
      gap: var(--space-3xl);
      margin-bottom: var(--space-3xl);

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xl);
      }
    }

    .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 1;
    }

    .avatar-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 3px solid var(--color-primary);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.05); opacity: 1; }
    }

    .hero-text {
      flex: 1;

      h1 {
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        margin-bottom: var(--space-sm);
      }
    }

    .job-title {
      font-size: var(--text-xl);
      color: var(--color-primary);
      font-weight: 500;
      margin-bottom: var(--space-md);
    }

    .summary {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      line-height: 1.8;
      margin-bottom: var(--space-xl);
    }

    .social-links {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .social-btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-text);
      text-decoration: none;
      font-weight: 500;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--color-surface);
        border-color: var(--color-primary);
      }

      &.primary {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);

        &:hover {
          background: var(--color-primary-hover);
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-3xl);

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--color-primary);
    }

    .stat-label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }

    .section-block {
      margin-bottom: var(--space-3xl);

      h2 {
        font-size: var(--text-2xl);
        margin-bottom: var(--space-xl);
      }
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
    }

    .skill-card {
      text-align: center;

      h4 {
        margin: 0 0 var(--space-sm);
      }
    }

    .category {
      font-size: var(--text-xs);
      color: var(--color-primary);
      display: block;
      margin-bottom: var(--space-sm);
    }

    .skill-bar {
      height: 4px;
      background: var(--color-border);
      border-radius: 2px;
      overflow: hidden;
      margin-top: var(--space-sm);
    }

    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 2px;
    }

    .timeline {
      position: relative;
      padding-left: var(--space-xl);
      margin-bottom: var(--space-lg);

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
      margin-bottom: var(--space-lg);
    }

    .timeline-dot {
      position: absolute;
      left: calc(-1 * var(--space-xl) + 3px);
      top: 20px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-primary);
    }

    .exp-content {
      h4 { margin: 0 0 var(--space-xs); }
    }

    .company {
      color: var(--color-primary);
      font-weight: 500;
      margin: 0;
    }

    .date, .location {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: var(--space-xs) 0;
    }

    .cta-section {
      text-align: center;
    }

    .cta-content {
      padding: var(--space-xl);

      h2 {
        margin-bottom: var(--space-md);
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: var(--space-xl);
      }
    }
  `],
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  profile: Profile | null = null;
  skills: Skill[] = [];
  experience: Experience[] = [];
  education: Education[] = [];

  get yearsOfExperience(): number {
    if (this.experience.length === 0) return 0;
    const earliest = this.experience.reduce((min, exp) => {
      const date = new Date(exp.startDate);
      return date < min ? date : min;
    }, new Date());
    return new Date().getFullYear() - earliest.getFullYear();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.cdr.detectChanges();
      },
    });
    this.api.getSkills().subscribe({
      next: (s) => {
        this.skills = s;
        this.cdr.detectChanges();
      },
    });
    this.api.getExperience().subscribe({
      next: (e) => {
        this.experience = e;
        this.cdr.detectChanges();
      },
    });
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
