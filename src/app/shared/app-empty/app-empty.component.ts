import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-app-empty',
  templateUrl: './app-empty.component.html',
  styleUrls: ['./app-empty.component.scss']
})
export class AppEmptyComponent implements OnInit {
  @Input() iconName: string;
  @Input() name: string;
  constructor() { }

  ngOnInit() {
  }

}
