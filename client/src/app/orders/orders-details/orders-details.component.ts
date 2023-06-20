import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/models/order';
import { OrdersService } from '../orders.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  order: IOrder;
  constructor(private orderService: OrdersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    const id = +this.activatedRoute.snapshot.params["id"];
    this.orderService.getOrder(id).subscribe(order => {
      this.order = order;
    })
  }

}
