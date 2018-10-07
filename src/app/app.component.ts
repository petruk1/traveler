import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {take} from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected isCheckingUserAuth = true;

  constructor(private auth: AngularFireAuth) {
    this.auth.user.pipe(
      take(1)
    ).subscribe(() => this.isCheckingUserAuth = false);
  }

}
