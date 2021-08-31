import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { DriverTabData } from '../../core/model/driver';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-sidebar-chat',
  templateUrl: './sidebar-chat.component.html',
  styleUrls: ['./sidebar-chat.component.scss'],
})
export class SidebarChatComponent implements OnInit {

  constructor(public driverService: AppDriverService,  public router: Router, ) {}
  // TODO: USE CamelCase for property names
  public show_side_chat = false;
  public chatOptions = [{ option: 'DC' }, { option: 'DD' }, { option: 'CC' }, { option: 'CD' }];
  public chatOptionCC = [{ option: 'SA' }, { option: 'DI' }, { option: 'AC' }, { option: 'GE' }];
  public drivers: any;
  public show_All_Drivers_Company = false;
  public expend_side_chat = false;
  public count = 0;
  public sidebar_extended = false;
  public mesage_sent = false;
  public mesage_to_send = '';
  public time: Data;
  public messages = [];
  public send_to: string;
  public profileImg = '';
  public activeOption: number;
  public activeOptionCC: number;
  public showEmoji = false;
  public userSelected: number;

  /* For text change */
  interval: any;

  ngOnInit(): void {
    this.driverService.getDrivers().subscribe((driverTabData: DriverTabData) => {
      this.drivers = driverTabData.activeDrivers.map((driver) => {
        driver.fullName = `${driver.firstName.trim()} ${driver.lastName.trim()}`;
        return driver;
      });
    });
  }

  onSideBarChat() {
    this.show_side_chat = true;
    document.getElementById('side_chat').style.width = '58px';
    document.getElementById('side_chat').style.display = 'block';
    console.log(this.drivers);
  }

  onOptionSelcted(index: number) {
    this.activeOption = index;
    this.count++;
    if (index === 0) {
      this.show_All_Drivers_Company = true;
    } else {
      this.show_All_Drivers_Company = false;
    }
  }
  onOpenChat(index: number) {
    document.getElementById('side_chat').style.width = '345px';
    this.userSelected = index;
    this.sidebar_extended = true;
    this.send_to = this.drivers[index].firstName + ' ' + this.drivers[index].lastName;
    this.profileImg = this.drivers[index].driverImage;
  }

  onCloseChat() {
    document.getElementById('side_chat').style.width = '0px';
    document.getElementById('side_chat').style.display = 'none';
    this.sidebar_extended = false;
    this.show_side_chat = false;
    this.show_All_Drivers_Company = false;
    this.activeOption = null;
  }

  onShowEmoju() {
    this.showEmoji = !this.showEmoji;
  }

  addEmoji(event) {
    const { mesage_to_send } = this;
    const text = `${mesage_to_send}${event.emoji.native}`;
    this.mesage_to_send = text;
  }

  onSend() {
    if (this.mesage_to_send !== '') {
      this.time = new Date();
      this.messages.push({
        message: this.mesage_to_send,
        time: this.time,
      });

      this.mesage_sent = true;
      this.mesage_to_send = '';
    } else {
      console.log('Prazna poruka');
    }
  }

  onEnter(event) {
    if (
      event.keyCode === 13 &&
      !event.shiftKey &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      event.preventDefault();
      this.onSend();
    }
  }

  onCompanyChannel(index: number) {
    this.activeOptionCC = index;
    console.log(index);
  }
  onChangeText(index: number, option: string) {
    if (option === 'general option') {
      this.interval = setInterval(() => {
        switch (index) {
          case 0:
            this.chatOptions[index].option = 'Driver Chanel';
            break;
          case 1:
            this.chatOptions[index].option = 'Driver Direct';
            break;
          case 2:
            this.chatOptions[index].option = 'Company Channel';
            break;
          case 3:
            this.chatOptions[index].option = 'Company Direct';
            break;
        }
      }, 200);
    } else {
      this.interval = setInterval(() => {
        switch (index) {
          case 0:
            this.chatOptionCC[index].option = 'Safety';
            break;
          case 1:
            this.chatOptionCC[index].option = 'Dispatch';
            break;
          case 2:
            this.chatOptionCC[index].option = 'Accounting';
            break;
          case 3:
            this.chatOptionCC[index].option = 'General';
            break;
        }
      }, 200);
    }
  }
  onReturnText(index: number, option: string) {
    if (option === 'general option') {
      clearInterval(this.interval);
      switch (index) {
        case 0:
          this.chatOptions[index].option = 'DC';
          break;
        case 1:
          this.chatOptions[index].option = 'DD';
          break;
        case 2:
          this.chatOptions[index].option = 'CC';
          break;
        case 3:
          this.chatOptions[index].option = 'CD';
          break;
      }
    } else {
      clearInterval(this.interval);
      switch (index) {
        case 0:
          this.chatOptionCC[index].option = 'SA';
          break;
        case 1:
          this.chatOptionCC[index].option = 'DI';
          break;
        case 2:
          this.chatOptionCC[index].option = 'AC';
          break;
        case 3:
          this.chatOptionCC[index].option = 'GE';
          break;
      }
    }
  }
}
