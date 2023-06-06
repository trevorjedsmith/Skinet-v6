import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [NavBarComponent, PaginationComponent],
  imports: [
    CommonModule
  ],
  exports: [NavBarComponent, PaginationComponent]
})
export class CoreModule { }
