import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { StepperComponent } from './stepper/stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [OrderTotalsComponent, StepperComponent, BasketSummaryComponent],
  imports: [
    CommonModule,
    CdkStepperModule,
    RouterModule
  ],
  exports: [OrderTotalsComponent, StepperComponent, CdkStepperModule, BasketSummaryComponent]
})
export class SharedModule { }
