import { ReviewSingleCheckButtonComponent } from './core/reviewSingleCheckButton/reviewSingleCheckButton.component';
// Modules
import { ApplicantRoutingModule } from './applicant-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';
// Components
import { ApplicantComponent } from './applicant.component';
import { StepEightComponent } from './application/step-eight/step-eight.component';
import { StepElevenComponent } from './application/step-eleven/step-eleven.component';
import { StepFiveComponent } from './application/step-five/step-five.component';
import { StepFourComponent } from './application/step-four/step-four.component';
import { StepNineComponent } from './application/step-nine/step-nine.component';
import { StepOneComponent } from './application/step-one/step-one.component';
import { StepSevenComponent } from './application/step-seven/step-seven.component';
import { StepSixComponent } from './application/step-six/step-six.component';
import { StepTenComponent } from './application/step-ten/step-ten.component';
import { StepThreeComponent } from './application/step-three/step-three.component';
import { StepTwelveFinalComponent } from './application/step-twelve-final/step-twelve-final.component';
import { StepTwoComponent } from './application/step-two/step-two.component';
import { MedicalCartComponent } from './medical-cart/medical-cart.component';
import { MvrAuthComponent } from './mvr-auth/mvr-auth.component';
import { PspAuthComponent } from './psp-auth/psp-auth.component';
import { ApplicationComponent } from './application/application.component';
import { HosRulesComponent } from './hos-rules/hos-rules.component';
import { SphComponent } from './sph/sph.component';
import { SsnCardComponent } from './ssn-card/ssn-card.component';
import { CdlCardComponent } from './cdl-card/cdl-card.component';
import { RequiredYesNoComponent } from './core/required-yes-no/required-yes-no.component';
import { AppTitleCaseDirective } from './core/appTitleCase/appTitleCase.directive';
import { ReviewCheckButtonComponent } from './core/reviewCheckButton/reviewCheckButton.component';
import { ReviewConfirmAllComponent } from './core/reviewConfirmAll/reviewConfirmAll.component';
import { SphReviewerComponent } from './sph/sph-reviewer/sph-reviewer.component';

@NgModule({
  imports: [CommonModule, ApplicantRoutingModule, SignaturePadModule, SharedModule, RouterModule],
  declarations: [
    ApplicantComponent,
    ApplicationComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    StepSevenComponent,
    StepEightComponent,
    StepNineComponent,
    StepTenComponent,
    StepElevenComponent,
    StepTwelveFinalComponent,
    MedicalCartComponent,
    MvrAuthComponent,
    PspAuthComponent,
    HosRulesComponent,
    SphComponent,
    SsnCardComponent,
    CdlCardComponent,
    RequiredYesNoComponent,
    AppTitleCaseDirective,
    ReviewCheckButtonComponent,
    ReviewConfirmAllComponent,
    ReviewSingleCheckButtonComponent,
    SphReviewerComponent
  ],
})
export class ApplicantModule {}
