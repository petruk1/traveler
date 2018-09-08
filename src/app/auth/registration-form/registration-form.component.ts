import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../shared/validators/custom-validators';
import {FirebaseService} from '../../../services/firebase.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  protected registrationForm: FormGroup = null;

  constructor(private fb: FormBuilder,
              private fbs: FirebaseService) {
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required,
        Validators.email],
        CustomValidators.emailAbilityValidator(this.fbs)],
      password: ['', [Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  createAccount(data):void{
    this.fbs.create(data);
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get surname() {
    return this.registrationForm.get('surname');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

}
