import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SkiNet';
  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getAndSetBasket();
    this.getAndSetToken();
  }

  getAndSetToken() {
    const token = localStorage.getItem('token');
    if(token) this.accountService.loadCurrentUser(token).subscribe();
  }

  getAndSetBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) this.basketService.getBasket(basketId);
  }
}
