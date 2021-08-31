import { TruckDetail } from './../../core/model/truck';
import {
  Component,
  Input,
  forwardRef,
  OnInit,
  HostBinding,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-truckassist-checkbox',
  templateUrl: './truckassist-checkbox.component.html',
  styleUrls: ['./truckassist-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TruckassistCheckboxComponent),
      multi: true,
    },
  ],
})
export class TruckassistCheckboxComponent implements ControlValueAccessor, OnChanges {
  @HostBinding('attr.id')
  externalId = '';

  @Input()
  set id(value: string) {
    this._ID = value;
    this.externalId = null;
  }

  @Input() disabled = false;
  @Input() addClass = '';
  @Input() text = '';
  @Input() setChecked: boolean;
  @Input() gpsStyle: boolean;
  @Output() userEvent: EventEmitter<any> = new EventEmitter();
  isFisrtLoad = true;
  get id() {
    return this._ID;
  }

  private _ID = '';

  @Input('checked') _value = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor() {}

  ngOnChanges(change: SimpleChanges) {
    if (!this.isFisrtLoad && change.setChecked?.currentValue !== change.setChecked?.previousValue ) {
      this.setChecked = false;
      this._value = true;
    }
    this.isFisrtLoad = false;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  switch() {
    console.log('Switch se menja');
    this.value = !this.value;
    if (this.value) {
      this.userEvent.emit(true);
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
