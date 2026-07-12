import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="remove(toast.id)">
          <div class="toast-glow"></div>
          <div class="toast-content">
            <span class="toast-icon">{{ getIcon(toast.type) }}</span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="remove(toast.id); $event.stopPropagation()">✕</button>
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
      pointer-events: none;
    }

    [dir='rtl'] .toast-container {
      right: auto;
      left: var(--space-lg);
    }

    .toast {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-lg);
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(99, 102, 241, 0.1);
      animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      overflow: hidden;
      pointer-events: auto;

      &:hover {
        transform: translateX(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 80px rgba(99, 102, 241, 0.15);
      }
    }

    .toast-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      border-radius: 4px 0 0 4px;
    }

    .toast-success .toast-glow {
      background: linear-gradient(180deg, #10B981, #059669);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
    }

    .toast-error .toast-glow {
      background: linear-gradient(180deg, #EF4444, #DC2626);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    }

    .toast-warning .toast-glow {
      background: linear-gradient(180deg, #F59E0B, #D97706);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
    }

    .toast-info .toast-glow {
      background: linear-gradient(180deg, #6366F1, #4F46E5);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex: 1;
    }

    .toast-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .toast-success .toast-icon { color: #10B981; }
    .toast-error .toast-icon { color: #EF4444; }
    .toast-warning .toast-icon { color: #F59E0B; }
    .toast-info .toast-icon { color: #6366F1; }

    .toast-message {
      font-size: var(--text-sm);
      color: #F1F5F9;
      font-weight: 500;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color var(--transition-fast);
      flex-shrink: 0;

      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    @keyframes toastSlideIn {
      0% {
        transform: translateX(120%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes toastSlideOut {
      0% {
        transform: translateX(0);
        opacity: 1;
        max-height: 100px;
        margin-bottom: var(--space-sm);
      }
      50% {
        transform: translateX(120%);
        opacity: 0;
      }
      100% {
        transform: translateX(120%);
        opacity: 0;
        max-height: 0;
        margin-bottom: 0;
        padding: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
        &:hover { transform: none; }
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        left: var(--space-md);
        right: var(--space-md);
        max-width: none;
      }
    }
  `],
})
export class ToastComponent {
  toasts: Toast[] = [];
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });

    // Auto-remove after 4 seconds
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  getIcon(type: Toast['type']): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  }

  // Convenience methods
  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string) { this.show(message, 'info'); }
}
