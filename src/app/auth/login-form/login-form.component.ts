import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginUserdata} from '../../../shared/interfaces/login-userdata';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  protected signInForm: FormGroup;

  constructor(private fbService: FirebaseService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['test@gmail.com', [
        Validators.required,
        Validators.email]],
      password: ['test@gmail.com', [
        Validators.required,
        Validators.minLength(5)]]
    });
  }

  login(data: LoginUserdata) {
    this.fbService.login(data);
  }

  get authErrors() {
    return this.fbService.authError;
  }

}
