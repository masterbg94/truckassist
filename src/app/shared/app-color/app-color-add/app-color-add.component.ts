import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PaletteSettings } from '@progress/kendo-angular-inputs';
import { AppSharedService } from 'src/app/core/services/app-shared.service';

@Component({
  selector: 'app-app-color-add',
  templateUrl: './app-color-add.component.html',
})
export class AppColorAddComponent {
  colorForm: FormGroup;
  palette: 'websafe';
  selected = '';

  // public settings: PaletteSettings = {
  //   palette: this.palette,
  //   tileSize: 30,
  // };

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal
  ) {
    this.createForm();
  }

  createForm() {
    this.colorForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  addColor() {
    if (this.colorForm.invalid && this.selected !== '') {
      if (!this.shared.markInvalid(this.colorForm)) { return false; }
    }
    const color = this.colorForm.value;
    color.code = this.selected;
    const colorJson = JSON.stringify(color);
    // this.sharedService.addColor(colorJson).subscribe(
    //   (response: any) => {
    //     if (response.message === 'already_exists') {
    //       this.notification.error('Color already exists.', 'Error');
    //     } else {
    //       this.notification.success('Color added successfully!', 'Success:');
    //       this.shared.emitColorAdd.emit(true);
    //     }
    //     this.closeTruckColorModal();
    //     this.spinner.show(false);
    //   },
    //   (error: any) => {
    //     this.shared.handleServerError();
    //   }
    // );
    this.colorForm.reset();
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea') {
      this.addColor();
    }
  }

  onChange(color: string): void {
    this.selected = color;
  }

  closeTruckColorModal() {
    this.activeModal.close();
  }
}
