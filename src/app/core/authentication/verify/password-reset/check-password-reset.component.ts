import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  template: `
    <div
      class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center"
      style="min-height: 100vh"
    >
      <svg-icon src="assets/img/svgs/truck-assist-logo-icon.svg"></svg-icon>
      <div class="error" *ngIf="hasError">
        <p><b>Error {{hasError.code}}</b></p>
        <p>{{hasError.message}}</p>
      </div>
    </div>
  `,
  styles: ['.error{display: flex;flex-direction:column;align-items: center;justify-content: center;margin: 50px 0} .error p{color: #919191;font-size: 20px;line-height: 24px;margin: 0;padding: 0;font-weight: 300;} .error p:first-of-type{color: #5673aa;font-size: 32px;line-height: 39px;font-weight: 700;}']
})

export class CheckPasswordResetComponent implements OnInit {
  userParams: { hashedUsername: string; code: string };
  hasError;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((response: any) => {
      this.userParams = response;
      console.log('params password:', this.userParams);
    });
    this.checkResetPassword(this.userParams);
  }

  checkResetPassword(params) {
    this.authService.checkResetPassword(params.hashedUsername, params.code).subscribe(
      (response: any) => {
        localStorage.setItem('resetPasswordToken', response.token);
        setTimeout(() => {
          this.router.navigate(['/user/password/reset']);
        }, 3000);
      }, (error: any) => {
        this.hasError = error.error;
      }
    );
  }
}
