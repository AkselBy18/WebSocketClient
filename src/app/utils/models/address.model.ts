
import {ClientModel} from "./client.model";
import {AddressInterface} from "../interfaces/address.interface";

export class AddressModel {
    id_address: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    created_at: Date;
    client: ClientModel;
    deleting: boolean = false;

    constructor(address: AddressInterface, client: ClientModel) {
        this.id_address = address.id_address;
        this.street = address.street;
        this.city = address.city;
        this.state = address.state;
        this.country = address.country;
        this.zip_code = address.zip_code;
        this.created_at = address.created_at;
        this.client = client;
    }
}
