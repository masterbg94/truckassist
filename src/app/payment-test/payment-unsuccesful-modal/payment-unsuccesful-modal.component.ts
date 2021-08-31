import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
@Component({
  selector: 'app-payment-unsuccesful-modal',
  templateUrl: './payment-unsuccesful-modal.component.html',
  styleUrls: ['./payment-unsuccesful-modal.component.scss'],
})
export class PaymentUnsuccesfulModalComponent implements OnInit {
  @Input() inputData: any;
  paymentDetailsForm: FormGroup;
  headerFirst = '';
  markedTitle = '';
  textUnderlogoFirst = '';
  textUnderlogoSecond = '';
  headerSecond = '';
  checkedFirst = '';
  headerthird = '';
  checkedSecond = '';
  buttonText = '';
  formSubmitted = false;
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.loadInitData();
    this.createForm();
  }
  loadInitData(): void {
    this.headerFirst = this.inputData.data.headerFirst;
    this.markedTitle = this.inputData.data.markedTitle;
    this.textUnderlogoFirst = this.inputData.data.textUnderlogoFirst;
    this.textUnderlogoSecond = this.inputData.data.textUnderlogoSecond;
    this.headerSecond = this.inputData.data.headerSecond;
    this.checkedFirst = this.inputData.data.checkedFirst;
    this.headerthird = this.inputData.data.headerthird;
    this.checkedSecond = this.inputData.data.checkedSecond;
    this.buttonText = this.inputData.data.buttonText;
    document.getElementById('trackAssist').innerHTML = this.checkedSecond;
  }
  createForm() {
    this.paymentDetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      cardNumber: [''],
      MMYY: [''],
      CVC: [''],

      address: [''],
      addressUnit: [''],
    });
  }
  saveData() {
    if (this.paymentDetailsForm.invalid) {
      this.shared.markInvalid(this.paymentDetailsForm);
      return;
    }
    const data = {
      name: this.paymentDetailsForm.controls.name.value,
      card: this.paymentDetailsForm.controls.cardNumber.value,

      address: this.paymentDetailsForm.controls.address.value,
      addressUnit: this.paymentDetailsForm.controls.addressUnit.value,
    };

    console.log(
      data.name,
      data.card,

      data.address,
      data.addressUnit
    );
  }
  keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      // TODO: kad se klikne na enter
      // ovde se poziva metoda koja ce ti cuvati podatke kao kad se klikne na save dugme
      this.saveData();
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  changeBillingInfo() {

  }

  changeAchConfirmation() {

  }
}
