import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-search-container',
  templateUrl: './chat-search-container.component.html',
  styleUrls: ['./chat-search-container.component.scss']
})
export class ChatSearchContainerComponent implements OnInit {

  public chatSearchFocus: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
