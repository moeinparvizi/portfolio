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
    <div class="admin-layout" [class.sidebar-open]="sidebarOpen">
      <!-- Mobile Overlay -->
      @if (sidebarOpen) {
        <div class="sidebar-overlay" (click)="sidebarOpen = false"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <a routerLink="/admin" class="logo">Admin Panel</a>
          <button class="close-btn" (click)="sidebarOpen = false">✕</button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/profile" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">👤</span> Profile
          </a>
          <a routerLink="/admin/skills" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">🛠️</span> Skills
          </a>
          <a routerLink="/admin/projects" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">📁</span> Projects
          </a>
          <a routerLink="/admin/experience" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">💼</span> Experience
          </a>
          <a routerLink="/admin/education" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">🎓</span> Education
          </a>
          <a routerLink="/admin/testimonials" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">💬</span> Testimonials
          </a>
          <a routerLink="/admin/contact" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">✉️</span> Messages
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">⚙️</span> Settings
          </a>
          <a routerLink="/admin/resume" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">📄</span> Resume
          </a>
          <a routerLink="/admin/blog" routerLinkActive="active" (click)="sidebarOpen = false">
            <span class="icon">📝</span> Blog
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="btn btn-ghost btn-sm">← Back to Site</a>
          <button class="btn btn-ghost btn-sm" (click)="logout()">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="topbar">
          <button class="menu-btn" (click)="sidebarOpen = !sidebarOpen">☰</button>
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

    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 90;

      @media (max-width: 900px) {
        display: block;
      }
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
      z-index: 100;

      @media (max-width: 900px) {
        transform: translateX(-100%);
        transition: transform var(--transition-base);

        &.open {
          transform: translateX(0);
        }
      }
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .close-btn {
      display: none;
      background: none;
      border: none;
      font-size: var(--text-lg);
      cursor: pointer;
      color: var(--color-text);

      @media (max-width: 900px) {
        display: block;
      }
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
        margin-bottom: 2px;

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
          width: 24px;
          text-align: center;
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
      overflow-y: auto;

      @media (max-width: 900px) {
        margin-left: 0;
      }
    }

    .topbar {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      position: sticky;
      top: 0;
      z-index: 50;

      h2 {
        font-size: var(--text-lg);
        margin: 0;
        flex: 1;
      }
    }

    .menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: var(--text-xl);
      cursor: pointer;
      color: var(--color-text);
      padding: var(--space-sm);

      @media (max-width: 900px) {
        display: block;
      }
    }

    .content {
      padding: var(--space-xl);

      @media (max-width: 600px) {
        padding: var(--space-md);
      }
    }
  `],
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = false;

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
