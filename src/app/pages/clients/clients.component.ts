import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ClientsService} from "../../services/sections/clients.service";
import {Client} from "../../utils/interfaces/client.interface";
import {WebSocketMangerService} from "../../services/web-socket-manger.service";
import {DataHandle} from "../../utils/general.interface";
import {FormsModule} from "@angular/forms";
import {ClientModel} from "../../utils/models/client.model";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, AfterViewInit {
  @ViewChild('cellAdd', {static: false}) cellTemp!: ElementRef;
  private cell!: HTMLElement;

  public showCellAdd: boolean = false;
  public currentClient!: Client;
  public clients: ClientModel[] = [];

  constructor(
      private services: ClientsService,
      private socket: WebSocketMangerService
  ) { }

  ngOnInit() {
    this.setClientDefault();
    this.handleClient();
    this.getData();
  }

  ngAfterViewInit() {
    this.cell = this.cellTemp.nativeElement;
    this.cell.style.display = 'none';
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public addClient(value: boolean = this.showCellAdd) {
    this.showCellAdd = !value;
    if (!this.showCellAdd) {
      this.setClientDefault();
    }
    this.cell.style.display = this.showCellAdd ? 'block' : 'none';
    this.cell.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  public setEditClient(client: ClientModel) {
    this.currentClient = {...client.getJSON() };
    this.addClient(false);
  }

  public sendRequest() {
    if (!this.validate()) { return; }
    if (this.currentClient.id_client === 0) {
      this.sendAdd();
    } else {
      this.sendUpdate();
    }
  }

  public deleteClient(client: ClientModel) {
    this.currentClient = client.getJSON();
    this.sendDelete();
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private getData() {
    this.services.syncClients().then(_ => {
      this.clients = this.services.clients.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  private validate(): boolean {
    return !!this.currentClient.name.trim() && !!this.currentClient.email.trim() && !!this.currentClient.phone.trim();
  }

  private sendAdd() {
    const {id_client, created_at, ...data} = this.currentClient;
    this.socket.sendEvent('INSERT_CLIENT', data);
    this.addClient();
  }

  private sendUpdate() {
    const {created_at, ...data} = this.currentClient;
    this.socket.sendEvent('UPDATE_CLIENT', data);
    this.addClient();
  }

  private sendDelete() {
    const data = { id_client: this.currentClient.id_client };
    this.socket.sendEvent('DELETE_CLIENT', data);
    this.setClientDefault();
  }

  private handleClient() {
    this.socket.handleClient.subscribe(data => {
      if (!data) { return; }
      this.processEvent(data)
    });
  }

  private setClientDefault() {
    this.currentClient = {
      id_client: 0,
      name: '',
      email: '',
      phone: '',
      created_at: new Date()
    };
  }

  private processEvent(event: DataHandle<Client>) {
    const client = new ClientModel(event.data);
    switch (event.type) {
      case 'insert':
        this.clients.push(client);
        this.clients = this.clients.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'update':
        const index = this.clients.findIndex(item => item.id_client === client.id_client);
        if (index !== -1) {
          this.clients[index] = client;
        }
        break;
      case 'delete':
        const data: any = event.data;
        const idClient = data.id_client;
        this.clients = this.clients.filter(item => item.id_client !== idClient);
        break;
    }
  }
}
