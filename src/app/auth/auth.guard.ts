import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { Observable } from 'rxjs';
import { Router, Route } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad(
    route: Route
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
