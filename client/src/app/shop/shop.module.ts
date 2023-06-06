import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [ShopComponent, ShopItemComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [ShopComponent]
})
export class ShopModule { }
