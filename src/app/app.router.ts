import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingMenuComponent } from '../app/modules/booking/components/booking-menu/booking-menu.component';
import { FlightInfoComponent } from '../app/modules/flight-info/components/flight-info/flight-info.component';


export const appRoutes: Routes = [
    
    { path: '',	component: BookingMenuComponent },
    { path: '**',	component: BookingMenuComponent },
    { path: 'flight-info',	component: FlightInfoComponent },
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

