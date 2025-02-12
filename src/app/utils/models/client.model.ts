import {Client} from "../interfaces/client.interface";

export class ClientModel {
    id_client: number;
    name: string;
    email: string;
    phone: string;
    created_at: Date;
    deleting: boolean = false;

    constructor(client: Client) {
        this.id_client = client.id_client;
        this.name = client.name;
        this.email = client.email;
        this.phone = client.phone;
        this.created_at = client.created_at;
    }

    public getJSON(): Client {
        return {
            id_client: this.id_client,
            name: this.name,
            email: this.email,
            phone: this.phone,
            created_at: this.created_at
        };
    }
}
