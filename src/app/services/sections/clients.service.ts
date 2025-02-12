import { Injectable } from '@angular/core';
import {RequestService} from "../request.service";
import {Client} from "../../utils/interfaces/client.interface";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  public clients: Client[] = [];

  constructor(private request: RequestService) { }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public syncClients() {
    return new Promise((resolve, reject) => {
      this.request.sync<Client[]>('clients').subscribe(data => {
        this.clients = data;
        resolve(true);
      });
    })
  }
}
