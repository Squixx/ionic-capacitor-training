import { Injectable } from '@angular/core';
import { Session } from '@app/models';
import { login, loginFailure, loginSuccess } from '@app/store/actions';
import { NavController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        from(this.fakeLogin(action.email, action.password)).pipe(
          map((session) => loginSuccess({ session })),
          catchError((error) => of(loginFailure({ errorMessage: error.message })))
        )
      )
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

  constructor(private actions$: Actions, private navController: NavController) {}
}