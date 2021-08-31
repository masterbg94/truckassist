import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-required-label',
  templateUrl: './required-label.component.html',
  styleUrls: ['./required-label.component.scss']
})
export class RequiredLabelComponent implements OnInit {

  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
