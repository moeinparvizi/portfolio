import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpaceBackgroundComponent } from './shared/components/space-background/space-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpaceBackgroundComponent],
  template: `
    <app-space-background></app-space-background>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {}
