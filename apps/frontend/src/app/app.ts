import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpaceBackgroundComponent } from './shared/components/space-background/space-background.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpaceBackgroundComponent, ToastComponent],
  template: `
    <app-space-background></app-space-background>
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class App {}
