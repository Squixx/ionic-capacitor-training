import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { selectAuthToken, State } from '@app/store';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, take, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private store: Store<State>,
    private sessionVault: SessionVaultService,
    private navController: NavController
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectAuthToken).pipe(
      take(1),
      mergeMap((token) => (token ? of(token) : this.sessionVault.restoreSession())),
      map((value) => !!value),
      tap((sessionExists) => {
        if (!sessionExists) {
          this.navController.navigateRoot(['/', 'login']);
        }
      })
    );
  }
}
