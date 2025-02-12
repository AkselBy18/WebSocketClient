import { Injectable } from '@angular/core';
import {DataHandle, ResponseData} from "../utils/general.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {Client} from "../utils/interfaces/client.interface";
import {Address} from "../utils/interfaces/address.interface";

@Injectable({
  providedIn: 'root'
})
export class WebSocketMangerService {
  private URL = 'ws://localhost:3000'
  private socket!: WebSocket;

  private handleClients = new BehaviorSubject<DataHandle<Client> | null>(null);
  private handleAddresses = new BehaviorSubject<DataHandle<Address> | null>(null);

  constructor() { }

  //MARK: GETTERS AND SETTERS ------------------------------------------------------------------------
  public setHandleClient(data: object, event: string) {
    this.handleClients.next({
      data: data as Client,
      type: event as 'insert' | 'update' | 'delete'
    });
  };

  public setHandleAddress(data: object, event: string) {
    this.handleAddresses.next({
      data: data as Address,
      type: event as 'insert' | 'update' | 'delete'
    });
  }

  public get handleClient() {
    return this.handleClients.asObservable() as Observable<DataHandle<Client>>;
  }

  public get handleAddress() {
    return this.handleAddresses.asObservable() as Observable<DataHandle<Address>>;
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }
    this.socket = new WebSocket(this.URL, 'JP57HxEL%90LwzX0X1h7k258')

    this.socket.onmessage = (event) => {
      const response: ResponseData = JSON.parse(event.data);
      switch (response.table) {
        case 'clients': this.setHandleClient(response.data, response.event);
          break;
        case 'addresses': this.setHandleAddress(response.data, response.event);
          break;
      }
      console.log("SERVER MESSAGE", event.data);
    }

    this.socket.onerror = (event) => {
      console.log("SERVER ERROR", event)
    }

    this.socket.onclose = (event) => {
      console.log("SERVER CLOSED", event);
    }
  }

  public sendEvent(name: string, data: object) {
    const message = JSON.stringify({
      event: name,
      data: data
    });
    console.log("event sending", message);
    this.socket.send(message);
  }
}
