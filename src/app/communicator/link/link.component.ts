import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {

  @Input() link?: any;

  ytVideoId = '';

  ngOnInit(): void {
    if (this.link.url.includes('youtube')) {
      const posIndex = this.link.url.indexOf('=');
      if (posIndex != -1) {
        this.ytVideoId = this.link.url.substr(posIndex + 1);
      } else {
        this.ytVideoId = 'https://www.youtube.com/';
      }
    }
  }

  openPage() {
    if (this.link) {
      const url = this.link.url.startsWith('http://') || this.link.url.startsWith('https://') ? this.link.url : `http://${this.link.url}`;
      window.open(url, '_blank');
    }
  }

  getYoutubeLinkTitle(link: string) {
    const posIndex = link.indexOf('/');
    
     return link.substr(posIndex + 2);
    
  }

}
