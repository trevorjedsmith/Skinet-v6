import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { OrdersRoutingModule } from './orders-routing.module';



@NgModule({
  declarations: [OrdersComponent, OrdersDetailsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
