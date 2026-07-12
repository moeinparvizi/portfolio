import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';
import type { Profile } from '../../core/models';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, LanguageSwitcherComponent],
  template: `
    <header class="header">
      <div class="header-inner container">
        <a routerLink="/" class="logo">Portfolio</a>

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" (click)="menuOpen = !menuOpen" [class.active]="menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Desktop Nav -->
        <nav class="nav desktop-nav">
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

      <!-- Mobile Nav -->
      @if (menuOpen) {
        <nav class="mobile-nav">
          <a routerLink="about" routerLinkActive="active" (click)="menuOpen = false">About</a>
          <a routerLink="skills" routerLinkActive="active" (click)="menuOpen = false">Skills</a>
          <a routerLink="projects" routerLinkActive="active" (click)="menuOpen = false">Projects</a>
          <a routerLink="experience" routerLinkActive="active" (click)="menuOpen = false">Experience</a>
          <a routerLink="education" routerLinkActive="active" (click)="menuOpen = false">Education</a>
          <a routerLink="contact" routerLinkActive="active" (click)="menuOpen = false">Contact</a>
        </nav>
      }
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <p>&copy; 2026 {{ profile?.fullName?.['en'] || 'Portfolio' }}. All rights reserved.</p>
        <div class="footer-links">
          @if (profile?.socialLinks?.['email']) {
            <a href="mailto:{{ profile!.socialLinks['email'] }}">✉️ Email</a>
          }
          @if (profile?.socialLinks?.['github']) {
            <a [href]="profile!.socialLinks['github']" target="_blank" rel="noopener">GitHub</a>
          }
          @if (profile?.socialLinks?.['linkedin']) {
            <a [href]="profile!.socialLinks['linkedin']" target="_blank" rel="noopener">LinkedIn</a>
          }
          @if (profile?.socialLinks?.['twitter']) {
            <a [href]="profile!.socialLinks['twitter']" target="_blank" rel="noopener">Twitter</a>
          }
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

    .desktop-nav {
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
        white-space: nowrap;

        &:hover, &.active {
          color: var(--color-text);
          background: rgba(255, 255, 255, 0.1);
        }
      }

      @media (max-width: 900px) {
        display: none;
      }
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 8px;
      background: none;
      border: none;
      cursor: pointer;

      span {
        display: block;
        width: 24px;
        height: 2px;
        background: var(--color-text);
        transition: all var(--transition-fast);
        border-radius: 2px;
      }

      &.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
      &.active span:nth-child(2) { opacity: 0; }
      &.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

      @media (max-width: 900px) {
        display: flex;
      }
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      padding: var(--space-md);
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border-top: 1px solid var(--glass-border);

      a {
        padding: var(--space-md);
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        font-size: var(--text-base);
        font-weight: 500;
        text-decoration: none;
        transition: all var(--transition-fast);

        &:hover, &.active {
          color: var(--color-text);
          background: rgba(255, 255, 255, 0.1);
        }
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

      @media (max-width: 600px) {
        flex-direction: column;
        gap: var(--space-md);
        text-align: center;
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
        transition: color var(--transition-fast);

        &:hover { color: var(--color-primary); }
      }
    }
  `],
})
export class PublicLayoutComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  menuOpen = false;
  profile: Profile | null = null;

  ngOnInit() {
    this.api.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.cdr.detectChanges();
      },
    });
  }
}
