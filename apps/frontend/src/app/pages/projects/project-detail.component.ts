import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
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
        @if (project) {
          <a routerLink="/projects" class="back-link">&larr; Back to Projects</a>

          <h1>{{ project.title | translate }}</h1>

          @if (project.images?.length) {
            <div class="image-gallery">
              @for (img of project.images; track img) {
                <img [src]="img" [alt]="project.title | translate" class="gallery-image" />
              }
            </div>
          }

          <app-glass-card>
            <div class="project-info">
              <p class="description">{{ project.description | translate }}</p>

              <div class="tags">
                @for (tag of project.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>

              <div class="links">
                @if (project.liveUrl) {
                  <a [href]="project.liveUrl" target="_blank" rel="noopener" class="btn btn-primary">
                    Live Demo
                  </a>
                }
                @if (project.githubUrl) {
                  <a [href]="project.githubUrl" target="_blank" rel="noopener" class="btn btn-ghost">
                    GitHub
                  </a>
                }
              </div>
            </div>
          </app-glass-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: var(--space-lg);
      color: var(--color-text-secondary);
      text-decoration: none;
      &:hover { color: var(--color-primary); }
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-md);
      margin: var(--space-xl) 0;
    }

    .gallery-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .description {
      font-size: var(--text-lg);
      line-height: 1.8;
      margin-bottom: var(--space-xl);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
    }

    .tag {
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      background: rgba(37, 99, 235, 0.1);
      color: var(--color-primary);
      font-size: var(--text-sm);
    }

    .links {
      display: flex;
      gap: var(--space-md);
    }
  `],
})
export class ProjectDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  project: Project | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getProject(id).subscribe(p => this.project = p);
    }
  }
}
