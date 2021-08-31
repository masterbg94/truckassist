import { animate, style, transition, trigger } from '@angular/animations';

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViolationListTooltipService } from 'src/app/core/services/violation-list-tooltip.service';
import { CtrlTemplateDirective } from '../directives/ctrl-template.directive';

@Component({
  selector: 'app-cell-templates',
  templateUrl: './cell-templates.component.html',
  styleUrls: ['./cell-templates.component.scss'],
  animations: [
    trigger('popup', [
      transition('void => *', [
        style({ margin: '-40px 0 0 0', opacity: 1, marginTop: '-40px' }),
        animate(200),
      ]),
      transition('void => *', [
        style({ transform: 'scale(0.95)', opacity: 1, marginTop: '-40px' }),
        animate(200),
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale(1)', marginTop: '-26px', opacity: 0 })),
      ]),
    ]),
  ],
})
export class CellTemplatesComponent implements OnInit, OnDestroy {
  @ViewChildren(CtrlTemplateDirective) templateRefs: QueryList<CtrlTemplateDirective>;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() stateName: string;

  private destroy$: Subject<void> = new Subject<void>();
  showDescription = -1;

  // TODO: Odraditi dinamicki prosledjivanje poruke, kada se poveze sa back-om
  declinedPopoverText: string = 'Cdl number invalid';

  /* Violation Prop */
  showViolationTooltip: boolean;
  violationRowIndex: number;
  violationIndex: number;

  /* User Table */
  showUserQuestion = -1;

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
    private tooltipViolation: ViolationListTooltipService
  ) {
    this.tooltipViolation.tooltip$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.showViolationTooltip = data.tooltip;
      this.violationIndex = data.index - 10;
      this.violationRowIndex = data.rowIndex;
    });
  }

  ngOnInit(): void {}

  getTemplate(templateName: string): TemplateRef<any> {
    let directive: CtrlTemplateDirective = null;

    if (templateName) {
      directive = this.templateRefs
        .toArray()
        .find((x) => x.name.toLowerCase() === templateName.toLowerCase());
    }

    if (directive && directive.template) {
      return directive.template;
    }

    directive = this.templateRefs.toArray().find((x) => x.name.toLowerCase() === 'notemplate');
    return directive.template;
  }

  expandRow(scope: any, row: any, index: number) {
    scope.showExpandedContainer = index;
    setTimeout(() => {
      row['expandedRow'] = !row['expandedRow'];
    }, 200);
  }

  hideDescription(event: any) {
    if (
      !event.target.classList.contains('description-panel') &&
      !event.target.classList.contains('description-field-panel') &&
      !event.target.classList.contains('drop-down-description')
    ) {
      this.showDescription = -1;
    }
  }

  goToRoute(route: any, typeStatus: any) {
    if (typeStatus.toLowerCase() === 'declined' || typeStatus.toLowerCase() === 'incomplete') {
      return;
    }

    this.router.navigate([route]);
  }

  onShowDeclinedPopover(popover: any, value: string) {
    console.log('Show Declined Popover');
    console.log(popover);
    console.log(value.toLowerCase());
    if (value.toLowerCase() === 'declined' || value.toLowerCase() === 'incomplete') {
      if (popover.isOpen()) {
        popover.close();
      } else {
        popover.open({ value });
      }
    }
  }

  onToggleUser(index: number, rowSelected: any, scope: any) {
    scope.onToggleUser(index, rowSelected);
    this.showUserQuestion = -1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
