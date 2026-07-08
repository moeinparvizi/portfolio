import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="remove(toast.id)">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--space-lg);
      right: var(--space-lg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-width: 400px;
    }

    [dir='rtl'] .toast-container {
      right: auto;
      left: var(--space-lg);
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    }

    .toast-success { border-color: var(--color-success); }
    .toast-error { border-color: var(--color-error); }
    .toast-warning { border-color: var(--color-warning); }
    .toast-info { border-color: var(--color-primary); }

    .toast-message {
      font-size: var(--text-sm);
      color: var(--color-text);
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 18px;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .toast { animation: none; }
    }
  `],
})
export class ToastComponent {
  toasts: Toast[] = [];
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
