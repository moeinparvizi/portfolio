import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>Contact Me</h1>
        <app-glass-card>
          <form class="contact-form" (ngSubmit)="submit()">
            <div class="form-row">
              <input type="text" placeholder="Your Name" [(ngModel)]="form.name" name="name" required />
              <input type="email" placeholder="Your Email" [(ngModel)]="form.email" name="email" required />
            </div>
            <input type="text" placeholder="Subject" [(ngModel)]="form.subject" name="subject" />
            <textarea placeholder="Your message..." [(ngModel)]="form.message" name="message" required rows="6"></textarea>
            <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting">
              {{ submitting ? 'Sending...' : 'Send Message' }}
            </button>
            @if (success) {
              <p class="success">Message sent successfully!</p>
            }
            @if (error) {
              <p class="error">{{ error }}</p>
            }
          </form>
        </app-glass-card>
      </div>
    </section>
  `,
  styles: [`
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      max-width: 600px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
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

    .success { color: var(--color-success); margin-top: var(--space-md); }
    .error { color: var(--color-error); margin-top: var(--space-md); }
  `],
})
export class ContactComponent {
  private api = inject(ApiService);
  submitting = false;
  success = false;
  error = '';

  form = { name: '', email: '', subject: '', message: '' };

  submit() {
    if (!this.form.name || !this.form.email || !this.form.message) return;
    this.submitting = true;
    this.success = false;
    this.error = '';

    this.api.submitContact(this.form).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.form = { name: '', email: '', subject: '', message: '' };
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to send message. Please try again.';
      },
    });
  }
}
