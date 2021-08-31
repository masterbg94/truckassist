import { AppActivityLogService } from './../../core/services/app-activitylog-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-activity',
  templateUrl: './header-activity.component.html',
  styleUrls: ['./header-activity.component.scss']
})
export class HeaderActivityComponent implements OnInit {

  constructor(public activityLogService: AppActivityLogService) { }

  selectedIndex: number = 0;
  
  headItems: any = [
    {
      name: "General",
      data: [
        {
          type: "update",
          fullName: "Scottie Pippen",
          middleText: "booked load",
          value: "#1256",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "canceled load",
          value: "#888",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "Deactivated",
          value: "Mark Robertson",
          time: 1625217351
        },
        {
          type: "adding",
          fullName: "Denis Rodman",
          middleText: "Added New Truck",
          value: "#1256",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "canceled load",
          value: "#888",
          time: 1625217351
        }
      ]
    },
    {
      name: "Dispatch",
      data: [
        {
          type: "update",
          fullName: "Scottie Pippen",
          middleText: "booked load",
          value: "#1256",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "canceled load",
          value: "#888",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "Deactivated",
          value: "Mark Robertson",
          time: 1625217351
        },
        {
          type: "adding",
          fullName: "Denis Rodman",
          middleText: "Added New Truck",
          value: "#1256",
          time: 1625217351
        },
        {
          type: "removed",
          fullName: "Michael Jordan",
          middleText: "canceled load",
          value: "#888",
          time: 1625217351
        }
      ]
    },
    {
      name: "Accounting",
      unread: true,
      data: [
        {
          type: "accounting",
          accType: "deduction",
          fullName: "Michael Jordan",
          middleText: "Deducted",
          value: "Mark Robertson",
          time: 1625217351,
          additionalInfo: {
            value: "$120.00",
            for: "EFS Advance"
          }
        },
        {
          type: "accounting",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Credited",
          value: "Nikola Jokic",
          time: 1625217351
        },
        {
          type: "accounting",
          accType: "deduction",
          fullName: "Michael Jordan",
          middleText: "Deducted",
          value: "Mark Robertson",
          time: 1625217351,
          additionalInfo: {
            value: "$120.00",
            for: "EFS Advance"
          }
        },
        {
          type: "accounting",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Credited",
          value: "Nikola Jokic",
          time: 1625217351
        },
        {
          type: "accounting",
          accType: "deduction",
          fullName: "Michael Jordan",
          middleText: "Deducted",
          value: "Mark Robertson",
          time: 1625217351,
          additionalInfo: {
            value: "$120.00",
            for: "EFS Advance"
          }
        },
        {
          type: "accounting",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Credited",
          value: "Nikola Jokic",
          time: 1625217351
        }
      ]
    },
    {
      name: "Repair",
      unread: true,
      data: [
        {
          type: "repair",
          accType: "deduction",
          fullName: "Michael Jordan",
          middleText: "Deducted",
          value: "Mark Robertson",
          time: 1625217351,
          additionalInfo: {
            value: "$120.00",
            for: "EFS Advance",
            delimiter: "for"
          }
        },
        {
          type: "repair",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351,
          additionalInfo: {
            value: "$1,934.00",
            for: "Crox repairs LLC",
            delimiter: "at"
          }
        },
        {
          type: "repair",
          accType: "update",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "repair",
          fullName: "Michael Jordan",
          middleText: "Removed Repair for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "repair",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351,
          additionalInfo: {
            value: "$1,934.00",
            for: "Crox repairs LLC",
            delimiter: "at"
          }
        },
        {
          type: "repair",
          accType: "update",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "repair",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351,
          additionalInfo: {
            value: "$1,934.00",
            for: "Crox repairs LLC",
            delimiter: "at"
          }
        },
        {
          type: "repair",
          accType: "update",
          fullName: "Michael Jordan",
          middleText: "Added Repair for Truck",
          value: "#22621",
          time: 1625217351
        }
      ]
    },
    {
      name: "Safety",
      data: [
        {
          type: "safety",
          fullName: "Michael Jordan",
          middleText: "Removed Accident  for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "safety",
          accType: "update",
          fullName: "Michael Jordan",
          middleText: "Updated Accident for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "safety",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Added Accident  for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "safety",
          accType: "update",
          fullName: "Michael Jordan",
          middleText: "Updated Accident for Truck",
          value: "#22621",
          time: 1625217351
        },
        {
          type: "safety",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Added Accident  for Truck",
          value: "#22621",
          time: 1625217351
        }
      ]
    },
    {
      name: "Task",
      data: [
        {
          type: "atask",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          accType: "credited",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "mtask",
          fullName: "Michael Jordan",
          middleText: "Added new task",
          value: "Some long task title ",
          time: 1625217351
        }
      ]
    },
    {
      name: "Event",
      data: [
        {
          type: "events",
          fullName: "Michael Jordan",
          middleText: "Edited event",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "events",
          accType: "credited",
          reminderExtra: "Private event '94",
          fullName: "Reminder",
          middleText: "starts tomorrow at",
          value: "11:30AM",
          time: 1625217351
        },
        {
          type: "events",
          fullName: "Michael Jordan",
          middleText: "Edited event",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "events",
          accType: "credited",
          reminderExtra: "Private event '94",
          fullName: "Reminder",
          middleText: "starts tomorrow at",
          value: "11:30AM",
          time: 1625217351
        },
        {
          type: "events",
          fullName: "Michael Jordan",
          middleText: "Edited event",
          value: "Some long task title ",
          time: 1625217351
        },
        {
          type: "events",
          accType: "credited",
          reminderExtra: "Private event '94",
          fullName: "Reminder",
          middleText: "starts tomorrow at",
          value: "11:30AM",
          time: 1625217351
        }
      ]
    }
  ];

  ngOnInit(): void {

    // this.activityLogService.getGeneralList().subscribe(res =>{
    //   console.log("ACTIVITY LOG");
    //   console.log(res);
    // });
  }

  changeTab(indx: number): void{
    this.selectedIndex = indx;

    this.headItems[indx]['unread'] = false;
  }

}
