import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ClientsService} from "../../services/sections/clients.service";
import {Client} from "../../utils/interfaces/client.interface";
import {WebSocketMangerService} from "../../services/web-socket-manger.service";
import {DataHandle} from "../../utils/general.interface";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(
      private services: ClientsService,
      private socket: WebSocketMangerService
  ) { }

  ngOnInit() {
    this.handleClient();
    this.getData();
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private getData() {
    this.services.syncClients().then(_ => {
      this.clients = this.services.clients.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  private handleClient() {
    this.socket.handleClient.subscribe(data => {
      if (!data) { return; }
      this.processEvent(data)
    });
  }

  private processEvent(event: DataHandle) {
    const client = event.data as Client;
    switch (event.type) {
      case 'insert':
        console.log("cliente insertado")
        break;
      case 'update':
        const index = this.clients.findIndex(item => item.id_client === client.id_client);
        if (index !== -1) {
          this.clients[index] = {...client};
        }
        break;
      case 'delete':
        console.log("cliente eliminado")
        break;
    }
  }
}
