import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ta-switch',
  templateUrl: './ta-switch.component.html',
  styleUrls: ['./ta-switch.component.scss'],
})
export class TaSwitchComponent implements OnInit {
  @Input() data: any;
  @Input() changeToRoutingStyle: boolean;
  @Input() changeToGpsStyle: boolean;
  @Input() sideBarStyle: boolean;
  @Input() customColorsMiles: boolean;
  @Output() switchClicked = new EventEmitter<any>();

  numberOfTabs: number;
  checked: boolean;
  constructor() {}

  ngOnInit(): void {
    let count = 0;
    for (const d of this.data) {
      if (!d.checked) {
        count++;
      }
    }
    this.checked = count === this.data.length;
  }

  handleChange(event: any) {
    this.checked = false;
    const clickedKey = event.srcElement.id.split('-')[1];
    this.data.forEach((el: any) => {
      el.checked = false;
    });
    this.data[clickedKey].checked = true;
    this.switchClicked.emit(this.data);
  }
}
