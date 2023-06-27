import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper?: CdkStepper;
  constructor(private basketService: BasketService, private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe(() => {
      this.appStepper?.next();
    }, error => this.toastrService.error('Error: ' + error?.message || 'Oops something went wrong please try again.'))
  }

}
