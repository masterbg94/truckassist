import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-flip-cards',
  templateUrl: './small-flip-cards.component.html',
  styleUrls: ['./small-flip-cards.component.scss']
})
export class SmallFlipCardsComponent implements OnInit {
  @Input() cardtType: string;
  @Input() data: string;
  flipedIndex = -1;
  prevFlipedIndex = -1;
  shopItemsList: any = ['TRU', 'TRA', 'MO', 'SH', 'TO', 'PA', 'TI', 'DE'];
  constructor() { }

  ngOnInit(): void {
  }

  public flipUnflip(indx) {
    this.prevFlipedIndex = this.flipedIndex;
    if ( this.flipedIndex != indx ) { this.flipedIndex = indx; } else { this.flipedIndex = -1; }
  }

  returnInitials(fullName: string) {
    if (fullName !== null && fullName !== undefined) {
      const initials = fullName
        .split(' ')
        .map((x) => x.charAt(0))
        .join('')
        .substr(0, 2)
        .toUpperCase();
      return initials;
    } else {
      return '';
    }
  }

  public copy(event: any): void {
    const copyText = event.target.textContent;
    const colorText = event.target.parentElement;
    const copy = event.target.nextSibling;
    copy.style.opacity = '1';
    copy.style.width = colorText.clientWidth + 'px';
    copy.style.display = 'block';
    copy.classList.add('active');
    copy.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      copy.style.opacity = '0';
      copy.classList.remove('active');
      setTimeout(() => {
        copy.style.width = '0px';
      });
    }, 1000);
    const el = document.createElement('textarea');
    el.value = copyText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

}
