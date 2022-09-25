import useWebSocket from "react-use-websocket";

const socketUrl: String = "ws://localhost:3000/room/websocket";

export class WebsocketManager {
    url: string;
    sendJsonMessage: any;
    lastMessage: any;
    lastJsonMessage: any;
    readyState: any;
    getWebSocket: any;

    constructor(token: string) {
        this.url = socketUrl + "?token=" + token;
        let {
            sendJsonMessage, 
            lastMessage, 
            lastJsonMessage,
            readyState,
            getWebSocket
        } = useWebSocket(this.url, 
            {
                onOpen: () => console.log('opened'),
                //Will attempt to reconnect on all close events, such as server shutting down
                shouldReconnect: (closeEvent) => true,
        });

        if (readyState == 1) {
            this.getWebSocket = getWebSocket;
            this.lastJsonMessage = lastJsonMessage;
            this.lastMessage = lastMessage;
            this.readyState = readyState;
            this.sendJsonMessage = sendJsonMessage;   
        }
    }


}