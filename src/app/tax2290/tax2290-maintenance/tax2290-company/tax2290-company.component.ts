import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tax2290Service } from 'src/app/core/services/tax2290.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-tax2290-company',
  templateUrl: './tax2290-company.component.html',
  styleUrls: ['./tax2290-company.component.scss']
})
export class Tax2290CompanyComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() company: any;
  @Input() taxSeason: any;

  @Output() resetCompany = new EventEmitter<void>()

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private tax2290Service: Tax2290Service,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.invalid) {
        return;
      } else {
        this.tax2290Service.getCompany(this.form.value);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.form = this.formBuilder.group({
      company: [null, Validators.required],
      taxSeason: [null, Validators.required],
    });
  }

  onClear(data: any, type: string) {
    if (type === 'company') {
      this.form.get('company')?.reset();
      this.form.get('taxSeason')?.reset();
      this.resetCompany.emit();
    } else if (type === 'tax') {
      this.form.get('taxSeason')?.reset();
    }
  }
}
