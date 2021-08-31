import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-violation-summary',
  templateUrl: './violation-summary.component.html',
  styleUrls: ['./violation-summary.component.scss'],
})
export class ViolationSummaryComponent implements OnInit, OnDestroy {
  @Input() rowData: any;
  @Input() rowIndex: number;
  data: any = [
    {
      summary: [
        {
          report: 'PE1017010339',
          id: 58,
          driverName: 'Angelo Trotter',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Cumberland, PE',
          lvl: 'II',
        },
        {
          report: 'CO0103391017',
          id: 58,
          driverName: 'Mario Luigie',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: false,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Park, CO',
          lvl: 'II',
        },
        {
          report: 'AL1017010339',
          id: 58,
          driverName: 'Aleksandar Djordjevic',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Madison, AL',
          lvl: 'III',
        },
      ],
    },
    {
      summary: [
        {
          report: 'PE1017010339',
          id: 58,
          driverName: 'Angelo Trotter',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Cumberland, PE',
          lvl: 'II',
        },
        {
          report: 'CO0103391017',
          id: 58,
          driverName: 'Mario Luigie',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: false,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Park, CO',
          lvl: 'II',
        },
        {
          report: 'AL1017010339',
          id: 58,
          driverName: 'Aleksandar Djordjevic',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Madison, AL',
          lvl: 'III',
        },
        {
          report: 'PE1033910170',
          id: 58,
          driverName: 'Denis Rodman',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Cumberland, PE',
          lvl: 'II',
        },
        {
          report: 'CO1017010339',
          id: 58,
          driverName: 'Ben King',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: false,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Park, CO',
          lvl: 'III',
        },
        {
          report: 'PE1017010339',
          id: 58,
          driverName: 'Angelo Trotter',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: true,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Madison, AL',
          lvl: 'II',
        },
        {
          report: 'PE1017010339',
          id: 58,
          driverName: 'Angelo Trotter',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: true,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Madison, AL',
          lvl: 'II',
        },
      ],
    },
    {
      summary: [
        {
          report: 'PE1017010339',
          id: 58,
          driverName: 'Angelo Trotter',
          date: '01/12/21',
          time: '06:15 AM',
          truckNumber: '#85210',
          trailerNumber: '#33201',
          oos: [
            {
              active: true,
              value: 'D',
              title: 'Driver',
            },
            {
              active: false,
              value: '1',
              title: 'Truck',
            },
            {
              active: false,
              value: '2',
              title: 'Trailer',
            },
          ],
          countyState: 'Cumberland, PE',
          lvl: 'II',
        },
      ],
    },
  ];
  tableData = [];
  loaded = false;
  columns = [
    {
      title: 'Report #',
      field: 'report',
    },
    {
      title: 'Driver',
      field: 'driverName',
    },
    {
      title: 'Date',
      field: 'date',
    },
    {
      title: 'Time',
      field: 'time',
    },
    {
      title: 'Truck',
      field: 'truck',
    },
    {
      title: 'Trailer',
      field: 'trailer',
    },
    {
      title: 'OOS',
      field: 'oos',
    },
    {
      title: 'County, State',
      field: 'county',
    },
    {
      title: 'LVL',
      field: 'lvl',
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();
  constructor() {}

  ngOnInit(): void {
    this.tableData = this.data[this.rowIndex].summary;
    this.loaded = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
