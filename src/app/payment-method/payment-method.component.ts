import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  constructor() { }
  submitted:any;
  customStripeForm:any;
  formProcess:any;
  message:any;

  pay(form) {
 
    if(!window['Stripe']) {
      alert('Oops! Stripe did not initialize properly.');
      return;
    }
     
    this.submitted = true;
   
    console.log(this.customStripeForm);
    if (this.customStripeForm.invalid) {      
      return;
    }   
   
    this.formProcess = true;
    console.log("form");
    console.log(form);
    if(!window['Stripe']) {
      alert('Oops! Stripe did not initialize properly.');
      return;
    }
    (<any>window).Stripe.card.createToken({
      number: form.cardNumber,
      exp_month: form.expMonth,
      exp_year: form.expYear,
      cvc: form.cvc
    }, (status: number, response: any) => {
      this.submitted = false;
      this.formProcess = false;
      if (status === 200) {
        this.message = `Success! Card token ${response.card.id}.`;
      } else {
        this.message = response.error.message;
      }
    });
  }
  ngOnInit(): void {
  }

}
