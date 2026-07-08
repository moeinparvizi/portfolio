import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/admin" class="logo">Admin Panel</a>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/profile" routerLinkActive="active">
            <span class="icon">👤</span> Profile
          </a>
          <a routerLink="/admin/skills" routerLinkActive="active">
            <span class="icon">🛠️</span> Skills
          </a>
          <a routerLink="/admin/projects" routerLinkActive="active">
            <span class="icon">📁</span> Projects
          </a>
          <a routerLink="/admin/experience" routerLinkActive="active">
            <span class="icon">💼</span> Experience
          </a>
          <a routerLink="/admin/education" routerLinkActive="active">
            <span class="icon">🎓</span> Education
          </a>
          <a routerLink="/admin/testimonials" routerLinkActive="active">
            <span class="icon">💬</span> Testimonials
          </a>
          <a routerLink="/admin/contact" routerLinkActive="active">
            <span class="icon">✉️</span> Messages
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active">
            <span class="icon">⚙️</span> Settings
          </a>
          <a routerLink="/admin/resume" routerLinkActive="active">
            <span class="icon">📄</span> Resume
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="btn btn-ghost btn-sm">
            ← Back to Site
          </a>
          <button class="btn btn-ghost btn-sm" (click)="logout()">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <h2>Admin Dashboard</h2>
          <div class="topbar-actions">
            <app-theme-toggle />
          </div>
        </header>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .logo {
      font-family: var(--font-display);
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--color-text);
      text-decoration: none;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-md);

      a {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        text-decoration: none;
        font-size: var(--text-sm);
        transition: all var(--transition-fast);

        &:hover {
          background: var(--color-surface-alt);
          color: var(--color-text);
        }

        &.active {
          background: var(--color-primary);
          color: white;
        }

        .icon {
          font-size: var(--text-lg);
        }
      }
    }

    .sidebar-footer {
      padding: var(--space-md);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);

      h2 {
        font-size: var(--text-xl);
        margin: 0;
      }
    }

    .content {
      padding: var(--space-xl);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: static;
        height: auto;
      }

      .main-content {
        margin-left: 0;
      }
    }
  `],
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
