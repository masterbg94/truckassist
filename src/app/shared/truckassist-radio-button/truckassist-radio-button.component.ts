
import { Component, Input, forwardRef , Self, OnInit} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-truckassist-radio-button',
    templateUrl: 'truckassist-radio-button.component.html',
    styleUrls: ['truckassist-radio-button.component.scss']
})
export class TruckassistRadioButtonComponent implements ControlValueAccessor, OnInit {
    @Input() value: any;
    @Input() length: any;
    @Input() disabled = false;
    model: any;
    onChange = (value: any) => {};
    onTouched = () => {};
    constructor(@Self() private ngControl: NgControl) {
      ngControl.valueAccessor = this;
    }

    ngOnInit() {
      this.ngControl.control.valueChanges.subscribe(value => {
        // Check to ensure the value wasn't already set (Template driven forms)
        if (this.model === value) { return; }
        this.writeValue(value);
      });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    writeValue(value: any) {
        this.model = value;
    }

    // This gets called on click of the element
    select() {
        if (!this.disabled) {
          this.model = this.model === this.value ? null : this.value;
          this.onChange(this.model);
        }
    }
}
