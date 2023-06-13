import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  user$: Observable<IUser>;
  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basketSource$;
    this.user$ = this.accountService.currentUser$;
  }

  getCount(items: IBasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

}
