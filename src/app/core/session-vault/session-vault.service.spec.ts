import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { Session } from '@app/models';
import { SessionVaultService } from './session-vault.service';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { sessionRestored } from '@app/store/actions';

describe('SessionVaultService', () => {
  let service: SessionVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('saves the session in preferences', async () => {
      spyOn(Preferences, 'set');
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      await service.login(session);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'auth-session',
        value: JSON.stringify(session),
      });
    });
  });
  describe('restore session', () => {
    it('gets the session from preferences', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
      await service.restoreSession();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });

    describe('with a session', () => {
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      beforeEach(() => {
        spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: JSON.stringify(session) }));
      });

      it('resolves the session', async () => {
        expect(await service.restoreSession()).toEqual(session);
      });
      it('dispatches session restored', async () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        await service.restoreSession();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(sessionRestored({ session }));
      });
    });

    describe('without a session', () => {
      beforeEach(() => {
        spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
      });

      it('resolves null', async () => {
        expect(await service.restoreSession()).toEqual(null);
      });
      it('does not dispatch session restored', async () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        await service.restoreSession();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('clears the preferences', async () => {
      spyOn(Preferences, 'remove');
      await service.logout();
      expect(Preferences.remove).toHaveBeenCalledTimes(1);
      expect(Preferences.remove).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });
  });
});
