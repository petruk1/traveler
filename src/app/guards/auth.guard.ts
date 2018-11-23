import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {map, take, tap} from 'rxjs/internal/operators';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.auth.user.pipe(
      take(1),
      map((user: User) => !!user),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
