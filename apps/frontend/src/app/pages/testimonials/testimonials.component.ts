import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Testimonial } from '../../core/models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Testimonials</h1>

        <div class="testimonials-grid">
          @for (t of testimonials; track t.id) {
            <app-glass-card>
              <div class="testimonial">
                <p class="content">"{{ t.content | translate }}"</p>
                <div class="author">
                  @if (t.avatarUrl) {
                    <img [src]="t.avatarUrl" [alt]="t.name" class="avatar" />
                  }
                  <div>
                    <p class="name">{{ t.name }}</p>
                    @if (t.role) {
                      <p class="role">{{ t.role | translate }}{{ t.company ? ' at ' + t.company : '' }}</p>
                    }
                  </div>
                </div>
                @if (t.rating) {
                  <div class="rating">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span [class.filled]="star <= t.rating!">★</span>
                    }
                  </div>
                }
              </div>
            </app-glass-card>
          }
        </div>

        <!-- Submit Form -->
        <div class="submit-section">
          <h2>Leave a Testimonial</h2>
          <form class="testimonial-form" (ngSubmit)="submitTestimonial()">
            <input type="text" placeholder="Your Name" [(ngModel)]="newTestimonial.name" name="name" required />
            <input type="text" placeholder="Your Role" [(ngModel)]="newTestimonial.role" name="role" />
            <input type="text" placeholder="Company" [(ngModel)]="newTestimonial.company" name="company" />
            <textarea placeholder="Your testimonial..." [(ngModel)]="newTestimonial.content" name="content" required rows="4"></textarea>
            <button type="submit" class="btn btn-primary" [disabled]="submitting">
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-xl);
    }

    .content {
      font-style: italic;
      font-size: var(--text-lg);
      margin-bottom: var(--space-lg);
    }

    .author {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .name { font-weight: 600; }
    .role { font-size: var(--text-sm); color: var(--color-text-muted); }

    .rating {
      margin-top: var(--space-md);
      color: var(--color-border);
      span.filled { color: var(--color-warning); }
    }

    .submit-section {
      margin-top: var(--space-3xl);
    }

    .testimonial-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      max-width: 500px;
      margin-top: var(--space-lg);
    }

    input, textarea {
      padding: var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text);
      font-family: var(--font-body);
      font-size: var(--text-sm);

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }
  `],
})
export class TestimonialsComponent implements OnInit {
  private api = inject(ApiService);
  testimonials: Testimonial[] = [];
  submitting = false;

  newTestimonial: Partial<Testimonial> = {};

  ngOnInit() {
    this.api.getTestimonials().subscribe(t => this.testimonials = t);
  }

  submitTestimonial() {
    if (!this.newTestimonial.name || !this.newTestimonial.content) return;
    this.submitting = true;

    this.api.submitTestimonial({
      ...this.newTestimonial,
      content: { en: this.newTestimonial.content as string },
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.newTestimonial = {};
        alert('Thank you! Your testimonial will be reviewed.');
      },
      error: () => {
        this.submitting = false;
        alert('Something went wrong. Please try again.');
      },
    });
  }
}
