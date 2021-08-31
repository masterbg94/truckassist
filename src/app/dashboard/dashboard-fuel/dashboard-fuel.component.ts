import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppFuelService } from './../../core/services/app-fuel.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription, Subject } from 'rxjs';
@Component({
  selector: 'app-dashboard-fuel',
  templateUrl: './dashboard-fuel.component.html',
  styleUrls: ['./dashboard-fuel.component.scss'],
  animations: [
    trigger('shrinkItem', [
      transition(':enter', [
        style({ width: 50, height: '32px', overflow: 'hidden', whiteSpace: 'pre' }),
        animate('200ms', style({ width: '*' })),
      ]),
      transition(':leave', [
        style({ width: 50, height: '32px', overflow: 'hidden',  whiteSpace: 'pre' }),
        animate('200ms', style({ width: 0 })),
      ]),
    ]),
  ]
})
export class DashboardFuelComponent implements OnInit, OnDestroy {
  searchExpanded = false;
  selectedTruckId = 1;
  private destroy$: Subject<void> = new Subject<void>();
  public truckList: any = [
    {
      id: 1,
      truckId: '#2134567'
    },
    {
      id: 2,
      truckId: '#454544'
    },
    {
      id: 3,
      truckId: '#334333'
    },
    {
      id: 4,
      truckId: '#323232'
    }
  ];

  public fuelTotal = 0;

  public fuelData: any = [
    {
      id: 9,
      companyId: 261,
      companyName: null,
      invoice: null,
      driverId: 154,
      driverFullName: 'Drive Drivec',
      truckId: 140,
      truckNumber: '847463',
      location: 'New York, NY',
      name: 'Name',
      transactionDate: '2021-04-13T22:00:00',
      api: 0,
      doc:
          {
            fuel: [
              {
                id: 13,
                qty: 2.0,
                unit: null,
                price: 120.0,
                fuelId: 9,
                category: 'Diesel',
                subtotal: 240.0,
                createdAt: '2021-04-13T11:19:58',
                updatedAt: '2021-04-13T11:19:58'
              }
            ]
          },
        createdAt: '2021-04-13T11:19:58',
        updatedAt: '2021-04-13T11:19:59',
        guid: '2f8cc79c-d7f2-4bdd-b470-b993366f9708'
    },
    {
      id: 9,
      companyId: 261,
      companyName: null,
      invoice: null,
      driverId: 154,
      driverFullName: 'Drive Drivec',
      truckId: 140,
      truckNumber: '847463',
      location: 'New York, NY',
      name: 'Name',
      transactionDate: '2021-04-13T22:00:00',
      api: 0,
      doc:
          {
            fuel: [
              {
                id: 13,
                qty: 2.0,
                unit: null,
                price: 120.0,
                fuelId: 9,
                category: 'Diesel',
                subtotal: 240.0,
                createdAt: '2021-04-13T11:19:58',
                updatedAt: '2021-04-13T11:19:58'
              }
            ]
          },
        createdAt: '2021-04-13T11:19:58',
        updatedAt: '2021-04-13T11:19:59',
        guid: '2f8cc79c-d7f2-4bdd-b470-b993366f9708'
    },
    {
      id: 9,
      companyId: 261,
      companyName: null,
      invoice: null,
      driverId: 154,
      driverFullName: 'Drive Drivec',
      truckId: 140,
      truckNumber: '847463',
      location: 'New York, NY',
      name: 'Name',
      transactionDate: '2021-04-13T22:00:00',
      api: 0,
      doc:
          {
            fuel: [
              {
                id: 13,
                qty: 2.0,
                unit: null,
                price: 120.0,
                fuelId: 9,
                category: 'Diesel',
                subtotal: 240.0,
                createdAt: '2021-04-13T11:19:58',
                updatedAt: '2021-04-13T11:19:58'
              }
            ]
          },
        createdAt: '2021-04-13T11:19:58',
        updatedAt: '2021-04-13T11:19:59',
        guid: '2f8cc79c-d7f2-4bdd-b470-b993366f9708'
    }
  ];

  constructor(private fuelService: AppFuelService, private shared: SharedService) { }

  ngOnInit(): void {
    this.getFuelData();
  }

  // getFuelData() {
  //     this.fuelService.getFuellist()
  //     .pipe(takeUntil(this.destroy$))      
  //     .subscribe(
  //       (res: any) => {
  //         const fuelData = res.map((item, index) => {
  //           item.transactionDate = item.transactionDate
  //             ? dateFormat(item.transactionDate)
  //             : dateFormat(new Date());
  //           var docCounts;
  //           item.doc
  //             ? (docCounts = item.doc['fuel'].reduce(
  //                 (dataCount, items) => {
  //                   if (items.price) dataCount.priceTotal = dataCount.priceTotal + items.price;
  //                   if (items.qty) dataCount.qtyTotal = dataCount.qtyTotal + items.qty;
  //                   return dataCount;
  //                 },
  //                 { qtyTotal: 0, priceTotal: 0 }
  //               ))
  //             : (docCounts = { qtyTotal: 0, priceTotal: 0 });

  //           item.qtyTotal = docCounts.qtyTotal;
  //           item.priceTotal = docCounts.priceTotal;
  //           return item;
  //         });

  //         console.log("FINAL FUEL DATA");
  //         console.log(fuelData);
  //       },
  //       () => {
  //         this.shared.handleServerError();
  //       }
  //     );
  // }

  public getFuelData() {
    this.fuelTotal = 0;
      this.fuelService.getFuellist()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: any) => {
          this.fuelData = item.map(item => {
            let itemCount = 0;
            item.doc?.fuel?.map(fuelItem => {
              itemCount = itemCount + fuelItem.subtotal;
              this.fuelTotal = this.fuelTotal + fuelItem.subtotal;
            });
            item.fuelTotal = itemCount;
            return item;
          });
        }
      );
  }

  public setExpanded(data): void {
    this.searchExpanded = data.changeStyle;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
