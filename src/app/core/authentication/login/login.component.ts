import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SharedService } from '../../services/shared.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm: FormGroup;

  public passwordType = 'text';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private notification: NotificationService,
    private router: Router,
    private spinner: SpinnerService,
    private shared: SharedService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.passwordType = 'password';
    }, 500);
  }

  /**
   * User login function
   *
   * @param e Any
   */
  public userLogin(e: any) {
    e.preventDefault();
    if (!this.shared.markInvalid(this.loginForm)) { return false; }
    const data = this.loginForm.value;
    this.authService.userLogin(data).subscribe(
      (res: any) => {
        console.log(res);
        this.notification.success('Login is success', 'Success');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
        this.spinner.show(false);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }
}
