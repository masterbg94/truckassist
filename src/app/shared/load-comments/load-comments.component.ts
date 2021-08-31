import { Component, OnInit, Input } from '@angular/core';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-load-comments',
  templateUrl: './load-comments.component.html',
  styleUrls: ['./load-comments.component.scss']
})
export class LoadCommentsComponent implements OnInit {
  @Input() commentcount: number;
  @Input() loadId: number;

  isOpened: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  closeComment(): void {
    this.isOpened = false;
  }

  toggleComment(tooltip: any) {
    if (tooltip.isOpen()) {
      this.isOpened = false;
      tooltip.close();
    } else {
      tooltip.open({ data: this.loadId });
      this.commentcount > 0 ? this.isOpened = true : '';
    }
  }

}
