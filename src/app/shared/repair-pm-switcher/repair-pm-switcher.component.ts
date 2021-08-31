import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-repair-pm-switcher',
  templateUrl: './repair-pm-switcher.component.html',
  styleUrls: ['./repair-pm-switcher.component.scss']
})
export class RepairPmSwitcherComponent implements OnInit {
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @Input() isPmActive: boolean;
  pmActive: boolean;
  constructor() {}

  ngOnInit(): void {
    this.pmActive = this.isPmActive;
  }

  onSwitch(option: string){
    this.pmActive = option === 'pm';
    this.optionSelected.emit(this.pmActive);
  }
}
