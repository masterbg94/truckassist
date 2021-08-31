import { Component, Input, OnInit } from '@angular/core';
import {
  getDefaultMoveToList,
  getPmDefaultFilterList,
  getPmDefaultList,
} from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-pm-add-or-filter',
  templateUrl: './pm-add-or-filter.component.html',
  styleUrls: ['./pm-add-or-filter.component.scss'],
})
export class PmAddOrFilterComponent implements OnInit {
  @Input() isFilter: boolean;
  toolTipText: string;

  /* PM Filter */
  showPmList: boolean;
  pmFilterList = [];

  /* PM ADD TO REPAIR */
  pmAddList: any;
  addNewPm: boolean;
  newPM = '';
  editPMName = '';
  moveTo = [];
  openDropDownI: number;
  openDropDownJ: number;
  showMoveToOptions: boolean;
  showAddMiles: boolean;
  milesCount = 10;
  showDeleteDilaog: boolean;
  popoverDropdown: any;

  constructor() {}

  ngOnInit(): void {
    this.toolTipText = this.isFilter ? 'Preventive Maintenance' : 'Preventative Maintenance Items';

    const pmList = JSON.parse(localStorage.getItem('pmList'));

    if (pmList) {
      this.pmAddList = pmList.data;
      this.getPmCustomFilterList();
    } else {
      this.pmAddList = getPmDefaultList();
    }

    this.getMoveToList();

    console.log('pmAddList');
    console.log(this.pmAddList);
  }

  getMoveToList() {
    const moveToList = JSON.parse(localStorage.getItem('moveToList'));
    if (moveToList) {
      this.moveTo = moveToList.data;
    } else {
      this.moveTo = getDefaultMoveToList();
    }
  }

  onOpenMoveToList(pmLitsItemToShow: any) {
    this.showMoveToOptions = !this.showMoveToOptions;

    if (this.showMoveToOptions) {
      this.getMoveToList();
    }
    /* TODO: TREBA DA SE ZAVRIS LOKIGA KOJI TREBA A KOJI NE DA SE POJAVLJUJE */
    /* let pmList;
    for (let i = 0; i < this.pmAddList.length; i++) {
      for (let j = 0; j < this.pmAddList[i].pms.length; j++) {
        if (this.pmAddList[i].pms[j].iconName === pmLitsItemToShow.iconName) {
          pmList = this.pmAddList[i];
          break;
        }
      }
    }

    for (let i = 0; i < this.moveTo.length; i++) {
      if (this.moveTo[i].count === pmList.milesCount) {
        this.moveTo.splice(i, 1);
        break;
      }
    } */
  }

  getPmCustomFilterList() {
    const pmList = JSON.parse(localStorage.getItem('pmList'));

    if (pmList) {
      for (let list of pmList.data) {
        for (let pms of list.pms) {
          this.pmFilterList.push({
            active: false,
            icon: pms.icon,
            name: pms.iconName,
            customIconText: pms.customIconText,
          });
        }
      }
    } else {
      this.pmFilterList = getPmDefaultFilterList();
    }
  }

  onShowFilterList() {
    this.showPmList = !this.showPmList;

    if (this.showPmList) {
      this.pmFilterList = [];
      this.getPmCustomFilterList();
    }
  }

  onFilterPm(item: any) {
    item.active = !item.active;
  }

  toggleAddPopUp(popover: any) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open();
    }
  }

  toggleDropDown(popover: any, i: number, j: number, data: any) {
    if (popover.isOpen()) {
      popover.close();
      this.openDropDownI = -1;
      this.openDropDownJ = -1;
      this.showMoveToOptions = false;
    } else {
      popover.open({ data });
      this.openDropDownI = i;
      this.openDropDownJ = j;
      this.popoverDropdown = popover;
    }
  }

  focusAddNewPM() {
    this.addNewPm = true;
    const interval = setInterval(() => {
      document.getElementById('createPM').focus();
      clearInterval(interval);
    }, 200);
  }

  focusRenamePM(j: number) {
    const interval = setInterval(() => {
      document.getElementById(`editPM${j}`).focus();
      clearInterval(interval);
    }, 200);
  }

  onEnterSaveNewPm(keyEvent: any) {
    if (
      keyEvent.keyCode === 13 &&
      keyEvent.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      keyEvent.preventDefault();
      this.onSaveNewPm();
    }
  }

  onSaveNewPm() {
    this.pmAddList[0].pms.push({
      icon: '',
      iconName: this.newPM,
      customIconText: this.getCustomIcon(),
      edit: false,
    });

    localStorage.setItem('pmList', JSON.stringify({ data: this.pmAddList }));
    this.newPM = '';
    this.addNewPm = false;
  }

  onEnterSaveRename(keyEvent: any, pmToRename: any) {
    if (
      keyEvent.keyCode === 13 &&
      keyEvent.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      keyEvent.preventDefault();
      this.onSaveRename(pmToRename);
    }
  }

  onSaveRename(pmToRename: any) {
    pmToRename.iconName = this.editPMName;
    pmToRename.edit = false;
    this.editPMName = '';
    localStorage.setItem('pmList', JSON.stringify({ data: this.pmAddList }));
  }

  onDontSaveRename(pmToRename: any) {
    pmToRename.edit = false;
    this.editPMName = '';
  }

  getCustomIcon() {
    let arrayOfWords = [],
      word = '',
      newText = '';

    for (const c of this.newPM) {
      if (c !== ' ') {
        word += c;
      } else {
        if (word !== '') {
          arrayOfWords.push(word);
        }
        word = '';
      }
    }

    if (word !== '') {
      arrayOfWords.push(word);
    }

    if (arrayOfWords[0]) {
      newText += arrayOfWords[0].charAt(0);
    }

    if (arrayOfWords[1]) {
      newText += arrayOfWords[1].charAt(0);
    }

    return newText;
  }

  onDontSavePm() {
    this.newPM = '';
    this.addNewPm = false;
  }

  onShowRename(pmToRename: any) {
    pmToRename.edit = true;
    this.editPMName = pmToRename.iconName;
    this.focusRenamePM(this.openDropDownJ);
    this.popoverDropdown.close();
    this.openDropDownI = -1;
    this.openDropDownJ = -1;
  }

  onDeletePM(isDelete: boolean, pmLitsItemToDelete: any) {
    if (isDelete) {
      for (let i = 0; i < this.pmAddList.length; i++) {
        for (let j = 0; j < this.pmAddList[i].pms.length; j++) {
          if (this.pmAddList[i].pms[j].iconName === pmLitsItemToDelete.iconName) {
            this.pmAddList[i].pms.splice(j, 1);
            break;
          }
        }
      }
      localStorage.setItem('pmList', JSON.stringify({ data: this.pmAddList }));
      this.showDeleteDilaog = false;
    } else {
      this.showDeleteDilaog = false;
    }
  }

  onMoveTo(moveTo: any, pmLitsItemToMove: any) {
    let hasThatList = false;

    /* Remuve From Previous List */
    for (let i = 0; i < this.pmAddList.length; i++) {
      for (let j = 0; j < this.pmAddList[i].pms.length; j++) {
        if (this.pmAddList[i].pms[j].iconName === pmLitsItemToMove.iconName) {
          this.pmAddList[i].pms.splice(j, 1);
          break;
        }
      }
    }

    /* Add To Selected List If List Exists*/
    for (let pm of this.pmAddList) {
      if (pm.id === moveTo.id) {
        pm.pms.push(pmLitsItemToMove);
        hasThatList = true;
        break;
      }
    }

    /* If List Does Not Exists, Crete New List */
    if (!hasThatList) {
      this.pmAddList.push({
        id: moveTo.id,
        miles: moveTo.count + ',000 Miles',
        milesCount: moveTo.count,
        pms: [pmLitsItemToMove],
      });
    }

    /* Sort Lists*/
    this.pmAddList.sort(function (a, b) {
      if (a.milesCount < b.milesCount) {
        return -1;
      }
      if (a.milesCount > b.milesCount) {
        return 1;
      }
      return 0;
    });

    /* Save To localStorage Changes*/
    localStorage.setItem('pmList', JSON.stringify({ data: this.pmAddList }));

    this.showMoveToOptions = false;
    this.showAddMiles = false;
  }

  onAddMiles() {
    let count = this.getAddCount();
    this.milesCount += count;
  }

  onRemuveMiles() {
    if (this.milesCount > 10) {
      let count = this.getAddCount();
      this.milesCount -= count;
    }
  }

  getAddCount() {
    let count = 0;

    if (this.milesCount >= 10 && this.milesCount < 20) {
      count = 1;
    } else if (this.milesCount >= 20 && this.milesCount < 50) {
      count = 3;
    } else if (this.milesCount >= 50 && this.milesCount < 100) {
      count = 5;
    } else {
      count = 10;
    }

    return count;
  }

  saveNewMiles() {
    let alreadyHas = false;
    this.moveTo.filter((t)=>{
      if(t.count === this.milesCount){
        alreadyHas = true;
      }
    })

    if(!alreadyHas){
      this.moveTo.push({
        count: this.milesCount,
        id: this.moveTo[this.moveTo.length - 1].id + 1,
      });
  
      this.moveTo.sort(function (a, b) {
        if (a.count < b.count) {
          return -1;
        }
        if (a.count > b.count) {
          return 1;
        }
        return 0;
      });
  
      localStorage.setItem('moveToList', JSON.stringify({ data: this.moveTo }));
    }
    
    this.milesCount = 10;
    this.showAddMiles = false;
  }

  onDontSaveMiles() {
    this.showAddMiles = false;
    this.milesCount = 10;
  }
}
