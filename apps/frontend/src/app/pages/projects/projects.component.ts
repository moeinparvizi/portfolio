import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Project } from '../../core/models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Projects</h1>

        <div class="filters">
          <button class="btn btn-ghost" [class.active]="!activeFilter" (click)="activeFilter = ''">All</button>
          @for (cat of categories; track cat) {
            <button class="btn btn-ghost" [class.active]="activeFilter === cat" (click)="activeFilter = cat">
              {{ cat }}
            </button>
          }
        </div>

        <div class="projects-grid">
          @for (project of filteredProjects; track project.id) {
            <app-glass-card [hoverable]="true">
              <a [routerLink]="[project.id]" class="project-link">
                @if (project.images?.[0]) {
                  <img [src]="project.images[0]" [alt]="project.title | translate" class="project-image" />
                }
                <h3>{{ project.title | translate }}</h3>
                <p class="summary">{{ project.summary | translate }}</p>
                <div class="tags">
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
  `,
  styles: [`
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin: var(--space-xl) 0;
    }

    .btn.active {
      background: var(--color-primary);
      color: white;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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

    .summary {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-md);
    }

    .tags {
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
    }
  `],
})
export class ProjectsComponent implements OnInit {
  private api = inject(ApiService);
  projects: Project[] = [];
  activeFilter = '';
  categories: string[] = [];

  get filteredProjects(): Project[] {
    if (!this.activeFilter) return this.projects;
    return this.projects.filter(p => p.category === this.activeFilter);
  }

  ngOnInit() {
    this.api.getProjects().subscribe(p => {
      this.projects = p;
      const cats = p.map(proj => proj.category).filter((c): c is string => !!c);
      this.categories = [...new Set(cats)];
    });
  }
}
