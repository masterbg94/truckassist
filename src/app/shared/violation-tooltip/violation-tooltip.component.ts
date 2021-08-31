import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViolationListTooltipService } from 'src/app/core/services/violation-list-tooltip.service';

@Component({
  selector: 'app-violation-tooltip',
  templateUrl: './violation-tooltip.component.html',
  styleUrls: ['./violation-tooltip.component.scss'],
})
export class ViolationTooltipComponent implements OnInit, OnDestroy {
  activeTabIndexNumber: number;
  showTooltip: boolean;
  rowIndex: number;
  violationTabs = [
    {
      title: 'Unsafe Driving',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
      indexNumber: 10,
      data: [
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
      ],
    },
    {
      title: 'Crash Indicator',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl2.svg',
      indexNumber: 11,
      data: [
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
      ],
    },
    {
      title: 'Hours of Service Compliance',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl3.svg',
      indexNumber: 12,
      data: [],
    },
    {
      title: 'Vehicle Maintenance',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl4.svg',
      indexNumber: 13,
      data: [
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
      ],
    },
    {
      title: 'Controlled Substances and Alcohol',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl5.svg',
      indexNumber: 14,
      data: [],
    },
    {
      title: 'Hazardous Materials Compliance',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl6.svg',
      indexNumber: 15,
      data: [],
    },
    {
      title: 'Driver Fitness',
      active: false,
      iconUrl: 'assets/img/svgs/table/violation-vl7.svg',
      indexNumber: 16,
      data: [
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
        {
          violationNumber: '342.3',
          type: 'Driver',
          desc: 'Inoperable Requied Lamp; passenger side head light inop',
          sw: '5 + 2',
          tiw: '3',
          totw: '21',
        },
      ],
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private tooltip: ViolationListTooltipService) {
    this.tooltip.tooltip$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.showTooltip = data.tooltip;
      this.activeTabIndexNumber = data.index - 10;
      this.rowIndex = data.rowIndex;
    });
  }

  ngOnInit(): void {
    this.switchTab(this.activeTabIndexNumber);
  }

  switchTab(i: number) {
    this.activeTabIndexNumber = i;
    this.tooltip.changeData({ tooltip: true, rowIndex: this.rowIndex, index: i + 10 });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
