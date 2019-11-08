export interface ClientMessage{
    type: string;
    payload?:object;
    id: string;
    date: Date
}
export interface ServerMessage{
    type: string;
    statusCode: number;
    data?: object;
    date: Date
}
export interface WebSocketClient{
    socket: WebSocket;
    readyState: number;
    messageSystem: object[];
    messageGame: object[];
    getRequest: object[];
    currentRequest(): object;
    init(host: string, id: string, token: string): void;
    send(msg: string|object): void;
    quit(): void;
    reconecct(): void
}

