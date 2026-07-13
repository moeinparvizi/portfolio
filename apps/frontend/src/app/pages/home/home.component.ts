import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LocaleService } from '../../core/services/locale.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Profile, Project, Skill } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, GlassCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ profile?.heroText | translate }}
          </h1>
          <p class="hero-subtitle">
            {{ profile?.jobTitle | translate }}
          </p>
          <p class="hero-description">
            {{ profile?.summary | translate }}
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" [routerLink]="getLink(profile?.heroCtaLink || '/projects')">
              {{ profile?.heroCtaLabel | translate }}
            </a>
            <a class="btn btn-glass btn-lg" [routerLink]="getLink('/contact')">
              Contact Me
            </a>
            <button class="btn btn-glass btn-lg" (click)="downloadResume()">
              📄 Download Resume
            </button>
          </div>
        </div>
        @if (profile?.avatarUrl) {
          <div class="hero-image">
            <img [src]="profile!.avatarUrl" [alt]="profile!.fullName | translate" />
          </div>
        }
      </div>
    </section>

    <!-- Featured Projects -->
    @if (featuredProjects.length > 0) {
      <section class="section">
        <div class="container">
          <h2 class="section-title">Featured Projects</h2>
          <div class="projects-grid">
            @for (project of featuredProjects; track project.id) {
              <app-glass-card [hoverable]="true">
                <a [routerLink]="getLink('/projects/' + project.id)" class="project-link">
                  @if (project.images?.[0]) {
                    <img [src]="project.images[0]" [alt]="project.title | translate" class="project-image" />
                  }
                  <h3 class="project-title">{{ project.title | translate }}</h3>
                  <p class="project-summary">{{ project.summary | translate }}</p>
                  <div class="project-tags">
                    @for (tag of project.tags; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </a>
              </app-glass-card>
            }
          </div>
        </div>
      </section>
    }

    <!-- Skills Preview -->
    @if (skills.length > 0) {
      <section class="section">
        <div class="container">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            @for (skill of skills.slice(0, 8); track skill.id) {
              <div class="skill-item">
                <span class="skill-name">{{ skill.name | translate }}</span>
                @if (skill.level) {
                  <div class="skill-bar">
                    <div class="skill-fill" [style.width.%]="skill.level * 20"></div>
                  </div>
                }
              </div>
            }
          </div>
          <a [routerLink]="getLink('/skills')" class="btn btn-ghost" style="margin-top: var(--space-lg)">
            View All Skills
          </a>
        </div>
      </section>
    }
  `,
  styles: [`
    .hero {
      padding: var(--space-3xl) 0;
      min-height: 80vh;
      display: flex;
      align-items: center;
    }

    .hero-content {
      display: flex;
      align-items: center;
      gap: var(--space-3xl);

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xl);
      }
    }

    .hero-text { flex: 1; }

    .hero-title {
      font-size: clamp(1.75rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: var(--space-lg);
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: var(--color-primary);
      font-weight: 500;
      margin-bottom: var(--space-md);
    }

    .hero-description {
      font-size: clamp(0.875rem, 2vw, 1.125rem);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-xl);
      max-width: 500px;

      @media (max-width: 768px) {
        margin-inline: auto;
      }
    }

    .hero-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .hero-image {
      flex-shrink: 0;

      img {
        width: clamp(150px, 30vw, 300px);
        height: clamp(150px, 30vw, 300px);
        border-radius: var(--radius-xl);
        object-fit: cover;
        border: 3px solid var(--glass-border);
      }
    }

    .section-title {
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin-bottom: var(--space-xl);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
      gap: var(--space-lg);
    }

    .project-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .project-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
    }

    .project-title {
      font-size: var(--text-lg);
      margin-bottom: var(--space-sm);
    }

    .project-summary {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-md);
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }

    .tag {
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: rgba(37, 99, 235, 0.1);
      color: var(--color-primary);
      font-size: var(--text-xs);
      font-weight: 500;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .skill-item {
      padding: var(--space-md);
    }

    .skill-name {
      font-weight: 500;
      margin-bottom: var(--space-sm);
      display: block;
    }

    .skill-bar {
      height: 4px;
      background: var(--color-border);
      border-radius: 2px;
      overflow: hidden;
    }

    .skill-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 2px;
      transition: width var(--transition-slow);
    }
  `],
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private localeService = inject(LocaleService);
  private toast = inject(ToastService);

  profile: Profile | null = null;
  featuredProjects: Project[] = [];
  skills: Skill[] = [];
  downloading = false;

  getLink(path: string): string {
    const locale = this.localeService.getLocale();
    // If path already has locale prefix, return as is
    if (path.startsWith('/en/') || path.startsWith('/fa/') || path.startsWith('/de/')) {
      return path;
    }
    // Remove leading slash if present, then prepend locale
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `/${locale}/${cleanPath}`;
  }

  downloadResume() {
    this.downloading = true;
    const locale = this.localeService.getLocale();
    this.api.generateResume(locale, true).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${locale}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloading = false;
        this.toast.success('Resume downloaded!');
      },
      error: () => {
        this.downloading = false;
        this.toast.error('Failed to download resume');
      },
    });
  }

  ngOnInit() {
    this.api.getProfile().subscribe(p => {
      this.profile = p;
      this.cdr.detectChanges();
    });
    this.api.getFeaturedProjects().subscribe(p => {
      this.featuredProjects = p;
      this.cdr.detectChanges();
    });
    this.api.getSkills().subscribe(s => {
      this.skills = s;
      this.cdr.detectChanges();
    });
  }
}
