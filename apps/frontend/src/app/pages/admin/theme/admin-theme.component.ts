import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-theme',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="admin-page"><h1>Theme Settings</h1><p>Coming soon...</p></div>`,
  styles: [`.admin-page { padding: var(--space-xl); }`],
})
export class AdminThemeComponent {}
