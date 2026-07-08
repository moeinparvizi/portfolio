import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section">
      <div class="container">
        <h1>Privacy Policy</h1>
        <div class="content">
          <h2>Information Collection</h2>
          <p>This portfolio website collects information you voluntarily provide through the contact form, including your name, email address, and message content.</p>

          <h2>Use of Information</h2>
          <p>The information collected is used solely to respond to your inquiries and is not shared with third parties.</p>

          <h2>Cookies</h2>
          <p>This website uses only essential cookies for theme and language preferences. No tracking or analytics cookies are used.</p>

          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>

          <h2>Contact</h2>
          <p>For questions about this privacy policy, please use the contact form on this website.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .content {
      max-width: 700px;
      margin-top: var(--space-xl);

      h2 {
        font-size: var(--text-xl);
        margin-top: var(--space-xl);
        margin-bottom: var(--space-md);
      }

      p {
        color: var(--color-text-secondary);
        line-height: 1.8;
      }
    }
  `],
})
export class PrivacyComponent {}
