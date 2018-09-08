import {AbstractControl, ValidatorFn} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';

export class CustomValidators {
  static emailAbilityValidator(fbs: FirebaseService): ValidatorFn {
    return (control: AbstractControl): Promise<any> => {
      return fbs.isEmailAvailable(control.value)
        .then(res => {
          console.log(res)
          return res.length ? {emailAvailability: true} : null;
        }).catch(err => console.log(err));
    };
  }
}
