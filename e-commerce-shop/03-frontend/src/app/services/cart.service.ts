import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(item: CartItem) {

    //check if we already have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on the item id;
      existingCartItem = this.cartItems.find(i => i.id === item.id);

      //check if we found it
      alreadyExistInCart = (existingCartItem != undefined);
    }

    if (alreadyExistInCart) {
      //increment quantity
      existingCartItem.quantity++;
    } else {
      //just add the item to the array
      this.cartItems.push(item);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();

  }
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (const cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    //publish the new values... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart')

    for (const cartItem of this.cartItems) {
      const subtotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity=${cartItem.quantity}, unitPrice=${cartItem.unitPrice}, subTotalPrice=${subtotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('------')
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;

    if (item.quantity === 0) {
      this.remove(item);
    } else {
      this.computeCartTotals();
    }
  }
  
  remove(item: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(i => i.id === item.id);

    // if found remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
