import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reviewCheckButton',
  templateUrl: './reviewCheckButton.component.html',
  styleUrls: ['./reviewCheckButton.component.scss'],
})
export class ReviewCheckButtonComponent {

  @Input() reviewItem: any;

  @Output() feedbackReviewItem = new EventEmitter<any>();

  reviewerExplanation?: any = '';

  reviewCheck: any;

  ngOnInit(): void {
    console.log(this.reviewItem);
  }

  reviewerAnswer(value: any) {
    console.log(this.reviewItem);
    if (value === 'true') {
      this.reviewerExplanation = '';
      Object.entries(this.reviewItem)?.forEach(([key]) => {
        if (key === 'id') {
          return;
        } else if (key === 'reviewerExplanation') {
          this.reviewItem[key] = '';
          return;
        } else if (key === 'isTrue') {
          this.reviewItem[key] = true;
          return;
        }
        Object.entries(this.reviewItem[key]).forEach(([key2]) => {
          this.reviewItem[key][key2] = true;
        });
      });
      this.feedbackReviewItem.emit(this.reviewItem);
    } else {
      Object.entries(this.reviewItem)?.forEach(([key]) => {
        if (key === 'id') {
          return;
        } else if (key === 'reviewerExplanation') {
          this.reviewItem[key] = '';
          return;
        } else if (key === 'isTrue') {
          this.reviewItem[key] = false;
        }
        Object.entries(this.reviewItem[key]).forEach(([key2]) => {
          this.reviewItem[key][key2] = null;
        });
      });
      this.feedbackReviewItem.emit(this.reviewItem);
    }
  }

  onReviewChangeExplanation() {
    this.reviewItem.reviewerExplanation = this.reviewerExplanation;
    this.feedbackReviewItem.emit(this.reviewItem);

  }
}
