import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AddressesService} from "../../services/sections/addresses.service";
import {WebSocketMangerService} from "../../services/web-socket-manger.service";
import {AddressModel} from "../../utils/models/address.model";

@Component({
  selector: 'app-adresses',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './adresses.component.html',
  styleUrl: './adresses.component.css'
})
export class AdressesComponent implements OnInit {
  public addresses: AddressModel[] = [];

  constructor(
      private service: AddressesService,
      private socket: WebSocketMangerService
  ) { }

  ngOnInit() {
    this.getData();
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private getData() {
    this.service.syncAddresses().then(_ => {
      this.addresses = this.service.addressesModel;
    });
  }
}
