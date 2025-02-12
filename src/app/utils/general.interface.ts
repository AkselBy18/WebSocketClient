export interface ResponseData {
    success: boolean;
    event: string;
    table: string;
    data: object;
}

export interface DataHandle<T> {
    type: 'insert' | 'update' | 'delete';
    data: T;
}
