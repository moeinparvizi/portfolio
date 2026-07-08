import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card" [class.glass-hover]="hoverable">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--glass-shadow);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--glass-highlight);
        pointer-events: none;
        z-index: 1;
      }

      > * {
        position: relative;
        z-index: 2;
      }
    }

    .glass-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transition: all var(--transition-base);
    }

    @media (prefers-reduced-motion: reduce) {
      .glass-card {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        &::before { display: none; }
      }
    }

    @media (prefers-contrast: more) {
      .glass-card {
        border: 2px solid var(--color-text);
        background: var(--color-surface);
        box-shadow: none;
        &::before { display: none; }
      }
    }
  `],
})
export class GlassCardComponent {
  @Input() hoverable = false;
}
