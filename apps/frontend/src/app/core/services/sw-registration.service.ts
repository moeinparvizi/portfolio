import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class SwRegistrationService {
  private updates = inject(SwUpdate, { optional: true });

  constructor() {
    if (this.updates) {
      this.updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          // Prompt user to reload for new version
          if (confirm('New version available. Reload to update?')) {
            window.location.reload();
          }
        }
      });
    }
  }
}
