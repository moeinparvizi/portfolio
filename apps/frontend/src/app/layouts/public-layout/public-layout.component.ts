import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, LanguageSwitcherComponent],
  template: `
    <header class="header">
      <div class="header-inner container">
        <a routerLink="/" class="logo">Portfolio</a>

        <nav class="nav">
          <a routerLink="about" routerLinkActive="active">About</a>
          <a routerLink="skills" routerLinkActive="active">Skills</a>
          <a routerLink="projects" routerLinkActive="active">Projects</a>
          <a routerLink="experience" routerLinkActive="active">Experience</a>
          <a routerLink="education" routerLinkActive="active">Education</a>
          <a routerLink="contact" routerLinkActive="active">Contact</a>
        </nav>

        <div class="header-actions">
          <app-language-switcher />
          <app-theme-toggle />
        </div>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <p>&copy; 2026 All rights reserved.</p>
        <div class="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      flex: 1;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border-bottom: 1px solid var(--glass-border);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: var(--space-lg);
    }

    .logo {
      font-family: var(--font-display);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-text);
      text-decoration: none;
    }

    .nav {
      display: flex;
      gap: var(--space-sm);

      a {
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        text-decoration: none;
        transition: all var(--transition-fast);

        &:hover, &.active {
          color: var(--color-text);
          background: rgba(255, 255, 255, 0.1);
        }
      }

      @media (max-width: 768px) {
        display: none;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .footer {
      border-top: 1px solid var(--color-border);
      padding: var(--space-lg) 0;
      margin-top: auto;
    }

    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: var(--space-md);
      }
    }

    .footer p {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .footer-links {
      display: flex;
      gap: var(--space-md);

      a {
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
        text-decoration: none;

        &:hover { color: var(--color-primary); }
      }
    }
  `],
})
export class PublicLayoutComponent {}
