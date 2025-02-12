import { Injectable } from '@angular/core';
import {RequestService} from "../request.service";
import {AddressInterface} from "../../utils/interfaces/address.interface";
import {ClientModel} from "../../utils/models/client.model";
import {AddressModel} from "../../utils/models/address.model";
import {ClientsService} from "./clients.service";

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private clients: ClientModel[] = [];

  public addressesModel: AddressModel[] = []

  constructor(
      private services: RequestService,
      private clientServices: ClientsService
  ) { }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public syncAddresses() {
    return new Promise((resolve, reject) => {
      this.services.sync<AddressInterface[]>('addresses').subscribe(response => {
        this.clientServices.getClients().then(data => {
          console.log(response)
          this.clients = data;
          this.setModelAddress(response);
          resolve(true);
        });
      });
    });
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private setModelAddress(addresses: AddressInterface[]) {
    this.addressesModel = [];
    addresses.forEach(row => {
      const client = this.clients.find(client => client.id_client === row.id_client);
      if (!client) return;
      this.addressesModel.push(new AddressModel(row, client));
    });
  }
}
