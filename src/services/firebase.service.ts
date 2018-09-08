import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {LoginUserdata} from '../shared/interfaces/login-userdata';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private _authError = null;

  constructor(private af: AngularFireAuth) {
  }

  get authError() {
    return this._authError;
  }

  login(data: LoginUserdata): void {
    console.log(data)
    const {email, password} = data;
    this.af.auth.signInWithEmailAndPassword(email, password)
      .then(() => this._authError = null)
      .catch(err => this._authError = err);
  }

  logout(): void {
    this.af.auth.signOut().catch(err => console.log(err));
  }

  isEmailAvailable(email): Promise<any> {
    return this.af.auth.fetchSignInMethodsForEmail(email);
  }

  create(data: LoginUserdata): void {
    const {email, password, name, surname} = data;
    this.af.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.login(data))
      .then(() => this.af.auth.currentUser
        .updateProfile({displayName: `${name} ${surname}`, photoURL: null}));
  }

}
