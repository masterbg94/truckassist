import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../model/address';
import { AuthenticationService } from '../../services/authentication.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('addressInput') addressInput: ElementRef;

  public registerForm: FormGroup;
  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  public hidePassword = true;
  public regPass: any;
  public passwordStrength: any;
  isValidAddress = false;
  address: Address;

  public passwordType = 'text';

  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private router: Router,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.createForm();
    setTimeout(() => {
      this.transformInputData();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.passwordType = 'password';
    }, 500);
  }

  private transformInputData() {
    const data = {
      companyName: 'upper',
      firstName: 'capitalize',
      lastName: 'capitalize',
      email: 'lower',
      addressUnit: 'upper'
    };

    this.shared.handleInputValues(this.registerForm, data);
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: '',
      companyName: ['', Validators.required],
      taxNumber: [null, Validators.required],
      address: ['', Validators.required],
      addressUnit: ''
    }, { validators: this.checkPasswords });
  }

  /**
   * Register user function
   */
  public registerUser() {
    if (!this.shared.markInvalid(this.registerForm)) { return false; }
    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();      return;
    }

    const user = this.registerForm.getRawValue();

    const saveData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      taxNumber: user.taxNumber,
      addressUnit: user.addressUnit,
      companyName: user.companyName,
      doc: {
        additional: {
          mcNumber: null,
          usDotNumber: null,
          phone: null,
          payPeriod: null,
          endingIn: null,
          email: '',
          address: this.address,
          addressUnit: user.addressUnit,
          irpNumber: null,
          iftaNumber: null,
          scacNumber: null,
          ipassEzpass: null,
          fax: null,
          timeZone: null,
          webUrl: '',
          currency: null,
          note: '',
          accountNumber: null,
          routingNumber: null,
          bankData: null,
          phoneDispatch: null,
          emailDispatch: '',
          phoneAccounting: null,
          emailAccounting: null,
          phoneSafety: null,
          emailSafety: '',
        },
        offices: [],
        factoringCompany: [],
      },
    };

    this.authService.registerUser(saveData).subscribe(
      res => {
        this.notification.success('Registration is successful', 'Success:');
        localStorage.setItem('thankYouEmail', saveData.email);
        setTimeout(() => {
          this.router.navigate(['/register/thanks']);
        }, 1000);
      },
      error => {
        this.shared.handleServerError();
      }
    );
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.registerForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  public randomPassword(length: number = 18) {
    const chars =
      '+_)(*&^%$#@!=-0987654321}{POIUYTREWQ|":LKIJUHGFDSA?><MNBVCXZ][poiuytrewq\';lkjhgfdsa/.,mnbvcxz';
    this.regPass = '';
    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * chars.length);
      this.regPass += chars.charAt(i);
    }
    this.hidePassword = false;
    this.passwordStrength = 'excellent';
    return this.regPass;
  }

  public onStrengthChanged(strength: number) {
    switch (strength) {
      case 20:
        this.passwordStrength = 'very weak';
        break;
      case 40:
        this.passwordStrength = 'weak';
        break;
      case 60:
        this.passwordStrength = 'good';
        break;
      case 80:
        this.passwordStrength = 'secure';
        break;
      case 100:
        this.passwordStrength = 'excellent';
        break;
    }
  }

  public keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
      ) {
      this.registerUser();
    }
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  checkPasswords(registerForm: FormGroup) { // here we have the 'passwords' group
    const password = registerForm.get('password').value;
    const confirmPassword = registerForm.get('confirmPassword').value;
    // this.registerForm.get('')
    return password === confirmPassword ? false : { notSame: true };
  }

  returnRegisterValue() {
    console.log('not same' , this.registerForm.errors);
    // this.sameLength();
    return (this.registerForm.errors);
  }

  sameLength() {
    console.log((this.registerForm.get('password').value.length === this.registerForm.get('confirmPassword').value.length));
    return (this.registerForm.get('password').value.length === this.registerForm.get('confirmPassword').value.length);
  }

}
