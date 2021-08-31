import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../../../services/shared.service';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
  selector: 'app-verify-password-component',
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.scss']
})
export class VerifyPasswordComponent implements OnInit {
  public verifyPasswordForm: FormGroup;
  userId: number;
  additionalData;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private shared: SharedService,
              private authService: AuthenticationService,
              private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((r) => {
      this.userId = parseFloat(r.id);
      this.canSetPassword(r.hashedUsername, parseFloat(r.id));
    });
  }

  createForm() {
    this.verifyPasswordForm = this.formBuilder.group({
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null],
      email: [null, Validators.required],
      address: [null],
      addressUnit: [''],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, { validators: this.checkPasswords });
  }

  checkPasswords(checkPasswordForm: FormGroup) { // here we have the 'passwords' group
    const password = checkPasswordForm.get('password').value;
    const confirmPassword = checkPasswordForm.get('confirmPassword').value;
    // this.registerForm.get('')
    return password === confirmPassword ? false : {notSame: true};
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  canSetPassword(hash: any, id: any) {
    this.authService.passwordStart(hash, id).subscribe(
      (resp: any) => {
        console.log('passwordStart', resp);
        console.log(JSON.parse(resp.loggedUser.userObject.doc));
        this.additionalData = JSON.parse(resp.loggedUser.userObject.doc);
        console.log(this.additionalData.address);
        this.preFillForm(resp.loggedUser.userObject);
      }, (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  preFillForm(data: any) {
    this.verifyPasswordForm.patchValue({
      name: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: JSON.parse(data.doc).phone,
      address: JSON.parse(data.doc).address.address,
      addressUnit: JSON.parse(data.doc).addressUnit
    });
  }

  setUserPassword() {
    const updateData = {
      newPassword: this.verifyPasswordForm.get('password').value,
      confirmPassword: this.verifyPasswordForm.get('confirmPassword').value
    };
    this.authService.setConfirmPassword(this.userId, updateData).subscribe(
      (res: any) => {
        console.log('setConfirmPassword', res);
        this.router.navigate(['/register/activated']);
      }, (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

}
