import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const id = this.nextId++;
    this.toasts.update(t => [...t, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
