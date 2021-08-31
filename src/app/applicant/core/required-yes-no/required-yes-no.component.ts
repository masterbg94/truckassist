import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-required-yes-no',
  templateUrl: './required-yes-no.component.html',
  styleUrls: ['./required-yes-no.component.scss'],
})
export class RequiredYesNoComponent implements OnInit {
  @Input() control: FormControl;
  constructor() {}

  ngOnInit(): void {}
}
