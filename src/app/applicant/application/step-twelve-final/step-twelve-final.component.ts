import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApplicantStore } from '../../service/applicant.service';

@Component({
  selector: 'app-step-twelve-final',
  templateUrl: './step-twelve-final.component.html',
  styleUrls: ['./step-twelve-final.component.scss'],
})
export class StepTwelveFinalComponent implements OnInit {

  constructor(private router: Router, private storeApplicant: ApplicantStore) {}

  ngOnInit(): void {}

  submit() {
    this.router.navigate(['/applicant/medical-certificate']);
    this.storeApplicant.isDoneApplicant.emit('yes');
  }
}
