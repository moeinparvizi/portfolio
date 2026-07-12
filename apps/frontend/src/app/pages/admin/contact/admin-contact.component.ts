import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { ContactMessage } from '../../../core/models';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Messages</h1>
        <div class="stats">
          <span class="stat">{{ messages.length }} Total</span>
          <span class="stat unread">{{ unreadCount }} Unread</span>
        </div>
      </div>

      <!-- Message Detail Modal -->
      @if (selectedMessage) {
        <app-glass-card>
          <div class="message-detail">
            <div class="detail-header">
              <div class="sender-info">
                <h3>{{ selectedMessage.name }}</h3>
                <a [href]="'mailto:' + selectedMessage.email" class="email">{{ selectedMessage.email }}</a>
              </div>
              <button class="btn btn-ghost btn-sm" (click)="selectedMessage = null">✕</button>
            </div>

            @if (selectedMessage.subject) {
              <p class="subject">{{ selectedMessage.subject }}</p>
            }

            <div class="message-body">
              {{ selectedMessage.message }}
            </div>

            <div class="detail-footer">
              <span class="date">Received: {{ formatDate(selectedMessage.createdAt) }}</span>
              <div class="detail-actions">
                <a [href]="'mailto:' + selectedMessage.email" class="btn btn-primary btn-sm">Reply via Email</a>
                @if (!selectedMessage.read) {
                  <button class="btn btn-ghost btn-sm" (click)="markRead(selectedMessage!.id)">Mark as Read</button>
                }
              </div>
            </div>
          </div>
        </app-glass-card>
      }

      <!-- Messages List -->
      <div class="list">
        @for (msg of messages; track msg.id) {
          <app-glass-card [hoverable]="true">
            <div class="message-item" [class.unread]="!msg.read" (click)="viewMessage(msg)">
              <div class="message-content">
                <div class="message-header">
                  <div class="sender">
                    <strong>{{ msg.name }}</strong>
                    @if (!msg.read) {
                      <span class="unread-dot"></span>
                    }
                  </div>
                  <span class="date">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <p class="email">{{ msg.email }}</p>
                @if (msg.subject) {
                  <p class="subject">{{ msg.subject }}</p>
                }
                <p class="preview">{{ msg.message | slice:0:100 }}{{ msg.message.length > 100 ? '...' : '' }}</p>
              </div>
              <div class="message-actions" (click)="$event.stopPropagation()">
                @if (!msg.read) {
                  <button class="btn btn-ghost btn-sm" (click)="markRead(msg.id)">Mark Read</button>
                }
                <button class="btn btn-ghost btn-sm btn-danger" (click)="confirmDelete(msg.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        } @empty {
          <div class="empty-state">
            <p>No messages yet.</p>
          </div>
        }
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        [danger]="true"
        confirmLabel="Delete"
        (confirm)="deleteItem()"
        (cancel)="showConfirm = false"
      />
    </div>
  `,
  styles: [`
    .admin-page {
      padding: var(--space-xl);
      max-width: 1000px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      h1 { font-size: var(--text-2xl); margin: 0; }
    }

    .stats { display: flex; gap: var(--space-md); }
    .stat {
      font-size: var(--text-sm);
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-md);
      background: var(--color-surface-alt);
      &.unread { background: rgba(37, 99, 235, 0.1); color: var(--color-primary); }
    }

    .message-detail { margin-bottom: var(--space-xl); }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-lg);
    }

    .sender-info h3 { margin: 0; }
    .email { color: var(--color-primary); font-size: var(--text-sm); }

    .subject {
      font-size: var(--text-lg);
      font-weight: 500;
      margin-bottom: var(--space-md);
    }

    .message-body {
      padding: var(--space-lg);
      background: var(--color-surface-alt);
      border-radius: var(--radius-md);
      white-space: pre-wrap;
      line-height: 1.6;
    }

    .detail-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .detail-actions { display: flex; gap: var(--space-sm); }

    .list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .message-item {
      display: flex;
      justify-content: space-between;
      gap: var(--space-lg);
      cursor: pointer;
      &.unread {
        border-left: 3px solid var(--color-primary);
        padding-left: var(--space-md);
      }
    }

    .message-content { flex: 1; }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }

    .sender {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
    }

    .date { font-size: var(--text-xs); color: var(--color-text-muted); }

    .email {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin: 0;
    }

    .subject {
      font-weight: 500;
      margin: var(--space-sm) 0;
    }

    .preview {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      margin: 0;
    }

    .message-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      align-items: flex-end;
    }

    .btn-danger {
      color: var(--color-error);
      &:hover { background: rgba(239, 68, 68, 0.1); }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }
  `],
})
export class AdminContactComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  messages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;
  showConfirm = false;
  deleteId: string | null = null;

  get unreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getMessages().subscribe({
      next: (m) => {
        this.messages = m;
        this.cdr.detectChanges();
      },
    });
  }

  viewMessage(msg: ContactMessage) {
    this.selectedMessage = msg;
    if (!msg.read) {
      this.markRead(msg.id);
    }
  }

  markRead(id: string) {
    this.api.markRead(id).subscribe(() => {
      this.load();
      if (this.selectedMessage?.id === id) {
        this.selectedMessage = { ...this.selectedMessage!, read: true };
      }
    });
  }

  confirmDelete(id: string) {
    this.deleteId = id;
    this.showConfirm = true;
  }

  deleteItem() {
    if (this.deleteId) {
      this.api.deleteMessage(this.deleteId).subscribe({
        next: () => {
          if (this.selectedMessage?.id === this.deleteId) {
            this.selectedMessage = null;
          }
          this.load();
          this.showConfirm = false;
        },
        error: () => {
          this.showConfirm = false;
        },
      });
    }
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
