import { Injectable } from '@angular/core';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { Session } from '@app/models';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  unauthError,
} from '@app/store/actions';
import { NavController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap(
        (action) =>
          this.auth.login(action.email, action.password).pipe(
            tap((session) => {
              if (session) {
                this.sessionVault.login(session);
              }
            }),
            map((session) =>
              session ? loginSuccess({ session }) : loginFailure({ errorMessage: 'Invalid Username or Password' })
            ),
            catchError(() => of(loginFailure({ errorMessage: 'Unknown error in login' })))
          )
        // from(this.fakeLogin(action.email, action.password)).pipe(
        //   tap((session) => this.sessionVault.login(session)),
        //   map((session) => loginSuccess({ session })),
        //   catchError((error) => of(loginFailure({ errorMessage: error.message })))
        // )
      )
    );
  });
  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this.auth.logout().pipe(
          tap(() => this.sessionVault.logout()),
          map(() => logoutSuccess()),
          catchError(() => of(logoutFailure({ errorMessage: 'Unknown error in logout' })))
        )
      )
      // tap(() => this.sessionVault.logout()),
      // map(() => logoutSuccess()),
      // catchError((error) => of(logoutFailure({ errorMessage: error.message })))
    );
  });

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.navController.navigateRoot(['/']))
      );
    },
    { dispatch: false }
  );
  logoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => this.navController.navigateRoot(['/', 'login']))
      );
    },
    { dispatch: false }
  );
  unauthError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(unauthError),
      tap(() => {
        this.sessionVault.logout();
      }),
      map(() => logoutSuccess())
    );
  });
  private fakeLogin(email: string, password: string): Promise<Session> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (password === 'test') {
          resolve({
            user: { id: 73, firstName: 'Ken', lastName: 'Sodemann', email },
            token: '314159',
          });
        } else {
          reject(new Error('Invalid Username or Password'));
        }
      })
    );
  }

  constructor(
    private actions$: Actions,
    private auth: AuthenticationService,
    private navController: NavController,
    private sessionVault: SessionVaultService
  ) {}
}
