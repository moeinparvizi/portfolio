import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Testimonial } from '../../../core/models';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, GlassCardComponent, ConfirmDialogComponent],
  template: `
    <div class="admin-page">
      <h1>Testimonials</h1>
      <div class="list">
        @for (t of testimonials; track t.id) {
          <app-glass-card>
            <div class="testimonial-item">
              <div class="info">
                <strong>{{ t.name }}</strong>
                @if (t.company) { <span class="company">{{ t.company }}</span> }
                <p class="content">{{ t.content['en'] || '' }}</p>
              </div>
              <div class="actions">
                @if (!t.approved) {
                  <button class="btn btn-primary btn-sm" (click)="approve(t.id)">Approve</button>
                } @else {
                  <span class="badge approved">Approved</span>
                }
                <button class="btn btn-ghost btn-sm" (click)="confirmDelete(t.id)">Delete</button>
              </div>
            </div>
          </app-glass-card>
        }
      </div>

      <app-confirm-dialog [open]="showConfirm" title="Delete" message="Delete this testimonial?" [danger]="true" (confirm)="deleteItem()" (cancel)="showConfirm = false" />
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--space-xl); max-width: 800px; }
    .list { margin-top: var(--space-xl); display: flex; flex-direction: column; gap: var(--space-md); }
    .testimonial-item { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); }
    .company { font-size: var(--text-sm); color: var(--color-text-muted); margin-left: var(--space-sm); }
    .content { margin-top: var(--space-sm); color: var(--color-text-secondary); font-size: var(--text-sm); }
    .actions { display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-end; }
    .badge { font-size: var(--text-xs); padding: 2px 8px; border-radius: var(--radius-sm); &.approved { background: var(--color-success); color: white; } }
  `],
})
export class AdminTestimonialsComponent implements OnInit {
  private api = inject(ApiService);
  testimonials: Testimonial[] = [];
  showConfirm = false;
  deleteId: string | null = null;

  ngOnInit() { this.load(); }
  load() { this.api.getAllTestimonials().subscribe(t => this.testimonials = t); }
  approve(id: string) { this.api.approveTestimonial(id).subscribe(() => this.load()); }
  confirmDelete(id: string) { this.deleteId = id; this.showConfirm = true; }
  deleteItem() { if (this.deleteId) { this.api.deleteTestimonial(this.deleteId).subscribe(() => { this.load(); this.showConfirm = false; }); } }
}
