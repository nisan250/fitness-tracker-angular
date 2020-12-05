import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  // authChange = new Subject<boolean>();

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: 'START_LOADING' });
    this.store.dispatch(new UI.StartLoading());

    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    // this.store.dispatch({ type: 'START_LOADING' });
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
        // this.uiService.loadingStateChanged.next(false);
        // this.store.dispatch({ type: 'STOP_LOADING' });
        this.store.dispatch(new UI.StopLoading());
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  // isAuth(): boolean {
  //   return this.isAuthenticated;
  // }
}
