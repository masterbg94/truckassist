import { ApplicantReviewService } from './../../service/applicant-review.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reviewSingleCheckButton',
  templateUrl: './reviewSingleCheckButton.component.html',
  styleUrls: ['./reviewSingleCheckButton.component.scss']
})
export class ReviewSingleCheckButtonComponent implements OnInit {

  @Input() reviewItem: any = null;

  property: any;
  value: any;

  constructor(private singleItemReview: ApplicantReviewService) { }

  ngOnInit() {
    Object.entries(this.reviewItem).forEach(([key]) => {
      this.value = this.reviewItem[key];
    });
    Object.keys(this.reviewItem).forEach(data => {
      this.property = data;
    });
  }

  reviewerSingleAnswer(value: any, property: any) {
    this.reviewItem[property] = value;
    this.singleItemReview.singleItemReview.next(this.reviewItem);
  }
}
