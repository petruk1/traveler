import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginUserdata} from '../app/auth/interfaces';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subject} from 'rxjs/index';

export class Item {
  body: string;
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _authError: object;
  private userId: string;
  points: Subject<object[]> = new Subject();

  constructor(private fireAuth: AngularFireAuth,
              private fireDatabase: AngularFireDatabase) {
    this.fireAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
        this.loadPoints();
      }
    });
  }

  public createPoint(e: any): void {
    e.name = 'mock';
    this.fireDatabase.database.ref(`${this.userId}/points`).push(e);
  }

  private loadPoints(): void {
    this.fireDatabase.database.ref(`${this.userId}/points`)
      .on('value', x => this.points.next(Object.values(x.val())));
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
      .then(() => this._authError = null)
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
