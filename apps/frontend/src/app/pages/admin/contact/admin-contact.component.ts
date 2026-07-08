import { Component, OnInit, inject } from '@angular/core';
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
      <h1>Contact Messages</h1>
      <div class="list">
        @for (msg of messages; track msg.id) {
          <app-glass-card>
            <div class="message-item" [class.unread]="!msg.read">
              <div class="info">
                <div class="header">
                  <strong>{{ msg.name }}</strong>
                  <span class="email">{{ msg.email }}</span>
                  <span class="date">{{ formatDate(msg.createdAt) }}</span>
                </div>
                @if (msg.subject) { <p class="subject">{{ msg.subject }}</p> }
                <p class="message">{{ msg.message }}</p>
              </div>
              <div class="actions">
                @if (!msg.read) {
                  <button class="btn btn-ghost btn-sm" (click)="markRead(msg.id)">Mark Read</button>
                }
                <button class="btn btn-ghost btn-sm" (click)="confirmDelete(msg.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        }
      </div>

      <app-confirm-dialog [open]="showConfirm" title="Delete" message="Delete this message?" [danger]="true" (confirm)="deleteItem()" (cancel)="showConfirm = false" />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 800px; }
    .list { margin-top: var(--space-xl); display: flex; flex-direction: column; gap: var(--space-md); }
    .message-item { display: flex; justify-content: space-between; gap: var(--space-lg); }
    .message-item.unread { border-left: 3px solid var(--color-primary); }
    .header { display: flex; gap: var(--space-md); align-items: center; flex-wrap: wrap; }
    .email { color: var(--color-text-muted); font-size: var(--text-sm); }
    .date { color: var(--color-text-muted); font-size: var(--text-xs); }
    .subject { font-weight: 500; margin-top: var(--space-sm); }
    .message { color: var(--color-text-secondary); font-size: var(--text-sm); margin-top: var(--space-sm); }
    .actions { display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-end; }
  `],
})
export class AdminContactComponent implements OnInit {
  private api = inject(ApiService);
  messages: ContactMessage[] = [];
  showConfirm = false;
  deleteId: string | null = null;

  ngOnInit() { this.load(); }
  load() { this.api.getMessages().subscribe(m => this.messages = m); }
  markRead(id: string) { this.api.markRead(id).subscribe(() => this.load()); }
  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }
  deleteItem() { if (this.deleteId) { this.api.deleteMessage(this.deleteId).subscribe(() => { this.load(); this.showConfirm = false; }); } }
  formatDate(d: string) { return new Date(d).toLocaleDateString(); }
}
