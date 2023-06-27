import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { IAddress } from 'src/app/shared/models/user';
import { IOrderToCreate } from 'src/app/shared/models/order';
import { NavigationExtras, Router } from '@angular/router';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', { static: false }) cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry', { static: false }) cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc', { static: false }) cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardErrors: any;
  loading = false;
  constructor(private basketService: BasketService, private checkoutService: CheckoutService,
    private toastrService: ToastrService, private router: Router) { }

  ngAfterViewInit(): void {
    loadStripe("pk_test_AbTOddWLqoAVYKJWpqlEhYBk00iQ4KJi4D").then(stripe => {
      this.stripe = stripe;
      const elements = this.stripe.elements();
      if (elements) {
        // Create card number
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', event => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        // Create card expiry
        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', event => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        // Create card cvc
        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', event => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })
      }
    });
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toastrService.error(paymentResult.error.message);
      }
    } catch (error) {
      console.log(error);
      this.toastrService.error(error.message);
    } finally {
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket: IBasket) {
    if (!basket) throw new Error('Basket is null');
    const result = this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    })
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }

  private async createOrder(basket: IBasket) {
    if (!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')?.value as IAddress;
    if (!deliveryMethod || !shipToAddress) throw new Error('Problem with Basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethod,
      shipToAddress: shipToAddress
    }
  }

}
