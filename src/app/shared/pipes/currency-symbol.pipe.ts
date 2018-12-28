import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  pure: false
})
export class CurrencySymbolPipe implements PipeTransform {

  currency_symbols = {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    };

  transform(value: any): any {
    if (value.length === 0){
        return value;
    } else {
        let symbol = this.currency_symbols[value];
        return symbol ? symbol : value;
    }


  }
}
