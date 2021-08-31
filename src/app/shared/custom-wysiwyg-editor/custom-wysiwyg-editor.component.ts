import { WysiwygService } from './../../core/services/app-wysiwyg.service';
import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { Wysiwig } from '../../core/model/wysiwig';

@Component({
  selector: 'app-custom-wysiwyg-editor',
  templateUrl: './custom-wysiwyg-editor.component.html',
  styleUrls: ['./custom-wysiwyg-editor.component.scss']
})
export class CustomWysiwygEditorComponent implements OnInit {
  @Input() sidebarWidth: any;
  @Input() selectedEditor: any;
  @Input() range: any;
  @Input() settings: Wysiwig;
  selectedFontFamily = 3;
  selectedFontSize = 14;
  textAlignImages: any[] = [
      {
        img: 'align-left.svg',
        value: 'justifyLeft'
      },
      {
        img: 'align-right.svg',
        value: 'justifyRight'
      },
      {
        img: 'align-middle.svg',
        value: 'justifyCenter'
      },
      // {
      //   img: "align-all.svg",
      //   value: "justifyLeft"
      // }

  ];
  selectedAlign: any = { img: 'align-left.svg', value: 'justifyLeft'};

  fontFamilyList: any[] = [
    {
      id: 1,
      name: 'Arial',
      showName: 'Arial'
    },
    {
      id: 2,
      name: 'Courier New',
      showName: 'Courier N.'
    },
    {
      id: 3,
      name: 'Default',
      showName: 'Default'
    },
    {
      id: 4,
      name: 'Georgia',
      showName: 'Georgia'
    },
    {
      id: 5,
      name: 'Impact',
      showName: 'Impact'
    },
    {
      id: 6,
      name: 'Lucida Grande',
      showName: 'Lucida Grande'
    },
    {
      id: 7,
      name: 'Tahoma',
      showName: 'Tahoma'
    },
    {
      id: 8,
      name: 'Times New Roman',
      showName: 'Times New R.'
    }
  ];

  showDropdown: boolean;
  customSelectColor: any[] =  ['#D1D1D1', '#919191', '#3D3D3D', '#9842D8', '#7040A1', '#442265', '#F84D9F', '#CF3991', '#873565', '#FF7B1D', '#FF5C50', '#E61D0D', '#FFE567', '#FFD400', '#FFAA00', '#50DC96', '#00C76E', '#009E61', '#31E5DD', '#00C4BB', '#008C8F', '#49CBFF', '#00ACF0', '#0093CE' ];
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false,
    strikeThrough: false
  };

  selectionTaken: any;

  showCollorPattern: boolean;
  buttonsExpanded = false;
  isExpanded = false;
  editorDoc: any;
  value = '';

  selectedPaternColor = '#919191';

  constructor(
    private wysiwygservice: WysiwygService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
  }

  selectFontFamily(e): void {
    this.executeEditor('fontName', e.name);
  }


  selectAligment(e): void {
    this.executeEditor(e.value);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  changeTextColor(ind: number): void {
    const color = this.customSelectColor[ind];
    this.executeEditor('foreColor', color);
    this.toggleDropdown();
  }

  executeEditor(action: string, color?: string) {
    this.selectionTaken = window.getSelection();
    document.execCommand('styleWithCSS', false, 'true');
    if (this.range) {
        this.selectionTaken.removeAllRanges();
        this.selectionTaken.addRange(this.range);
    }
    if ( action !== 'foreColor' && action !== 'fontName' ) {
      this.showCollorPattern = false;
      this.activeOptions[action] = !this.activeOptions[action];
      if ( !this.activeOptions[action] ) {
        if ( this.value.replace('<br>', '') == '' ) { this.selectionTaken.removeAllRanges(); }
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(action, false, null);
      } else {
        if ( this.selectedEditor ) { this.selectedEditor.focus(); }
        document.execCommand(action, false, null);
      }
    } else if (action == 'foreColor') {
         setTimeout(() => {
          if ( this.selectedEditor ) { this.selectedEditor.focus(); }
          setTimeout(() => {
            if ( this.selectedEditor ) { this.selectedEditor.focus(); }
            this.selectedPaternColor = color;
            document.execCommand('foreColor', false, color);
          });
        });
    } else if (action == 'fontName') {
      document.execCommand(action, false, color);
    }

    this.checkActiveItems();
    setTimeout(() => {
      this.wysiwygservice.updateField.next();
    }, 500);

  }

  changeFontSize(size) {
    document.execCommand('fontSize', false, '7');
    const fontElements = this.selectedEditor.getElementsByTagName('font');
    for (let i = 0, len = fontElements.length; i < len; ++i) {
            if (fontElements[i].size == '7' || fontElements[i].size == 'xxx-large') {
                fontElements[i].removeAttribute('size');
                fontElements[i].style.fontSize = `${size}px`;
            }
        }
    const spanElements = this.selectedEditor.getElementsByTagName('span');
    for (let i = 0; i < spanElements.length; ++i) {
          if (spanElements[i].style.fontSize == 'xxx-large') {
            spanElements[i].style.fontSize = `${size}px`;
          }
        }

    this.wysiwygservice.updateField.next();
  }

  public checkActiveItems() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        // console.log(selection.getRangeAt(0).startContainer.parentNode);

    for ( const act in this.activeOptions ) {
      this.activeOptions[act] = document.queryCommandState(act);
      this.selectedPaternColor = document.queryCommandValue('ForeColor');
    }
    }

    const finded_family = this.fontFamilyList.find(item => {
      return item.name.includes(document.queryCommandValue('fontName').replace('"', '').replace('"', ''));
    });

    if ( finded_family ) {
      this.selectedFontFamily = finded_family.id;
    } else {
      this.selectedFontFamily = document.queryCommandValue('fontName').includes('Montserrat') && 3;
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if ( clickedInside ) {
      const selectionTaken = window.getSelection();
      if ( selectionTaken.rangeCount && selectionTaken.getRangeAt) {
        const range = selectionTaken.getRangeAt(0);
        if ( this.range ) {
          selectionTaken.removeAllRanges();
          selectionTaken.addRange(this.range);
        }
      }
    }
  }
}
