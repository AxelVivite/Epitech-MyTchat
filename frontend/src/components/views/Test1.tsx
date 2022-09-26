import React from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import PageLayout from "../layouts/pageLayout/PageLayout";

const socketUrl: String = "ws://localhost:3000/room/websocket";


const Home: React.FC = () => {
    const token = useParams();
    let url = socketUrl + "?token=" + token.token;

    console.log(token);
    React.useEffect(() => {

    })
    let {
        sendJsonMessage, 
        lastMessage, 
        lastJsonMessage,
        readyState,
          // -1 if uninstantiated, otherwise follows WebSocket readyState mapping: 0: 'Connecting', 1 'OPEN', 2: 'CLOSING', 3: 'CLOSED'
        getWebSocket
    } = useWebSocket(url, 
        {
            onOpen: () => console.log('Websocket open with effectice authentication'),
            onClose: () => console.log(lastMessage),
            //Will attempt to reconnect on all close events, such as server shutting down
            //shouldReconnect: (closeEvent) => true,
    });


    return (
        <div className="Home">
            <PageLayout>
            <text>Test de navigation réussi !!!</text>
            </PageLayout>
        </div>
    );
};

export default Home;