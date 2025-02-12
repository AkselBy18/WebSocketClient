import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AddressesService} from "../../services/sections/addresses.service";
import {WebSocketMangerService} from "../../services/web-socket-manger.service";
import {AddressModel} from "../../utils/models/address.model";
import {Address} from "../../utils/interfaces/address.interface";
import {ClientModel} from "../../utils/models/client.model";
import {FormsModule} from "@angular/forms";
import {DataHandle} from "../../utils/general.interface";

@Component({
  selector: 'app-adresses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './adresses.component.html',
  styleUrl: './adresses.component.css'
})
export class AdressesComponent implements OnInit, AfterViewInit {
  @ViewChild('cellAdd', {static: false}) cellTemp!: ElementRef;
  private cell!: HTMLElement;

  public showCellAdd: boolean = false;
  public currentAddress!: Address;
  public clients: ClientModel[] = [];
  public addresses: AddressModel[] = [];

  constructor(
      private service: AddressesService,
      private socket: WebSocketMangerService
  ) { }

  ngOnInit() {
    this.setDefaultAddress();
    this.handleAddress();
    this.getData();
  }

  ngAfterViewInit() {
    this.cell = this.cellTemp.nativeElement;
    this.cell.style.display = 'none';
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public addAddress(value: boolean = this.showCellAdd) {
    this.showCellAdd = !value;
    if (!this.showCellAdd) {
      this.setDefaultAddress();
    }
    this.cell.style.display = this.showCellAdd ? 'block' : 'none';
    this.cell.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  public setEditAddress(address: AddressModel) {
    this.currentAddress = {...address.getJSON()};
    this.addAddress(false);
  }

  public sendRequest() {
    if (!this.validate()) { return }
    if (this.currentAddress.id_address === 0) {
      this.sendAdd();
    } else {
      this.sendUpdate();
    }
  }

  public deleteAddress(address: AddressModel) {
    this.currentAddress = address.getJSON();
    this.sendDelete();
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private getData() {
    this.service.syncAddresses().then(_ => {
      this.addresses = this.service.addressesModel;
      this.clients = this.service.clients.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  private sendAdd() {
    const {created_at, id_address, ...data} = this.currentAddress;
    this.socket.sendEvent('INSERT_ADDRESS', data);
    this.addAddress();
  }

  private sendUpdate() {
    const {created_at, id_client, ...data} = this.currentAddress;
    this.socket.sendEvent('UPDATE_ADDRESS', data);
    this.addAddress();
  }

  private sendDelete() {
    const data = { id_address: this.currentAddress.id_address };
    this.socket.sendEvent('DELETE_ADDRESS', data);
    this.setDefaultAddress();
  }

  private validate(): boolean {
    return!!this.currentAddress.street.trim() &&!!this.currentAddress.city.trim() &&!!this.currentAddress.state.trim() &&!!this.currentAddress.country.trim() &&!!this.currentAddress.zip_code.trim();
  }

  private setDefaultAddress() {
    this.currentAddress = {
      id_address: 0,
      street: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      id_client: 0,
      created_at: new Date(),
    };
  }

  private handleAddress() {
    this.socket.handleAddress.subscribe(data => {
      if (!data) { return; }
      this.processEvent(data)
    });
  }

  private processEvent(event: DataHandle<Address>) {
    const address = event.data;
    const client = this.clients.find(row => row.id_client == address.id_client);
    switch (event.type) {
      case 'insert':
        if (!client) return;
        this.addresses.push(new AddressModel(address, client));
        break;
      case 'update':
        const index = this.addresses.findIndex(a => a.id_address === address.id_address);
        if (index !== -1 && client) {
          this.addresses[index] = new AddressModel(address, client);
        }
        break;
      case 'delete':
        this.addresses = this.addresses.filter(row => row.id_address !== address.id_address);
        break;
    }
  }
}
