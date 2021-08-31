import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AppConst from '../../../const';

@Component({
  selector: 'app-violation-details',
  templateUrl: './violation-details.component.html',
  styleUrls: ['./violation-details.component.scss'],
})
export class ViolationDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  loading = false;
  statusLoading = false;
  violationTabData = null;
  violation = null;
  id: number;
  options: any = [
    {
      latitude: '41.7147018',
      longitude: '-87.8063395',
      markerNumber: 1,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: false,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: true,
      createdAt: null,
      doc: null,
      driverFullName: 'Glen Cotton',
      driverId: 167,
      eventDate: '01/12/21',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '06:15 AM',
      id: 51,
      lvl: 'III',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '60',
      vl2: '3',
      vl3: '0',
      vl4: '0',
      vl5: '48',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: true,
          value: 'D',
          title: 'Driver',
        },
        {
          active: false,
          value: '1',
          title: 'Truck',
        },
        {
          active: true,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '2',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, nije bio na osiguranju',
      report: 'MS1017010339',
      trailerId: 12,
      trailerNumber: '#322R',
      truckId: 13,
      truckNumber: '#43252',
      state: 'South Carolina',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '41.6388436',
      longitude: '-87.6800432',
      markerNumber: 2,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: false,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: false,
      createdAt: null,
      doc: null,
      driverFullName: 'Angelo Trotter',
      driverId: 166,
      eventDate: '11/11/20',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '11:30 AM',
      id: 52,
      lvl: 'II',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '0',
      vl2: '0',
      vl3: '0',
      vl4: '0',
      vl5: '0',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: false,
          value: 'D',
          title: 'Driver',
        },
        {
          active: true,
          value: '1',
          title: 'Truck',
        },
        {
          active: false,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '0',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, note',
      report: 'MS90234231333',
      trailerId: 13,
      trailerNumber: '#322A',
      truckId: 23,
      truckNumber: '#5234R',
      state: 'Texas',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '39.5545498',
      longitude: '-77.9884643',
      markerNumber: 3,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: false,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: false,
      createdAt: null,
      doc: null,
      driverFullName: 'Sven Matter',
      driverId: 234,
      eventDate: '04/30/07',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '16:45 AM',
      id: 53,
      lvl: 'I',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '0',
      vl2: '0',
      vl3: '0',
      vl4: '0',
      vl5: '0',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: false,
          value: 'D',
          title: 'Driver',
        },
        {
          active: false,
          value: '1',
          title: 'Truck',
        },
        {
          active: true,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '0',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, nije bio na osiguranju',
      report: 'MS10170108322',
      trailerId: 12,
      trailerNumber: '#225R',
      truckId: 13,
      truckNumber: '#53252',
      state: 'Kansas',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '41.24763090',
      longitude: '-82.69837460',
      markerNumber: 4,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: false,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: true,
      createdAt: null,
      doc: null,
      driverFullName: 'Mike Elangelo',
      driverId: 166,
      eventDate: '12/01/18',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '14:30 AM',
      id: 54,
      lvl: 'II',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '0',
      vl2: '0',
      vl3: '5',
      vl4: '34',
      vl5: '20',
      vl6: '2',
      vl7: '1',
      oos: [
        {
          active: false,
          value: 'D',
          title: 'Driver',
        },
        {
          active: true,
          value: '1',
          title: 'Truck',
        },
        {
          active: true,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '3',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, note',
      report: 'MS902342319832',
      trailerId: 13,
      trailerNumber: '#322A',
      truckId: 23,
      truckNumber: '#5234R',
      state: 'Florida',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '34.07240380',
      longitude: '-83.81985150',
      markerNumber: 5,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: true,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: true,
      createdAt: null,
      doc: null,
      driverFullName: 'Kevin Mayer',
      driverId: 167,
      eventDate: '01/12/21',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '06:15 AM',
      id: 55,
      lvl: 'I',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '3',
      vl2: '0',
      vl3: '0',
      vl4: '0',
      vl5: '10',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: true,
          value: 'D',
          title: 'Driver',
        },
        {
          active: true,
          value: '1',
          title: 'Truck',
        },
        {
          active: true,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '3',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, nije bio na osiguranju',
      report: 'MS1017010339',
      trailerId: 12,
      trailerNumber: '#322R',
      truckId: 13,
      truckNumber: '#43252',
      state: 'Oregon',
      updatedAt: null,
      active: false,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '33.4567675',
      longitude: '-80.7337196',
      markerNumber: 6,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: true,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: false,
      violationsStatus: true,
      createdAt: null,
      doc: null,
      driverFullName: 'Angelo Trotter',
      driverId: 166,
      eventDate: '11/11/20',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '11:30 AM',
      id: 56,
      lvl: 'II',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '56',
      vl2: '18',
      vl3: '0',
      vl4: '10',
      vl5: '0',
      vl6: '2',
      vl7: '0',
      oos: [
        {
          active: false,
          value: 'D',
          title: 'Driver',
        },
        {
          active: false,
          value: '1',
          title: 'Truck',
        },
        {
          active: false,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '2',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, note',
      report: 'MS90234231333',
      trailerId: 13,
      trailerNumber: '#322A',
      truckId: 23,
      truckNumber: '#5234R',
      state: 'Utah',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '33.4567345',
      longitude: '-80.7332496',
      markerNumber: 7,
      driver: {
        image: '',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: true,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: false,
      violationsStatus: false,
      createdAt: null,
      doc: null,
      driverFullName: 'Sven Matter',
      driverId: 234,
      eventDate: '04/30/07',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '16:45 AM',
      id: 57,
      lvl: 'I',
      lvlTitle: 'Walk Around',
      total: '$2,904',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '30',
          timeWeight: '3',
          weight: '10',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
          ],
        },
      ],
      vl1: '0',
      vl2: '0',
      vl3: '0',
      vl4: '0',
      vl5: '0',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: false,
          value: 'D',
          title: 'Driver',
        },
        {
          active: false,
          value: '1',
          title: 'Truck',
        },
        {
          active: false,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '0',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
      ],
      note: 'nema claima, nije bio na osiguranju',
      report: 'MS10170108322',
      trailerId: 12,
      trailerNumber: '#225R',
      truckId: 13,
      truckNumber: '#53252',
      state: 'Kansas',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
    {
      latitude: '40.7658028',
      longitude: '-87.12806499999999',
      markerNumber: 8,
      driver: {
        image:
          // tslint:disable-next-line: max-line-length
          'data:image/png;base64,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',
        ssn: '438234180',
        dob: '2021-05-02T13:00:00',
        cdl: '5865254',
        hired: '0020-07-25T05:39:32.695Z',
        term: '2021-05-01T22:00:00Z',
      },
      truck: {
        mainImage: 'semi-wsleeper.svg',
        logoImage: 'freightliner.svg',
        vin: '1FUJA6CV67LW86557',
        year: '2007',
        color: '#FFD400',
        model: 'DDDD',
      },
      trailer: {
        mainImage: 'reefer.svg',
        logoImage: 'wilson.svg',
        vin: '1JJV532B3GL942212',
        year: '2016',
        color: '#F9F9F9',
        model: 'FH540',
      },
      shippingInfo: {
        title: 'WATCO SUPPLY CHAIN SERVICES',
        origin: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        destination: '1625 W Lake Shore Dr, Woodstock, IL 60098, USA',
        cargo: 'Packages, Carbon Steel Flange',
        hazmat: true,
        billOfLading: 65788754,
      },
      authority: {
        title: 'Illinoins Department of Transportation',
        location: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
        mobile: '(123) 456-7890',
        fax: '(123) 456-7890',
      },
      specialChecks: [
        {
          name: 'Alc/Cont. Sub. Check',
          check: false,
        },
        {
          name: 'Cond. by Local Juris.',
          check: false,
        },
        {
          name: 'Size & Weight Enf.',
          check: true,
        },
        {
          name: 'eScreen Inspection',
          check: true,
        },
        {
          name: 'Traffic Enforcement',
          check: false,
        },
        {
          name: 'PASA Cond. Insp.',
          check: true,
        },
        {
          name: 'Drug Interd. Search',
          check: false,
        },
        {
          name: 'Border Enf. Insp.',
          check: false,
        },
        {
          name: 'Post Crash Insp.',
          check: false,
        },
        {
          name: 'PBBT Inspection',
          check: true,
        },
      ],
      address: 'East Greenwich Township, NJ, USA',
      avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
      policeDepartment: 'Illinoins Department of Transportation',
      files: null,
      customer: 'IVS Freight Inc',
      companyId: null,
      oosStatus: true,
      violationsStatus: true,
      createdAt: null,
      doc: null,
      driverFullName: 'Glen Cotton',
      driverId: 167,
      eventDate: '01/12/21',
      guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
      hm: '06:15 AM',
      id: 58,
      lvl: 'III',
      lvlTitle: 'Walk Around',
      total: '$3,084',
      violationsData: [
        {
          title: 'Unsafe Driving',
          iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
          sumWeight: '42',
          timeWeight: '3',
          weight: '14',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '1343.2AZAT',
              oos: 'T',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Truck',
            },
          ],
        },
        {
          title: 'Vehicle Maintenance',
          iconUrl: 'assets/img/svgs/table/violation-vl4.svg',
          sumWeight: '42',
          timeWeight: '3',
          weight: '14',
          violationDetails: [
            {
              title: '324.23SSW2',
              oos: 'D',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '8932.2GSS6',
              oos: 'D',
              oosStatus: false,
              weight: '6',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Driver',
            },
            {
              title: '1343.2AZAT',
              oos: 'T',
              oosStatus: true,
              weight: '2',
              desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              oosTitle: 'Truck',
            },
          ],
        },
      ],
      vl1: '42',
      vl2: '0',
      vl3: '0',
      vl4: '42',
      vl5: '0',
      vl6: '0',
      vl7: '0',
      oos: [
        {
          active: true,
          value: 'D',
          title: 'Driver',
        },
        {
          active: false,
          value: '1',
          title: 'Truck',
        },
        {
          active: true,
          value: '2',
          title: 'Trailer',
        },
      ],
      citation: '4',
      citationData: [
        {
          title: 'T879327-2',
          value: '$2,452',
          desc: 'Operated Non-PA Vehicle with class 3B without registration',
        },
        {
          title: 'T927634-7',
          value: '$452',
          desc: 'Operated Non-PA Vehicle with class 2B without insurance',
        },
        {
          title: 'A23426-B3',
          value: '$50',
          desc: 'Broken turn light on rear side of the trailer, no glass cover',
        },
        {
          title: 'KFA4232-YY',
          value: '$130',
          desc: 'Driving without a seatbelt',
        },
      ],
      note: 'nema claima, nije bio na osiguranju',
      report: 'MS1017010339',
      trailerId: 12,
      trailerNumber: '#322R',
      truckId: 13,
      truckNumber: '#43252',
      state: 'South Carolina',
      updatedAt: null,
      active: true,
      attachments: [
        {
          fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
          fileName: '6557 insp 12.22.20.pdf',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
        },
        {
          fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
          fileName: 'test1.jpg',
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
        },
      ],
    },
  ];
  showNote = false;
  noteChanged = false;
  keyword = 'report';
  textRows = 1;
  noteControl = new FormControl();
  enableAutoComplete = false;
  showUploadZone = false;
  styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  zoom = 10;
  violationData: any = [];
  map: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.id;
    });
    this.getViolations();
    this.getViolationData(this.id);
  }

  getViolations(): void {}

  getViolationData(id) {
    this.loading = false;
    this.violationData = this.options.find((x) => {
      if (x.id === +id) {
        return x;
      }
    });
    this.loading = true;
  }

  openViolationEdit(id: number) {}

  deleteViolation(id: any) {}

  updateViolationNote(newNote: string): void {}

  printProfile() {
    return;
  }

  mapReady(event) {
    this.map = event;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
