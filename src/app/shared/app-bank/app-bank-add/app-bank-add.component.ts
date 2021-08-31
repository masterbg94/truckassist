import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';

@Component({
  selector: 'app-app-bank-add',
  templateUrl: './app-bank-add.component.html',
})
export class AppBankAddComponent implements OnInit {
  bankForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private activeModal: NgbActiveModal,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private shared: SharedService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.bankForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  addBank() {
    if (!this.shared.markInvalid(this.bankForm)) { return false; }
    const bank = this.bankForm.value;
    const bankJson = JSON.stringify(bank);
    // this.sharedService.addBank(bankJson).subscribe(
    //   (response: any) => {
    //     if (response.message === 'already_exists') {
    //       this.notification.error('Bank already exists.', 'Error:');
    //     } else {
    //       this.notification.success('Bank added successfully.', 'Success:');
    //       this.shared.emitBankAdd.emit();
    //       this.closeBankModal();
    //     }
    //     this.spinner.show(false);
    //     this.bankForm.reset();
    //   },
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
  }

  closeBankModal() {
    this.activeModal.close();
  }
}
