import { Component, HostListener, OnInit } from '@angular/core';
import {createTriggerHeading1, createTriggerHeading2} from './app-no-page-found.trigger';
@Component({
  selector: 'app-app-no-page-found',
  templateUrl: './app-no-page-found.component.html',
  styleUrls: ['./app-no-page-found.component.scss'],
  animations: [createTriggerHeading1('documentItem'),
               createTriggerHeading2('documentItem2')]
})
export class AppNoPageFoundComponent implements OnInit {

  stateMouseMove = false;
  stateAnimations = false;
  randomNumber: number;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    event.clientY > 1 ? this.stateMouseMove = true : this.stateMouseMove = false;
  }

  constructor() {
    this.randomNumber = this.getRandomInt(3);
  }

  ngOnInit() {
    this.stateAnimations = true;
  }

  getRandomInt(num) {
    return Math.floor(Math.random() * Math.floor(num));
  }
}
