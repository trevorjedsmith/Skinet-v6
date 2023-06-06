import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaginationHeaderComponent } from './pagination-header/pagination-header.component';

@NgModule({
  declarations: [NavBarComponent, PaginationComponent, PaginationHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [NavBarComponent, PaginationComponent, PaginationHeaderComponent]
})
export class CoreModule { }
