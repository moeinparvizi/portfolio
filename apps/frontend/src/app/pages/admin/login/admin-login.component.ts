import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, GlassCardComponent],
  template: `
    <div class="login-page">
      <app-glass-card>
        <form class="login-form" (ngSubmit)="login()">
          <h1>Admin Login</h1>
          <input type="text" placeholder="Username" [(ngModel)]="username" name="username" required />
          <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          @if (error) {
            <p class="error">{{ error }}</p>
          }
        </form>
      </app-glass-card>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      width: 320px;

      h1 {
        font-size: var(--text-2xl);
        text-align: center;
        margin-bottom: var(--space-md);
      }
    }

    input {
      padding: var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text);
      font-family: var(--font-body);

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    .error {
      color: var(--color-error);
      text-align: center;
    }
  `],
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  loading = false;
  error = '';

  login() {
    this.loading = true;
    this.error = '';

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        // Get the return URL from query params or default to dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid credentials';
      },
    });
  }
}
