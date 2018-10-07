import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginUserdata} from '../auth/interfaces';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subject} from 'rxjs/index';
import {User} from 'firebase';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private pointsSubject: Subject<Point[]> = new Subject();
  private _authError: object;
  private userId: string;
  public points$ = this.pointsSubject.asObservable();

  constructor(private fireAuth: AngularFireAuth,
              private fireDatabase: AngularFireDatabase,
              private zone: NgZone,
              private router: Router) {
    this.fireAuth.authState.subscribe((user: User) => {
      if (user) {
        this.userId = user.uid;
        this.loadPoints();
      }
    });
  }

  public createPoint(point: Point): void {
    this.fireDatabase.database.ref(`${this.userId}/points`).push(point);
  }

  private loadPoints(): void {
    this.fireDatabase.database.ref(`${this.userId}/points`)
      .on('value', x => {
        this.zone.run(() => this.pointsSubject.next(Object.values(x.val())));
      });
  }

  public get authError(): object {
    return this._authError;
  }

  public set authError(error: object) {
    this._authError = error;
  }

  public login(data: LoginUserdata): void {
    const {email, password} = data;
    this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/map']);
        this._authError = null;
      })
      .catch((err: object) => this.authError = err);
  }

  public logout(): void {
    this.fireAuth.auth.signOut();
  }

  public isEmailAvailable(email: string): Promise<any> {
    return this.fireAuth.auth.fetchSignInMethodsForEmail(email);
  }

  public create(data: LoginUserdata): void {
    const {email, password, name, surname} = data;
    this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.login(data))
      .then(() => this.fireAuth.auth.currentUser
        .updateProfile({displayName: `${name} ${surname}`, photoURL: null}));
  }

}
