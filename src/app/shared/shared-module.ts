import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LettersBarComponent } from './components/letters-bar/letters-bar.component';
import { SortPipe } from './pipes/sort.pipe';

import { TabsComponent } from './components/tabs/tabs.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { DisplaySelectedComponent } from './components/display-selected/display-selected.component';
import { DatePickerComponent } from './components/datepicker/datepicker.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { TravelerDropdownComponent } from './components/traveler-dropdown/traveler-dropdown.component';
import { ValueCounterComponent } from './components/value-counter/value-counter.component';

import { FilterSourcePipe } from './pipes/filter-source.pipe';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { HistoryCardComponent } from './components/search-history/history-card/history-card.component';
import { PromocodeComponent } from './components/promocode/promocode.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';
import { CurrencySymbolPipe } from './pipes/currency-symbol.pipe';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule.forRoot()
    ],
    declarations: [
    TabsComponent,
    AutocompleteComponent,
    DisplaySelectedComponent,
    FilterSourcePipe,
    DatePickerComponent,
    DropdownComponent,
    TravelerDropdownComponent,
    ValueCounterComponent,
    LettersBarComponent,
	  SortPipe,
	  SearchHistoryComponent,
    HistoryCardComponent,
    PromocodeComponent,
	InputTextComponent,
    MobileHeaderComponent,
    CurrencySymbolPipe,
    PaymentMethodComponent,
    RadioButtonComponent
	],
    exports: [
    TabsComponent,
    AutocompleteComponent,
    DisplaySelectedComponent,
    FilterSourcePipe,
    DatePickerComponent,
    DropdownComponent,
    TravelerDropdownComponent,
    ValueCounterComponent,
    LettersBarComponent,
	  SortPipe,
	  SearchHistoryComponent,
	  HistoryCardComponent,
    PromocodeComponent,
	InputTextComponent,
	MobileHeaderComponent,
    CurrencySymbolPipe,
    PaymentMethodComponent,
    RadioButtonComponent
    ]
  })
  export class SharedModule { }
