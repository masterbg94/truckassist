import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-insurance-type-edit',
  templateUrl: './insurance-type-edit.component.html',
  styleUrls: ['./insurance-type-edit.component.scss'],
})
export class InsuranceTypeEditComponent implements OnInit {
  insuranceTypeForm: FormGroup;
  insuranceTypes = [
    { id: 1, type: 'Commercial General Liability' },
    { id: 2, type: 'Automobile Liability' },
    { id: 3, type: 'Motor Truck Cargo Breakdown' },
    { id: 4, type: 'Motor Truck Cargo/Reefer Breakdown' },
    { id: 5, type: 'Physical Damage' },
    { id: 6, type: 'Trailer Interchange' },
  ];
  openInsuranceTypeDropDown = -1;
  insuranceType: string;
  commercialGeneralLiabilityForm: FormGroup;
  automobileLiabilityForm: FormGroup;
  motorTruckCargoBreakdown: FormGroup;
  physicalDamage: FormGroup;
  trailerInterchange: FormGroup;
  insuranceTypeData = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.insuranceTypeForm = this.formBuilder.group({
      insuranceTypes: ['', Validators.required],
    });
  }

  onOpenDropDown(index: number) {
    if (this.openInsuranceTypeDropDown === index) {
      this.openInsuranceTypeDropDown = -1;
    } else {
      this.openInsuranceTypeDropDown = index;
    }
  }

  selectInsuranceType(insurance: any) {
    switch (insurance.type) {
      case 'Commercial General Liability':
        this.commercialGeneralLiabilityForm = this.formBuilder.group({
          eachOccurrence: '',
          dmgToRentedPr: '',
          medicalExp: '',
          persAdvInj: '',
          genAggregate: '',
          prodCompOP: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
      case 'Automobile Liability':
        this.automobileLiabilityForm = this.formBuilder.group({
          combSingle: '',
          bodlyInjPerson: '',
          bodlyInjAccident: '',
          propertyDamage: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
      case 'Motor Truck Cargo Breakdown':
        this.motorTruckCargoBreakdown = this.formBuilder.group({
          singleConveyance: '',
          deductable: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
      case 'Motor Truck Cargo/Reefer Breakdown':
        this.motorTruckCargoBreakdown = this.formBuilder.group({
          singleConveyance: '',
          deductable: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
      case 'Physical Damage':
        this.physicalDamage = this.formBuilder.group({
          compColl: '',
          deductable: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
      case 'Trailer Interchange':
        this.trailerInterchange = this.formBuilder.group({
          value: '',
          policy: ['', Validators.required],
          insurer: ['', Validators.required],
        });
        break;
    }

    this.insuranceType = insurance.type;
  }

  saveInsurance() {
    switch (this.insuranceType) {
      case 'Commercial General Liability':
        this.getFormData(this.commercialGeneralLiabilityForm);
        break;
      case 'Automobile Liability':
        this.getFormData(this.automobileLiabilityForm);
        break;
      case 'Motor Truck Cargo Breakdown':
        this.getFormData(this.motorTruckCargoBreakdown);
        break;
      case 'Motor Truck Cargo/Reefer Breakdown':
        this.getFormData(this.motorTruckCargoBreakdown);
        break;
      case 'Physical Damage':
        this.getFormData(this.physicalDamage);
        break;
      case 'Trailer Interchange':
        this.getFormData(this.trailerInterchange);
        break;
    }
  }

  getFormData(form: FormGroup) {
    const formData = form.getRawValue();

    const saveData = {
      insuranceType: this.insuranceType,
      eachOccurrence: formData.eachOccurrence ? formData.eachOccurrence : null,
      dmgToRentedPr: formData.dmgToRentedPr ? formData.dmgToRentedPr : null,
      medicalExp: formData.medicalExp ? formData.medicalExp : null,
      persAdvInj: formData.persAdvInj ? formData.persAdvInj : null,
      genAggregate: formData.genAggregate ? formData.genAggregate : null,
      prodCompOP: formData.prodCompOP ? formData.prodCompOP : null,
      combSingle: formData.combSingle ? formData.combSingle : null,
      bodlyInjPerson: formData.bodlyInjPerson ? formData.bodlyInjPerson : null,
      bodlyInjAccident: formData.bodlyInjAccident ? formData.bodlyInjAccident : null,
      propertyDamage: formData.propertyDamage ? formData.propertyDamage : null,
      singleConveyance: formData.singleConveyance ? formData.singleConveyance : null,
      deductable: formData.deductable ? formData.deductable : null,
      compColl: formData.compColl ? formData.compColl : null,
      value: formData.value ? formData.value : null,
      policy: formData.policy,
      insurer: formData.insurer,
    };

    this.insuranceTypeData.push(saveData);

    console.log('Insurance Type Data');
    console.log(this.insuranceTypeData);
  }

  cancelInsurance() {}
}
