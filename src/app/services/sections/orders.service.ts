import { Injectable } from '@angular/core';
import {RequestService} from "../request.service";
import {Order} from "../../utils/interfaces/orders.interface";
import {ClientsService} from "./clients.service";
import {ClientModel} from "../../utils/models/client.model";
import {OrderModel} from "../../utils/models/order.model";
import {AddressesService} from "./addresses.service";
import {AddressModel} from "../../utils/models/address.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private clients: ClientModel[] = [];
  private ordersModel: OrderModel[] = [];

  constructor(
      private services: RequestService,
      private clientServices: ClientsService,
  ) { }

  public getOrders(): OrderModel[] {
    return this.ordersModel;
  }

  public getClients() {
    return this.clients;
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public syncOrders() {
    return new Promise((resolve, reject) => {
      this.services.sync<Order[]>('orders').subscribe(data => {
        this.clientServices.getClients().then(clients => {
          this.clients = clients;
          this.setModelOrder(data);
          resolve(true);
        });
      });
    });
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private setModelOrder(orders: Order[]) {
    for (const row of orders) {
      const client = this.clients.find(client => client.id_client === row.id_client);
      if (!client) return;
      this.ordersModel.push(new OrderModel(row, client));
    }
  }
}
