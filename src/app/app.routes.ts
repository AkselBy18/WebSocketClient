import { Routes } from '@angular/router';
import {ClientsComponent} from "./pages/clients/clients.component";
import {AdressesComponent} from "./pages/adresses/adresses.component";
import {OrdersComponent} from "./pages/orders/orders.component";

export const routes: Routes = [
    { path: 'Clients', component: ClientsComponent },
    { path: 'Address', component: AdressesComponent },
    { path: 'Orders', component: OrdersComponent },
    { path: '**', redirectTo: 'Clients' }
];
