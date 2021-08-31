import { Component, HostListener, OnInit } from '@angular/core';
import { GridCompressionService } from '../services/grid-compression.service';

export interface MenuItem {
  title: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-extended-table-header',
  templateUrl: './extended-table-header.component.html',
  styleUrls: ['./extended-table-header.component.scss']
})
export class ExtendedTableHeaderComponent implements OnInit {
  public items: MenuItem[] = [
    { title: 'Load', route: '/loads', active: false },
    { title: 'Customer', route: '/customers', active: false },
    { title: 'Driver', route: '/drivers', active: false },
    { title: 'Truck', route: '/trucks', active: false },
    { title: 'Trailer', route: '/trailers', active: false },
    { title: 'Repair', route: '/repairs', active: false },
    { title: 'Owner', route: '/owners', active: false },
    // { title: 'Fuel', route: '/accounting/fuel', active: false },
    { title: 'Violation', route: '/safety/violation', active: false },
    { title: 'Accident', route: '/safety/accident', active: false },
    { title: 'Contacts', route: '/tools/contacts', active: false },
    { title: 'Accounts', route: '/tools/accounts', active: false },
  ];

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.tableCompress();
  }

  constructor(private gridCompressionService: GridCompressionService) { }

  ngOnInit(): void {
  }

  trackByFn(index, item) {
    return index;
  }

  tableCompress() {
    this.gridCompressionService.sendDataSource({ expanded: false, checked: true });
  }

}
