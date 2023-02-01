import { Injectable } from '@angular/core';

import { Session } from '@app/models';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private key = 'auth-session';

  constructor() {}

  async login(session: Session): Promise<void> {
    await Preferences.set({ key: this.key, value: JSON.stringify(session) });
  }
  async restoreSession(): Promise<Session | null> {
    const { value } = await Preferences.get({ key: this.key });
    console.log(value);
    return value ? JSON.parse(value) : null;
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: this.key });
  }
}
