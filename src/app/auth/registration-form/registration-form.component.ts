import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../shared/validators/custom-validators';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  protected registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
              private firebaseService: FirebaseService) {
  }

  public ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null,
        [
          Validators.required,
          Validators.email
        ],
        [
          CustomValidators.emailAvailability(600, this.firebaseService)
        ]
      ],
      password: [null, [Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  public createAccount(data): void {
    this.firebaseService.create(data);
  }

  public get name(): AbstractControl {
    return this.registrationForm.get('name');
  }

  public get surname(): AbstractControl {
    return this.registrationForm.get('surname');
  }

  public get email(): AbstractControl {
    return this.registrationForm.get('email');
  }

  public get password(): AbstractControl {
    return this.registrationForm.get('password');
  }

}
