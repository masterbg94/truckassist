import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-progress-expiration',
  templateUrl: './progress-expiration.component.html',
  styleUrls: ['./progress-expiration.component.scss'],
})
export class ProgressExpirationComponent implements OnInit {
  @Input() expireDate: any;
  @Input() status: any;
  @Input() startDate: any;
  @Input() isTodo: boolean;
  @Input() isInsurancePolicy: boolean;
  totalDays: any;
  expire: any;
  negative = false;
  year: number;
  days: number;
  showProgress = true;
  constructor() {}
  currentD = new Date();
  timeDifference;
  timeDifferenceAgo;
  diffD;

  public returnIsEndBefore(start, end) {
    if (moment(end).isBefore(moment(start))) {
      this.timeDifferenceAgo = true;
    }
    return moment(end).isBefore(start);
  }

  ngOnInit() {
    if (this.expireDate === null || this.expireDate === '') {
      this.negative = true;
    }
    if (this.startDate !== undefined) {
      this.totalDays = moment
        .utc(this.expireDate, 'MM-DD-YYYY')
        .diff(moment.utc(this.startDate, 'MM-DD-YYYY'), 'days');
    }

    if (!this.expireDate && !this.startDate) {
      this.showProgress = false;
    }

    const currentDate = moment.utc(this.currentD, 'MM-DD-YYYY').format('MM-DD-YYYY');
    const endDate = moment.utc(this.expireDate, 'MM-DD-YYYY');
    const diffDays = endDate.diff(currentDate, 'days');
    this.diffD = diffDays;
    if (diffDays < 0) {
      this.negative = true;
      this.expire = Math.abs(diffDays);
      if (this.expire > 365) {
        this.year = Math.floor(this.expire / 365);
        this.days = this.expire % 365;
      }
    } else if (diffDays === 0) {
      this.expire = 0;

      this.calculateDiffHours(this.currentD, this.expireDate);
    } else {
      this.negative = false;
      this.expire = diffDays;
      if (this.expire > 365) {
        this.year = Math.floor(this.expire / 365);
        this.days = this.expire % 365;
      }
    }
  }

  calculateProgress() {
    if (this.negative) {
      return 100;
    } else {
      if (this.diffD !== 0) {
        return this.totalDays !== undefined
          ? (this.expire / this.totalDays) * 100
          : this.isTodo ? (this.expire / 7) * 100 : (this.expire / 365) * 100;
      } else {
        return (100 / (24 / this.timeDifference));
      }
    }
  }

  setProgressbarColor() {
    if (this.negative) {
      return 'progress-danger';
    } else if (!this.isTodo) {
      const progress = this.calculateProgress();
      /* 50% - 100% */
      if (progress > 50 && progress <= 100) {
        return 'progress-muted';
      }
      /* 25% - 50% */
      if (progress > 25 && progress <= 50) {
        return 'progress-sliver';
      }
      /* 5% - 25% */
      if (progress > 5 && progress <= 25) {
        return 'progress-orange';
      }
      /* 0% - 5% */
      if (progress > 0 && progress <= 5) {
        return 'progress-danger';
      }
    } else if (this.isTodo) {
      const progress = this.calculateProgress();
      /* 50% - 100% */
      if (progress > 50 && progress <= 100) {
        return 'progress-1';
      }
      /* 25% - 50% */
      if (progress > 30 && progress <= 50) {
        return 'progress-2';
      }
      /* 5% - 25% */
      if (progress > 0 && progress <= 30) {
        return 'progress-3';
      }
      /* 0% - 5% */
      // if (progress > 0 && progress <= 5) {
      //   return 'progress-4';
      // }
    }
  }

  calculateDiffHours(start, end) {
    const result = moment(end).diff(moment(start), 'h');
    // negative time
    if (result < 0) {
      this.timeDifferenceAgo = true;
      this.timeDifference = Math.abs(result);
    } else {
      this.timeDifference = result;
    }
  }
}
