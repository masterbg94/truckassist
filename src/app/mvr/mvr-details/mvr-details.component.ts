import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mvr-details',
  templateUrl: './mvr-details.component.html',
  styleUrls: ['./mvr-details.component.scss'],
})
export class MvrDetailsComponent implements OnInit {

  selectedApplicants = [];
  selectedDrivers = [];
  selectedUser: any;
  isViolationBodyOpen = [];
  keyword = 'id';
  allDrivers = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.allDrivers = this.getMvrData().filter(driver => driver.order.status.toLowerCase() === 'pending' || driver.order.status.toLowerCase() === 'complete' );
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.selectedUser = this.getSelectedUser(parseInt(params.id));

      for (let index = 0; index < this.selectedUser.violations.length; index++) {
        this.isViolationBodyOpen.push({
          index,
          open: false,
        });
      }
    });
  }

  ngOnDestory() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMvrData() {
    return [
      {
        id: '219639',
        order: {
          orderedBy: 'Peter Parker',
          status: 'Declined',
          charge: '-$13.99',
          orderDate: '16/12/20 09:42 PM',
          completedDate: '16/12/20 09:52 PM',
        },
        driver: {
          name: 'Hiro Nakamura',
          status: '05/05/20',
          statusLicence: '04/18/19',
          dob: '07/24/76',
          address: '6325B Fairview Ave,  Westmont, IL 60559',
          ssn: '653-87-9136',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        licences: {
          cdl: '123-45-6789',
          status: 'Valid',
          conutry: 'Kentucky',
          type: 'Commercial',
          class: 'A',
          startDate: '07/20/18',
          issuedDate: '07/24/19',
        },
        medical: {
          issuedDate: '07/24/19',
          startDate: '01/01/20',
          endDate: '01/01/21',
          statusMedial: 'Certified',
          examinerName: 'Matthew Sheppard',
          licence: '2977',
          conutry: 'Kentucky',
          licenceRegistration: '7311453670',
          speciality: 'Chiropractor',
          medicalPhone: '1234567890',
        },
        violations: [
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
        ],
      },
      {
        id: '219640',
        order: {
          orderedBy: 'Peter Parker',
          status: 'Pending',
          charge: '-$13.99',
          orderDate: '16/12/20 09:42 PM',
          completedDate: '16/12/20 09:52 PM',
        },
        driver: {
          name: 'James Halpert',
          status: '12/24/20',
          statusLicence: '04/18/19',
          dob: '07/24/76',
          address: '6325B Fairview Ave,  Westmont, IL 60559',
          ssn: '653-87-9136',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        licences: {
          cdl: '123-45-6789',
          status: 'Pending',
          conutry: 'Kentucky',
          type: 'Commercial',
          class: 'A',
          startDate: '07/20/18',
          issuedDate: '07/24/19',
        },
        medical: {
          issuedDate: '07/24/19',
          startDate: '01/01/20',
          endDate: '01/01/21',
          statusMedial: 'Certified',
          examinerName: 'Matthew Sheppard',
          licence: '2977',
          conutry: 'Kentucky',
          licenceRegistration: '7311453670',
          speciality: 'Chiropractor',
          medicalPhone: '1234567890',
        },
        violations: [
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
        ],
      },
      {
        id: '219643',
        order: {
          orderedBy: 'Peter Parker',
          status: 'Declined',
          charge: '-$13.99',
          orderDate: '16/12/20 09:42 PM',
          completedDate: '16/12/20 09:52 PM',
        },
        driver: {
          name: 'Tony Soprano',
          status: '12/24/20',
          statusLicence: '04/18/19',
          dob: '07/24/76',
          address: '6325B Fairview Ave,  Westmont, IL 60559',
          ssn: '653-87-9136',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        licences: {
          cdl: '123-45-6789',
          status: 'Pending',
          conutry: 'Kentucky',
          type: 'Commercial',
          class: 'A',
          startDate: '07/20/18',
          issuedDate: '07/24/19',
        },
        medical: {
          issuedDate: '07/24/19',
          startDate: '01/01/20',
          endDate: '01/01/21',
          statusMedial: 'Certified',
          examinerName: 'Matthew Sheppard',
          licence: '2977',
          conutry: 'Kentucky',
          licenceRegistration: '7311453670',
          speciality: 'Chiropractor',
          medicalPhone: '1234567890',
        },
        violations: [
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
        ],
      },
      {
        id: '219644',
        order: {
          orderedBy: 'Peter Parker',
          status: 'Complete',
          charge: '-$13.99',
          orderDate: '16/12/20 09:42 PM',
          completedDate: '16/12/20 09:52 PM',
        },
        driver: {
          name: 'Walter White',
          status: '12/24/20',
          statusLicence: '05/18/19',
          dob: '07/24/76',
          address: '6325B Fairview Ave,  Westmont, IL 60559',
          ssn: '653-87-9136',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        licences: {
          cdl: '123-45-6789',
          status: 'Valid',
          conutry: 'Kentucky',
          type: 'Commercial',
          class: 'A',
          startDate: '07/20/18',
          issuedDate: '07/24/19',
        },
        medical: {
          issuedDate: '07/24/20',
          startDate: '01/01/20',
          endDate: '01/01/21',
          statusMedial: 'Certified',
          examinerName: 'Matthew Sheppard',
          licence: '2977',
          conutry: 'Kentucky',
          licenceRegistration: '7311453670',
          speciality: 'Chiropractor',
          medicalPhone: '1234567890',
        },
        violations: [
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
        ],
      },
      {
        id: '219645',
        order: {
          orderedBy: 'Peter Parker',
          status: 'Declined',
          charge: '-$13.99',
          orderDate: '16/12/20 09:42 PM',
          completedDate: '16/12/20 09:52 PM',
        },
        driver: {
          name: 'Aleksandar Djordjevic',
          status: '12/24/20',
          statusLicence: '04/18/19',
          dob: '07/24/76',
          address: '6325B Fairview Ave,  Westmont, IL 60559',
          ssn: '653-87-9136',
          phone: '1234567890',
          email: 'denisrodman@gmail.com',
        },
        licences: {
          cdl: '123-45-6789',
          status: 'Pending',
          conutry: 'Kentucky',
          type: 'Commercial',
          class: 'A',
          startDate: '07/20/18',
          issuedDate: '07/24/19',
        },
        medical: {
          issuedDate: '07/24/19',
          startDate: '01/01/20',
          endDate: '01/01/21',
          statusMedial: 'Certified',
          examinerName: 'Matthew Sheppard',
          licence: '2977',
          conutry: 'Kentucky',
          licenceRegistration: '7311453670',
          speciality: 'Chiropractor',
          medicalPhone: '1234567890',
        },
        violations: [
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
          {
            incidentDate: '07/24/14',
            convDate: '07/31/14',
            country: 'Kentucky',
            location: 'Country Court',
            hazMaterial: 'No',
            commerical: 'Yes',
            description: 'Failure to file insurance - Bureau',
          },
        ],
      },
    ];
  }

  getSelectedUser(id: number) {
    const userIndex = this.getMvrData().findIndex((user) => parseInt(user.id) === id);
    if (userIndex !== -1) {
      return this.getMvrData()[userIndex];
    }
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

  downloadMvrDetails() {
    alert('Download');
  }

  onOpenViolationBody(ind: any) {
    const index = this.isViolationBodyOpen.findIndex((item) => item.index === ind);

    if (index !== -1) {
      this.isViolationBodyOpen[index].open = !this.isViolationBodyOpen[index].open;
    }
  }
}
