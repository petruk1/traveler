import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginUserdata} from '../interfaces';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  public signInForm: FormGroup;

  constructor(private fbService: FirebaseService,
              private formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)]]
    });
  }

  public login(data: LoginUserdata): void {
    this.fbService.login(data);
  }

  public get authErrors(): object {
    return this.fbService.authError;
  }

}
