import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tax2290-details-card',
  templateUrl: './tax2290-details-card.component.html',
  styleUrls: ['./tax2290-details-card.component.scss']
})
export class Tax2290DetailsCardComponent implements OnInit {
  @Input() vehicles = [];

  constructor() { }

  ngOnInit(): void {
  }

}
