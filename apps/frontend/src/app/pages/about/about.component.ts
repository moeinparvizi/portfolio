import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import type { Profile } from '../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslatePipe, GlassCardComponent],
  template: `
    <section class="section">
      <div class="container">
        <h1>About Me</h1>
        @if (profile) {
          <app-glass-card>
            <div class="about-content">
              @if (profile.avatarUrl) {
                <img [src]="profile.avatarUrl" [alt]="profile.fullName | translate" class="avatar" />
              }
              <div class="about-text">
                <h2>{{ profile.fullName | translate }}</h2>
                <p class="job-title">{{ profile.jobTitle | translate }}</p>
                <p class="summary">{{ profile.summary | translate }}</p>
              </div>
            </div>
          </app-glass-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .about-content {
      display: flex;
      gap: var(--space-xl);
      align-items: flex-start;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }

    .avatar {
      width: 200px;
      height: 200px;
      border-radius: var(--radius-xl);
      object-fit: cover;
      flex-shrink: 0;
    }

    .job-title {
      color: var(--color-primary);
      font-weight: 500;
      margin-bottom: var(--space-md);
    }

    .summary {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      line-height: 1.8;
    }
  `],
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  profile: Profile | null = null;

  ngOnInit() {
    this.api.getProfile().subscribe(p => this.profile = p);
  }
}
