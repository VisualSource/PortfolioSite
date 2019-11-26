export interface ClientMessage{
    type: "LOGIN"| "REQUEST" | "EXIT";
    payload?:{
        request?: "JOIN" | "CREATE" | "UPDATE_WORLD" | "LEAVE_GAME" | "FINISH_GAME" | "END_TURN"
    }
    id: string;
    date: Date
}
export interface ServerMessage{
    type: string;
    statusCode: number;
    payload?: object|string;
    date: Date
}
export interface WebSocketClient{
    socket: WebSocket;
    userToken: string,
    systemMessage: ServerMessage[];
    gameMessage: ServerMessage[];
    requestReponse: ServerMessage[];
    errorMessages: ServerMessage | {
        type: string,
        error: string
    }
    currentRequest(): ServerMessage;
    init(id: string, token: string,host: string,): void;
    async send(msg: ClientMessage): void;
    async quit(): void;
    async reconecct(): void
}

