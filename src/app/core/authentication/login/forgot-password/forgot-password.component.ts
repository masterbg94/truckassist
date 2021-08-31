import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../../../services/shared.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {NotificationService} from '../../../../services/notification-service.service';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  userId = localStorage.getItem('');
  passwordEmailSent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private authService: AuthenticationService,
    private notification: NotificationService
  ) {
    this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  resetPassword() {
    const resetData = {
      email: this.forgotPasswordForm.get('email').value
    };
    this.authService.requestResetPassword(resetData).subscribe(
      (response: any) => {
        this.notification.success('Confirmation mail sent', 'Success');
        this.forgotPasswordForm.reset();
        this.passwordEmailSent = true;
      }
    );
  }
}
