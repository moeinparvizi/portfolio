import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="modal-close" (click)="close.emit()">✕</button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-lg);
      animation: fadeIn 0.2s ease-out;
    }

    .modal-container {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg) var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      background: var(--color-surface);
      z-index: 1;

      h3 {
        margin: 0;
        font-size: var(--text-lg);
      }
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 20px;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--color-surface-alt);
        color: var(--color-text);
      }
    }

    .modal-body {
      padding: var(--space-xl);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .modal-container {
        max-height: 95vh;
        margin: var(--space-sm);
      }

      .modal-body {
        padding: var(--space-lg);
      }
    }
  `],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}
