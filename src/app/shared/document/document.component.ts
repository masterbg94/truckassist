import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { createZoomTrigger } from './document-triggers';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  animations: [createZoomTrigger('documentItem')]
})
export class DocumentComponent {

  @Input() file?: any;
  @Input() i: number;
  @Input() shrink = false;
  @Input() disableSelectType = false;
  @Input() disableDelete = false;
  @Input() clearFiles = false;

  @Output() onDelete = new Subject<void>();

  constructor(
    private sharedService: SharedService
  ) {

  }

  emitImagePreview(event: any, slideIndex?: number) {
    console.log('emitImagePreview');
  }

}
