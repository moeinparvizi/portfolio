import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, GlassCardComponent],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="grid">
        <a routerLink="/admin/profile" class="stat-card">
          <app-glass-card>
            <h3>Profile</h3>
            <p>Edit your personal information</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/skills" class="stat-card">
          <app-glass-card>
            <h3>Skills</h3>
            <p>Manage your skills</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/projects" class="stat-card">
          <app-glass-card>
            <h3>Projects</h3>
            <p>Manage your projects</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/experience" class="stat-card">
          <app-glass-card>
            <h3>Experience</h3>
            <p>Manage work experience</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/education" class="stat-card">
          <app-glass-card>
            <h3>Education</h3>
            <p>Manage education</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/testimonials" class="stat-card">
          <app-glass-card>
            <h3>Testimonials</h3>
            <p>Review testimonials</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/contact" class="stat-card">
          <app-glass-card>
            <h3>Messages</h3>
            <p>View contact messages</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/settings" class="stat-card">
          <app-glass-card>
            <h3>Settings</h3>
            <p>Site configuration</p>
          </app-glass-card>
        </a>
        <a routerLink="/admin/resume" class="stat-card">
          <app-glass-card>
            <h3>Resume</h3>
            <p>Generate resume PDF</p>
          </app-glass-card>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-xl);

      h1 {
        margin-bottom: var(--space-xl);
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      text-decoration: none;
      color: inherit;
      transition: transform var(--transition-base);

      &:hover {
        transform: translateY(-2px);
      }

      h3 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-sm);
      }

      p {
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
  `],
})
export class AdminDashboardComponent {}
