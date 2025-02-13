import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderModel} from "../../utils/models/order.model";
import {OrdersService} from "../../services/sections/orders.service";
import {ClientModel} from "../../utils/models/client.model";
import {AddressModel} from "../../utils/models/address.model";
import {Order} from "../../utils/interfaces/orders.interface";
import {format, formatISO, parseISO} from "date-fns";
import {WebSocketMangerService} from "../../services/web-socket-manger.service";
import {DataHandle} from "../../utils/general.interface";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild('cellAdd', { static: false }) cellTemp!: ElementRef;
  private cell!: HTMLElement;

  public orders: OrderModel[] = [];
  public clients: ClientModel[] = [];
  public status: string[] = ["pending", "paid", "shipped", "canceled"];
  public showCellAdd: boolean = false;
  public currentOrder!: Order;
  public date: Date = new Date();
  public dateFormatter: string = "";

  constructor(
     private service: OrdersService,
     private socket: WebSocketMangerService
  ) { }

  ngOnInit() {
    this.handleOrders();
    this.setDefaultOrder();
    this.getData();
  }

  ngAfterViewInit() {
    this.cell = this.cellTemp.nativeElement;
    this.cell.style.display = 'none';
  }

  //MARK: PUBLIC METHODS -----------------------------------------------------------------------------
  public addOrder(value: boolean = this.showCellAdd) {
    this.showCellAdd = !value;
    if (!this.showCellAdd) {
      this.setDefaultOrder();
    }
    this.cell.style.display = this.showCellAdd ? 'block' : 'none';
    this.cell.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  public editOrder(row: OrderModel) {
    this.currentOrder = {...row.getJSON()};
    this.date = new Date(row.order_date);
    this.addOrder(false);
  }

  public deleteOrder(row: OrderModel) {
    this.currentOrder = {...row.getJSON()};
    this.sendDelete();
  }

  public sendRequest() {
    if (!this.validate()) { return }
    if (this.currentOrder.id_order === 0) {
      this.sendAdd();
    } else {
      this.sendUpdate();
    }
  }

  public onChangeDate(date: string) {
    this.date = parseISO(date);
    this.currentOrder.order_date = formatISO(date, {representation: 'complete'});
  }

  //MARK: PRIVATE METHODS ----------------------------------------------------------------------------
  private getData() {
    this.service.syncOrders().then(_ => {
      this.orders = this.service.getOrders();
      this.clients = this.service.getClients();
    });
  }

  private sendAdd() {
    const {id_order, ...data} = this.currentOrder;
    this.socket.sendEvent('INSERT_ORDER', data);
    this.addOrder();
  }

  private sendUpdate() {
    const {order_date, ...data} = this.currentOrder;
    this.socket.sendEvent('UPDATE_ORDER', data);
    this.addOrder();
  }

  private sendDelete() {
    const data = {id_order: this.currentOrder.id_order};
    this.socket.sendEvent('DELETE_ORDER', data);
    this.setDefaultOrder();
  }

  private validate(): boolean {
    return !!this.currentOrder.id_client && !!this.currentOrder.status && !!this.currentOrder.total_amount;
  }

  public setDefaultOrder() {
    this.date = new Date();
    this.dateFormatter = format(this.date, "yyyy-MM-dd'T'HH:mm:ss")
    this.currentOrder = {
      id_order: 0,
      order_date: formatISO(this.date, {representation: 'complete'}),
      total_amount: "0",
      status: "pending",
      id_client: this.clients[0]?.id_client ?? 0
    };
  }

  private handleOrders() {
    this.socket.handleOrder.subscribe(data => {
      if (!data) {return}
      this.processEvent(data);
    });
  }

  private processEvent(data: DataHandle<Order>) {
    const order = data.data;
    const client = this.clients.find(row => row.id_client == order.id_client);
    switch (data.type) {
      case 'insert':
        if (!client) {return}
        this.orders.push(new OrderModel(order, client));
        break;
      case 'update':
        const index = this.orders.findIndex(row => row.id_order == data.data.id_order);
        if (index !== -1 && client) {
          this.orders[index] = new OrderModel(order, client);
        }
        break;
      case 'delete':
        this.orders =  this.orders.filter(row => row.id_order !== order.id_order);
        break;

    }
  }
}
