import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LocaleService } from '../../core/services/locale.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Project } from '../../core/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        @if (loading) {
          <p class="loading">Loading project...</p>
        }

        @if (project; as p) {
          <a [routerLink]="getLink('/projects')" class="back-link">← Back to Projects</a>

          <div class="project-header">
            <h1>{{ p.title | translate }}</h1>
            @if (p.category) {
              <span class="category">{{ p.category }}</span>
            }
          </div>

          @if (p.images && p.images.length > 0) {
            <div class="image-gallery">
              @for (img of p.images; track img) {
                <img [src]="img" [alt]="p.title | translate" class="gallery-image" />
              }
            </div>
          }

          <app-glass-card>
            <div class="project-info">
              <div class="section-block">
                <h3>Description</h3>
                <p class="description">{{ p.description | translate }}</p>
              </div>

              @if (p.summary) {
                <div class="section-block">
                  <h3>Summary</h3>
                  <p class="summary">{{ p.summary | translate }}</p>
                </div>
              }

              @if (p.tags && p.tags.length > 0) {
                <div class="section-block">
                  <h3>Technologies</h3>
                  <div class="tags">
                    @for (tag of p.tags; track tag) {
                      <span class="tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              }

              <div class="links">
                @if (p.liveUrl) {
                  <a [href]="p.liveUrl" target="_blank" rel="noopener" class="btn btn-primary">
                    🌐 Live Demo
                  </a>
                }
                @if (p.githubUrl) {
                  <a [href]="p.githubUrl" target="_blank" rel="noopener" class="btn btn-ghost">
                    📂 GitHub
                  </a>
                }
              </div>
            </div>
          </app-glass-card>
        }

        @if (!loading && !project) {
          <div class="not-found">
            <h2>Project not found</h2>
            <a [routerLink]="getLink('/projects')" class="btn btn-primary">Back to Projects</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .loading {
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }

    .back-link {
      display: inline-block;
      margin-bottom: var(--space-lg);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
      &:hover { color: var(--color-primary); }
    }

    .project-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;

      h1 {
        margin: 0;
      }
    }

    .category {
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .gallery-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .project-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .section-block h3 {
      font-size: var(--text-lg);
      margin-bottom: var(--space-md);
      color: var(--color-primary);
    }

    .description {
      font-size: var(--text-lg);
      line-height: 1.8;
      color: var(--color-text-secondary);
      margin: 0;
    }

    .summary {
      color: var(--color-text-secondary);
      margin: 0;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .tag {
      padding: 6px 14px;
      border-radius: var(--radius-md);
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .links {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .not-found {
      text-align: center;
      padding: var(--space-3xl);

      h2 {
        margin-bottom: var(--space-lg);
        color: var(--color-text-secondary);
      }
    }
  `],
})
export class ProjectDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private localeService = inject(LocaleService);

  project: Project | null = null;
  loading = true;

  getLink(path: string): string {
    const locale = this.localeService.getLocale();
    if (path.startsWith('/en/') || path.startsWith('/fa/') || path.startsWith('/de/')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `/${locale}/${cleanPath}`;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getProject(id).subscribe({
        next: (p) => {
          this.project = p;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.loading = false;
    }
  }
}
