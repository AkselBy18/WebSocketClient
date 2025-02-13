import {ClientModel} from "./client.model";
import {Order} from "../interfaces/orders.interface";

export class OrderModel {
    id_order: number;
    order_date: string;
    total_amount: string;
    status: string;
    client_id: number;
    deleting: boolean = false;
    client: ClientModel;

    constructor(order: Order, client: ClientModel) {
        this.id_order = order.id_order;
        this.order_date = order.order_date;
        this.total_amount = order.total_amount;
        this.status = order.status;
        this.client_id = order.id_client;
        this.client = client;
    }

    public getJSON(): Order {
        return {
            id_order: this.id_order,
            order_date: this.order_date,
            total_amount: this.total_amount,
            status: this.status,
            id_client: this.client_id
        };
    }
}
