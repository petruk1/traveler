import {AbstractControl, ValidatorFn} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';

export class CustomValidators {
  private static _emailTimer: any;

  static emailAvailability(delay: number, firebaseService: FirebaseService): ValidatorFn {
    return (control: AbstractControl): Promise<any> => {
      clearTimeout(this._emailTimer);
      return new Promise((resolve => {
        this._emailTimer = setTimeout(() => resolve(firebaseService.isEmailAvailable(control.value)
          .then((res: string[]) => res.length ? {emailAvailability: true} : null)), delay);
      }));
    };
  }
}
