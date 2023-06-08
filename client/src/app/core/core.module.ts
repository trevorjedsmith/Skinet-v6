import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaginationHeaderComponent } from './pagination-header/pagination-header.component';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';

@NgModule({
  declarations: [NavBarComponent, PaginationComponent, PaginationHeaderComponent, ErrorComponent, NotFoundComponent, ServerErrorComponent, SectionHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule
  ],
  exports: [NavBarComponent, PaginationComponent, PaginationHeaderComponent, SectionHeaderComponent]
})
export class CoreModule { }
