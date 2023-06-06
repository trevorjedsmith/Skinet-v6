import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Input() totalCount: number;

  @Output() pageChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  setPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.pageChanged.emit(this.pageNumber);
  }

  next(){
    if (this.pageNumber < this.totalPages.length){
      this.pageNumber++;
      this.pageChanged.emit(this.pageNumber);
    }
  }

  previous(){
    if (this.pageNumber > 1){
      this.pageNumber--;
      this.pageChanged.emit(this.pageNumber);
    }
  }

  get totalPages(): number[] {
    const pages: number[] = [];
    const pagesLength = Math.ceil(this.totalCount / this.pageSize);
    for (let i = 1; i < pagesLength; i++) {
      pages.push(i);
    }
    return pages;
  }

}
