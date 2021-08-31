import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../services/authentication.service';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  newPasswordForm: FormGroup;
  congrats: boolean;

  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorage() {
  //   localStorage.removeItem('resetPasswordToken');
  // }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private shared: SharedService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.newPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', Validators.required],
        confirmPassword: ['']
      },
      { validators: this.checkPasswords }
    );
  }

  checkPasswords(newPasswordForm: FormGroup) {
    const password = newPasswordForm.get('newPassword').value;
    const confirmPassword = newPasswordForm.get('confirmPassword').value;
    return password === confirmPassword ? false : { notSame: true };
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  confirmPassword() {
    this.authService
      .updateResetPassword(this.newPasswordForm.getRawValue())
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          setTimeout(() => {
            this.congrats = !this.congrats;
            localStorage.removeItem('resetPasswordToken');
            this.goToLogin();
          }, 2000);
        },
        (error: any) => {
          console.log('updateResetPassword error', error);
        }
      );
  }

  goToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 6000);
  }
}
