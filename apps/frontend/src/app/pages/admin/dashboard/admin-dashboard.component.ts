import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, GlassCardComponent],
  template: `
    <div class="dashboard">
      <div class="welcome">
        <h1>Welcome back! 👋</h1>
        <p>Here's an overview of your portfolio</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <app-glass-card>
          <div class="stat-card skills">
            <div class="stat-icon">🛠️</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.skills }}</span>
              <span class="stat-label">Skills</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card projects">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.projects }}</span>
              <span class="stat-label">Projects</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card experience">
            <div class="stat-icon">💼</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.experience }}</span>
              <span class="stat-label">Experience</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card education">
            <div class="stat-icon">🎓</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.education }}</span>
              <span class="stat-label">Education</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card testimonials">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.testimonials }}</span>
              <span class="stat-label">Testimonials</span>
            </div>
          </div>
        </app-glass-card>

        <app-glass-card>
          <div class="stat-card messages">
            <div class="stat-icon">✉️</div>
            <div class="stat-info">
              <span class="stat-number">{{ stats.messages }}</span>
              <span class="stat-label">Messages</span>
              @if (stats.unreadMessages > 0) {
                <span class="badge unread">{{ stats.unreadMessages }} new</span>
              }
            </div>
          </div>
        </app-glass-card>
      </div>

      <!-- Quick Actions -->
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <a routerLink="/admin/profile" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">👤</span>
            <span class="action-text">Edit Profile</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/skills" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">➕</span>
            <span class="action-text">Add Skill</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/projects" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">➕</span>
            <span class="action-text">Add Project</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/resume" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">📄</span>
            <span class="action-text">Generate Resume</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/contact" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">📬</span>
            <span class="action-text">View Messages</span>
          </app-glass-card>
        </a>
        <a routerLink="/admin/settings" class="action-card">
          <app-glass-card [hoverable]="true">
            <span class="action-icon">⚙️</span>
            <span class="action-text">Settings</span>
          </app-glass-card>
        </a>
      </div>

      <!-- Public Site Preview -->
      <h2>Site Preview</h2>
      <app-glass-card>
        <div class="preview-section">
          <div class="preview-header">
            <span>Your public portfolio is live at:</span>
            <a href="http://localhost:4200/en" target="_blank" class="btn btn-primary btn-sm">
              Open Site ↗
            </a>
          </div>
          <div class="preview-stats">
            <span>🌐 3 Languages (EN/FA/DE)</span>
            <span>🌙 Dark/Light Mode</span>
            <span>📱 Responsive</span>
          </div>
        </div>
      </app-glass-card>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-xl);
    }

    .welcome {
      margin-bottom: var(--space-xl);
      h1 { margin: 0; font-size: var(--text-2xl); }
      p { margin: var(--space-xs) 0 0; color: var(--color-text-secondary); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: var(--text-2xl);
      font-weight: 700;
    }

    .stat-label {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }

    .badge {
      font-size: var(--text-xs);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      margin-top: var(--space-xs);
      width: fit-content;

      &.unread {
        background: rgba(37, 99, 235, 0.1);
        color: var(--color-primary);
      }
    }

    h2 {
      font-size: var(--text-lg);
      margin: 0 0 var(--space-lg);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .action-card {
      text-decoration: none;
      color: inherit;
    }

    .action-icon {
      display: block;
      font-size: 1.5rem;
      margin-bottom: var(--space-sm);
    }

    .action-text {
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .preview-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-stats {
      display: flex;
      gap: var(--space-lg);
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  stats = {
    skills: 0,
    projects: 0,
    experience: 0,
    education: 0,
    testimonials: 0,
    messages: 0,
    unreadMessages: 0,
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.api.getSkills().subscribe(s => {
      this.stats.skills = s.length;
      this.cdr.detectChanges();
    });
    this.api.getProjects().subscribe(p => {
      this.stats.projects = p.length;
      this.cdr.detectChanges();
    });
    this.api.getExperience().subscribe(e => {
      this.stats.experience = e.length;
      this.cdr.detectChanges();
    });
    this.api.getEducation().subscribe(e => {
      this.stats.education = e.length;
      this.cdr.detectChanges();
    });
    this.api.getAllTestimonials().subscribe(t => {
      this.stats.testimonials = t.length;
      this.cdr.detectChanges();
    });
    this.api.getMessages().subscribe(m => {
      this.stats.messages = m.length;
      this.stats.unreadMessages = m.filter(msg => !msg.read).length;
      this.cdr.detectChanges();
    });
  }
}
