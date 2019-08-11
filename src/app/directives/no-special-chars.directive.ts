import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidationErrors, Form } from '@angular/forms';

@Directive({
  selector: '[appNoSpecialChars]',
  providers:[{provide: NG_VALIDATORS, useExisting: NoSpecialCharsDirective, multi:true}]
})
export class NoSpecialCharsDirective implements Validator{
    constructor() { }

    validate(control: FormControl): ValidationErrors {
      const hasSpecialChars = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(control.value);
      const message = {
        'hasSpecialChars': {
          'message': 'No special characters allowed'
        }
      };
      return hasSpecialChars ? message : null;
    }
}
