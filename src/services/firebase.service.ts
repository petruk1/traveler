import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginUserdata} from '../app/auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _authError: object;

  constructor(private af: AngularFireAuth) {
  }

  public get authError(): object {
    return this._authError;
  }

  public set authError(error: object) {
    this._authError = error;
  }

  login(data: LoginUserdata): void {
    const {email, password} = data;
    this.af.auth.signInWithEmailAndPassword(email, password)
      .then(() => this._authError = null)
      .catch((err: object) => this.authError = err);
  }

  public logout(): void {
    this.af.auth.signOut();
  }

  public isEmailAvailable(email: string): Promise<any> {
    return this.af.auth.fetchSignInMethodsForEmail(email);
  }

  public create(data: LoginUserdata): void {
    const {email, password, name, surname} = data;
    this.af.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.login(data))
      .then(() => this.af.auth.currentUser
        .updateProfile({displayName: `${name} ${surname}`, photoURL: null}));
  }

}
