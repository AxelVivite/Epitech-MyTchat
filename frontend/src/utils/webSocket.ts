const socketUrl: String = "ws://localhost:3000/room/websocket";

export class WebsocketManager {
    url: string;
    sendJsonMessage: any;
    lastMessage: any;
    lastJsonMessage: any;
    readyState: any;
    getWebSocket: any;

    constructor(webSocket: any, token: String) {
        let {
            sendJsonMessage, 
            lastMessage, 
            lastJsonMessage,
            readyState,
              // -1 if uninstantiated, otherwise follows WebSocket readyState mapping: 0: 'Connecting', 1 'OPEN', 2: 'CLOSING', 3: 'CLOSED'
            getWebSocket
        } = webSocket;

        this.url = socketUrl + "?token=" + token;
        this.getWebSocket = getWebSocket;
        this.lastJsonMessage = lastJsonMessage;
        this.lastMessage = lastMessage;
        this.readyState = readyState;
        this.sendJsonMessage = sendJsonMessage;  
    }


}