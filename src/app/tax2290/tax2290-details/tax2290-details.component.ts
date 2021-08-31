import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@Component({
  selector: 'app-tax2290-details',
  templateUrl: './tax2290-details.component.html',
  styleUrls: ['./tax2290-details.component.scss'],
})
export class Tax2290DetailsComponent implements OnInit {
  public allCompany = [];
  public selectedCompany: any;

  public dates = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];

  @ViewChild('autoComplete') autoCompleteRef;
  public isHovered: boolean = false;
  public autocompleteControl = new FormControl(this.dates[0].name);
  public datesId: number = 1;
  public arrowTableUse: HTMLElement;
  public addTabelStyle: boolean = false;
  keyword: string = 'name';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private elmentRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elmentRef.nativeElement.contains(target);
    if (
      !clickedInside &&
      this.autoCompleteRef.isOpen &&
      this.arrowTableUse.classList.contains('focusedTbaleStyle')
    ) {
      this.arrowTableUse.classList.remove('focusedTbaleStyle');
      this.autoCompleteRef.close();
    }
  }

  ngOnInit(): void {
    this.allCompany = this.get2290Data();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.selectedCompany = this.getSelectedCompany(parseInt(params.id));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dates.currentValue) {
      this.autocompleteControl.setValue(this.dates[this.datesId]);

      if (this.dates.length <= 1) {
        this.autocompleteControl.disable();
      } else {
        this.autocompleteControl.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSelectedCompany(id: number) {
    const companyIndex = this.get2290Data().findIndex((company) => parseInt(company.id) === id);
    if (companyIndex !== -1) {
      return this.get2290Data()[companyIndex];
    }
  }

  get2290Data() {
    return [
      {
        id: '219639',
        vins: '2',
        tax: '$321.67',
        fillingFee: '$975.00',
        status: 'Incomplete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219640',
        vins: '3',
        tax: '$2321.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
      },
      {
        id: '219641',
        vins: '78',
        tax: '$1321.67',
        fillingFee: '$975.00',
        status: 'Pending',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219642',
        vins: '15',
        tax: '$121.67',
        fillingFee: '$975.00',
        status: 'Incomplete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219674',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219686',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: 'Finish',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219676',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
      {
        id: '219666',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        fileDates: {
          firstUsedDate: 'February 2021',
          ordered: '16/12/20 09:42 PM',
          irsReasponse: '16/12/20 10:02 PM',
          signedUsingPin: '60559',
          taxSeason: '2019 - 2020 HVUT Return',
          eFilled: '16/12/20 09:42 PM',
        },
        fileInformation: {
          company: 'IVS Freight Inc.',
          ein: '65-8791536',
          address: '6325B Fairview Ave, Westmont, IL 60559',
          signerName: 'Ivan Stoiljkovic',
          title: 'President',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        finish: '',
        vehicles: [
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: false,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: true,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: true,
            description: 'Lorem Ipsum',
            tax: '$0.00',
          },
          {
            vin: '9N2713354V4NC9TG4',
            grossWeight: 'G - 60,001 - 61,000 lbs.',
            forestry: true,
            farming: false,
            suspended: false,
            description: 'Lorem Ipsum',
            tax: '$232.65',
          },
        ],
      },
    ].filter(
      (item) => item.status.toLowerCase() === 'complete' || item.status.toLowerCase() === 'pending'
    );
  }

  selectEvent(date) {
    this.datesId = date.id;
  }

  closeAutocomplete(arrow: HTMLElement) {
    arrow.classList.remove('focused');
  }

  focus(e: any, arrow: HTMLElement) {
    this.arrowTableUse = arrow;
    e.stopPropagation();

    if (
      (arrow.classList.contains('focused') || arrow.classList.contains('focusedTbaleStyle')) &&
      this.autoCompleteRef.isOpen
    ) {
      this.autoCompleteRef.close();
      if (this.addTabelStyle) {
        arrow.classList.remove('focusedTbaleStyle');
      } else {
        arrow.classList.remove('focused');
      }
    } else {
      this.autoCompleteRef.open();
      if (this.addTabelStyle) {
        arrow.classList.add('focusedTbaleStyle');
      } else {
        arrow.classList.add('focused');
      }
    }

    this.autoCompleteRef.filteredList = this.dates.filter(
      (d) => d.id !== this.autocompleteControl.value
    );
  }

  public formatTelephone(tel) {
    if (!tel) {
      return '';
    }

    const value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    let country, city, number;

    switch (value.length) {
      case 10:
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11:
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12:
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = '';
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + ' (' + city + ') ' + number).trim();
  }

  downloadVehicleDetails() {
    alert('download vehicle');
  }

  getTotalVehiclesTax(vehicles: any) {
    if(vehicles) {
      return formatter.format(
        vehicles.reduce((acc, obj) => {
          return acc + parseFloat(obj.tax.split('$')[1]);
        }, 0)
      );
    }
  }
}
