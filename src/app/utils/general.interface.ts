export interface ResponseData {
    success: boolean;
    event: string;
    table: string;
    data: object;
}

export interface DataHandle {
    type: 'insert' | 'update' | 'delete';
    data: object;
}
