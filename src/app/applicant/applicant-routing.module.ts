// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CdlCardComponent } from './cdl-card/cdl-card.component';
import { SsnCardComponent } from './ssn-card/ssn-card.component';
import { HosRulesComponent } from './hos-rules/hos-rules.component';
import { SphComponent } from './sph/sph.component';
import { PspAuthComponent } from './psp-auth/psp-auth.component';
import { MvrAuthComponent } from './mvr-auth/mvr-auth.component';
import { MedicalCartComponent } from './medical-cart/medical-cart.component';
import { StepTwelveFinalComponent } from './application/step-twelve-final/step-twelve-final.component';
import { StepElevenComponent } from './application/step-eleven/step-eleven.component';
import { StepTenComponent } from './application/step-ten/step-ten.component';
import { StepNineComponent } from './application/step-nine/step-nine.component';
import { StepEightComponent } from './application/step-eight/step-eight.component';
import { StepSevenComponent } from './application/step-seven/step-seven.component';
import { StepSixComponent } from './application/step-six/step-six.component';
import { StepFiveComponent } from './application/step-five/step-five.component';
import { StepFourComponent } from './application/step-four/step-four.component';
import { StepThreeComponent } from './application/step-three/step-three.component';
import { StepTwoComponent } from './application/step-two/step-two.component';
import { StepOneComponent } from './application/step-one/step-one.component';
import { ApplicantComponent } from './applicant.component';
import { ApplicationComponent } from './application/application.component';

// Guards
import { NavGuard } from './guards/nav.guard';
import { MedicalGuard } from './guards/medical.guard';
import { MvrGuard } from './guards/mvr.guard';
import { PspGuard } from './guards/psp.guard';
import { HosGuard } from './guards/hos.guard';
import { SsnGuard } from './guards/ssn.guard';
import { SphGuard } from './guards/sph.guard';
import { BlockStepsGuard } from './guards/block-steps.guard';

const routes: Routes = [
  {
    path: '',
    component: ApplicantComponent,
    children: [
      {
        path: 'application',
        component: ApplicationComponent,
        data: { title: 'Application', depth: 'application' },
        canActivateChild: [BlockStepsGuard],
        children: [
          {
            path: '1',
            component: StepOneComponent,
            data: { title: 'Personal Info', depth: 1 },
          },
          {
            path: '2',
            component: StepTwoComponent,
            data: { title: 'Work Experience', depth: 2 },
          },
          {
            path: '3',
            component: StepThreeComponent,
            data: { title: 'CDL Information', depth: 3 },
          },
          {
            path: '4',
            component: StepFourComponent,
            data: { title: 'Accident records', depth: 4 },
          },
          {
            path: '5',
            component: StepFiveComponent,
            data: { title: 'Traffic Violations', depth: 5 },
          },
          {
            path: '6',
            component: StepSixComponent,
            data: { title: 'Education', depth: 6 },
          },
          {
            path: '7',
            component: StepSevenComponent,
            data: { title: 'Days HOS', depth: 7 },
          },
          {
            path: '8',
            component: StepEightComponent,
            data: { title: 'Drug and Alchocol statement', depth: 8 },
          },
          {
            path: '9',
            component: StepNineComponent,
            data: { title: 'Driver Rights', depth: 9 },
          },
          {
            path: '10',
            component: StepTenComponent,
            data: { title: 'Disclosure and release', depth: 10 },
          },
          {
            path: '11',
            component: StepElevenComponent,
            data: { title: 'Authorization', depth: 11 },
          },
          {
            path: '12',
            component: StepTwelveFinalComponent,
            data: { title: 'Application Finish', depth: 12 },
          },
          { path: '**', redirectTo: '1', pathMatch: 'full' },
        ],
      },
      {
        canActivate: [NavGuard],
        path: 'medical-certificate',
        component: MedicalCartComponent,
        data: { title: 'Medical Certificate', depth: 'medical' },
      },
      {
        path: 'mvr-authorization',
        canActivate: [NavGuard, MedicalGuard],
        component: MvrAuthComponent,
        data: { title: 'MVR Authorization', depth: 'mvr' },
      },
      {
        canActivate: [NavGuard, MedicalGuard, MvrGuard],
        path: 'psp-authorization',
        component: PspAuthComponent,
        data: { title: 'PSP Authorization', depth: 'psp' },
      },
      {
        canActivate: [NavGuard, MedicalGuard, MvrGuard, PspGuard],
        path: 'sph',
        component: SphComponent,
        data: { title: 'SPH', depth: 'sph' },
      },
      {
        canActivate: [NavGuard, MedicalGuard, MvrGuard, PspGuard, SphGuard],
        path: 'hos-rules',
        component: HosRulesComponent,
        data: { title: 'HOS Rules', depth: 'hos' },
      },
      {
        canActivate: [NavGuard, MedicalGuard, MvrGuard, PspGuard, SphGuard, HosGuard],
        path: 'ssn-card',
        component: SsnCardComponent,
        data: { title: 'SSN Card', depth: 'ssn' },
      },
      {
        canActivate: [NavGuard, MedicalGuard, MvrGuard, PspGuard, SphGuard, HosGuard, SsnGuard],
        path: 'cdl-card',
        component: CdlCardComponent,
        data: { title: 'CDL Card', depth: 'cdl' },
      },
      { path: '**', redirectTo: 'application/1', pathMatch: 'full' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantRoutingModule {}
