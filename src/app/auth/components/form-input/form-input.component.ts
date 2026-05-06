import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() iconClass?: string;
  @Input() iconImg?: string;

  @Input() formErrorMessage?: string;
  @Input() formGroup?: FormGroup;
  @Input() formErrorKey?: string;

  @Input() patternErrorMessage: string = 'Invalid format';
  @Input() maxLengthErrorMessage: string = 'Maximum length exceeded';

  @Input() showToggle: boolean = false;

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  hasFormError(): boolean {
    return !!(this.formGroup?.errors?.[this.formErrorKey!] && this.control?.touched);
  }
}
