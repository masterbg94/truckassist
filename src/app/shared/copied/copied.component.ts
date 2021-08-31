import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copied',
  templateUrl: './copied.component.html',
  styleUrls: ['./copied.component.scss']
})
export class CopiedComponent {

  @Input() value: string;
  animate = false;

  constructor(private clipboard: Clipboard) { }

  onClick() {

    if (!this.animate) {
      this.animate = true;
      this.clipboard.copy(this.value);
      setTimeout(() => {
        this.animate = false;
      }, 500);
    }

  }

}
