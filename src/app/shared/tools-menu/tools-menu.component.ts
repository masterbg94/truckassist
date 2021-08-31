import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-tools-menu',
  templateUrl: './tools-menu.component.html',
  styleUrls: ['./tools-menu.component.scss'],
})
export class ToolsMenuComponent implements OnInit {
  @Input() count: number;
  public dropDownActive = false;
  public curentRoute = { name: 'Accounts', path: '/tools/accounts' };
  public options = [
    { name: 'Miles', path: '/tools/miles' },
    { name: 'Routing', path: '/tools/routing' },
    { name: 'Contacts', path: '/tools/contacts' },
    { name: '1099', path: '/tools/factoring' },
    { name: 'MVR', path: '/tools/mvr' },
    { name: 'To-do List', path: '/tools/todo' },
    { name: 'Accounts', path: '/tools/accounts' },
    { name: '2290', path: '/tools/factoring' },
    { name: 'Calendar', path: '/tools/calendar' },
    { name: 'Statistic', path: '/tools/statistics' },
    { name: 'Reports', path: '/tools/reports' },
    { name: 'Factoring', path: '/tools/factoring' }
  ];

  constructor(private router: Router, private elementRef: ElementRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dropDownActive = false;
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].path === event.url) {
            this.curentRoute = this.options[i];
            if (this.count) {
              this.curentRoute.name = `${this.curentRoute.name }(${this.count})`;
            }
            this.options.splice(i, 1);
            break;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].path === this.router.url) {
        this.curentRoute = this.options[i];
        if (this.count) {
          this.curentRoute.name = `${this.curentRoute.name }(${this.count})`;
        }
        this.options.splice(i, 1);
        break;
      }
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.dropDownActive = false;
    }
  }
}
