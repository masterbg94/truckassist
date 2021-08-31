import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TruckTabData } from 'src/app/core/model/truck';

@Component({
  selector: 'app-unit-switch',
  templateUrl: './unit-switch.component.html',
  styleUrls: ['./unit-switch.component.scss'],
})
export class UnitSwitchComponent implements OnChanges {
  enableAutoComplete = false;
  keyword: string;
  @ViewChild('autoComplete') autoComplete;
  @Input() options: any;
  @Input() keywordPasted: any;
  @Input() type: string;
  @Input() addTabelStyle: boolean;
  public swichData = [];
  autocompleteControl = new FormControl();
  truckTabData: TruckTabData = null;
  truckTrailer: any;
  id: number;
  tab: string;
  isHovered = false;
  arrowTableUse: HTMLElement;

  constructor(private route: ActivatedRoute, public router: Router, private elmentRef: ElementRef) {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.tab = params.tab;
    });
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elmentRef.nativeElement.contains(target);
    if (
      !clickedInside &&
      this.autoComplete.isOpen &&
      this.arrowTableUse.classList.contains('focusedTbaleStyle')
    ) {
      this.arrowTableUse.classList.remove('focusedTbaleStyle');
      this.autoComplete.close();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options.currentValue) {
      this.keyword = this.keywordPasted;
      this.swichData = this.options;
      this.enableAutoComplete = this.options.length > 1;
      this.swichData.filter((s) => {
        if (s.id == this.id) {
          switch (this.type) {
            case 'trucks':
              this.autocompleteControl.setValue('Unit # ' + s.truckNumber);
              break;
            case 'trailers':
              this.autocompleteControl.setValue('Unit # ' + s.trailerNumber);
              break;
            case 'drivers':
              this.autocompleteControl.setValue(s.fullName);
              break;
            case 'loads':
              this.autocompleteControl.setValue(s.id);
              break;
            case 'repairs':
              this.autocompleteControl.setValue(s.name);
              break;
            case 'safety/violation':
              this.autocompleteControl.setValue(s.report);
              break;
            case 'tools/mvr':
              this.autocompleteControl.setValue('Order # ' + s.id);
              break;
            case 'tools/2290':
              this.autocompleteControl.setValue('Order # ' + s.id);
              break;
            default:
              break;
          }
        }
      });
      if (this.options.length <= 1) {
        this.autocompleteControl.disable();
      } else {
        this.autocompleteControl.enable();
      }
    }
  }

  public resetAutocomplete(): void {
    this.swichData = this.options;
    this.enableAutoComplete = this.options.length > 1;
    this.swichData.filter((s) => {
      if (s.id == this.id) {
        switch (this.type) {
          case 'trucks':
            this.autocompleteControl.setValue('Unit # ' + s.truckNumber);
            break;
          case 'trailers':
            this.autocompleteControl.setValue('Unit # ' + s.trailerNumber);
            break;
          case 'drivers':
            this.autocompleteControl.setValue(s.fullName);
            break;
          case 'loads':
            this.autocompleteControl.setValue(s.id);
            break;
          case 'repairs':
            this.autocompleteControl.setValue(s.name);
            break;
          case 'safety/violation':
            this.autocompleteControl.setValue(s.report);
            break;
          case 'tools/mvr':
            this.autocompleteControl.setValue(s.id);
            break;
          case 'tools/2290':
            this.autocompleteControl.setValue(s.id);
            break;
          default:
            break;
        }
      }
    });
  }

  public closeAutocomplete(arrow: HTMLElement) {
    arrow.classList.remove('focused');
    this.resetAutocomplete();
  }

  public selectItem(event: any) {
    if (this.type && event.id !== Number(this.id)) {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate([`/${this.type}/edit/` + event.id + `/${this.tab}`]));
    }
  }

  public selectPreviousItem(): void {
    if (this.swichData.length && this.enableAutoComplete) {
      let currentIndex = this.swichData.findIndex((d) => d.id == this.id);
      if (currentIndex !== -1) {
        currentIndex--;
        if (currentIndex < 0) {
          currentIndex = this.swichData.length - 1;
        }
        this.truckTrailer = this.swichData[currentIndex];
        if (this.type) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() =>
              this.router.navigate([`/${this.type}/edit/` + this.truckTrailer.id + `/${this.tab}`])
            );
        }
      }
    }
  }

  public selectNextItem(): void {
    if (this.swichData.length && this.enableAutoComplete) {
      let currentIndex = this.swichData.findIndex((d) => d.id == this.id);
      if (currentIndex !== -1) {
        currentIndex++;
        if (currentIndex === this.swichData.length) {
          currentIndex = 0;
        }
        this.truckTrailer = this.swichData[currentIndex];
        if (this.type) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() =>
              this.router.navigate([`/${this.type}/edit/` + this.truckTrailer.id + `/${this.tab}`])
            );
        }
      }
    }
  }

  public focus(e: any, arrow: HTMLElement) {
    this.arrowTableUse = arrow;
    e.stopPropagation();
    if (this.enableAutoComplete) {
      if (
        (arrow.classList.contains('focused') || arrow.classList.contains('focusedTbaleStyle')) &&
        this.autoComplete.isOpen
      ) {
        this.autoComplete.close();
        if (this.addTabelStyle) {
          arrow.classList.remove('focusedTbaleStyle');
        } else {
          arrow.classList.remove('focused');
        }
      } else {
        this.autoComplete.open();
        if (this.addTabelStyle) {
          arrow.classList.add('focusedTbaleStyle');
        } else {
          arrow.classList.add('focused');
        }
      }

      switch (this.type) {
        case 'trucks':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.truckNumber !== this.autocompleteControl.value
          );
          break;
        case 'trailers':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.trailerNumber !== this.autocompleteControl.value
          );
          break;
        case 'drivers':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.fullName !== this.autocompleteControl.value
          );
          break;
        case 'loads':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.id !== this.autocompleteControl.value
          );
          break;
        case 'repairs':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.name !== this.autocompleteControl.value
          );
          break;
        case 'safety/violation':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.report !== this.autocompleteControl.value
          );
          break;
        case 'tools/mvr':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.id !== this.autocompleteControl.value
          );
          break;
        case 'tools/2290':
          this.autoComplete.filteredList = this.swichData.filter(
            (d) => d.id !== this.autocompleteControl.value
          );
          break;
        default:
          break;
      }
    }
  }
}
