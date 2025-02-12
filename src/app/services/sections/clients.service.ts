import { Injectable } from '@angular/core';
import {RequestService} from "../request.service";
import {Client} from "../../utils/interfaces/client.interface";
import {ClientModel} from "../../utils/models/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  public clients: ClientModel[] = [];

  constructor(private request: RequestService) { }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public syncClients() {
    return new Promise((resolve, reject) => {
      this.request.sync<Client[]>('clients').subscribe(data => {
        this.clients = data.map(row => new ClientModel(row));
        resolve(true);
      });
    })
  }
}
