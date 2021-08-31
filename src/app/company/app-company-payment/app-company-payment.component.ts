import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-company-payment',
  templateUrl: './app-company-payment.component.html',
  styleUrls: ['./app-company-payment.component.scss'],
})
export class AppCompanyPaymentComponent implements OnInit {
  public charges = [1, 2, 3];
  public invoices = [1, 2, 3, 4, 5];
  constructor() {}

  ngOnInit() {}
}
