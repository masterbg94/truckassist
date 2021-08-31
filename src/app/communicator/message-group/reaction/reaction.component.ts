import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator-user-data.service';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent implements OnInit, OnDestroy {

  @Input() reaction?: any;
  @Input() reverse = false;
  @Output() onClick = new EventEmitter<string>();

  private user?: any;

  private userSubscription?: Subscription;

  constructor(private communicatorUserDataService: CommunicatorUserDataService) {

  }

  ngOnInit() {
    this.userSubscription = this.communicatorUserDataService.chatUser.subscribe((user?: any) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  isSelected() {
    if (this.reaction && this.user) {
      const userIds = this.reaction.users.map((item: any) => item.user);
      return userIds.includes(this.user.id);
    }
    return false;
  }

  onClickReaction() {
    if (this.reaction?.type) {
      this.onClick.emit(this.reaction.type);
    }
  }

}
