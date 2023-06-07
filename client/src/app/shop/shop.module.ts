import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { CoreModule } from '../core/core.module';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing.module';



@NgModule({
  declarations: [ShopComponent, ShopItemComponent, ShopDetailsComponent],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
