import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { set, deleteWebsocket } from "../../redux/actions/websocketActions";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import PageLayout from "../layouts/pageLayout/PageLayout";
import { decrement, increment, reset } from "../../redux/actions/counterActions";

const socketUrl: String = "ws://localhost:3000/room/websocket";

const Home: React.FC = () => {
    const token = useParams();
    const dispatch = useDispatch();

    const websocket = useSelector((state: any) => state.webSocket);
    const counter = useSelector((state: any) => state.counter);

    let url = socketUrl + "?token=" + token.token;

    // let {
    //     sendJsonMessage, 
    //     lastMessage, 
    //     lastJsonMessage,
    //     readyState,
    //       // -1 if uninstantiated, otherwise follows WebSocket readyState mapping: 0: 'Connecting', 1 'OPEN', 2: 'CLOSING', 3: 'CLOSED'
    //     getWebSocket
    // } = useWebSocket(url, 
    //     {
    //         onOpen: () => console.log('Websocket open with effectice authentication'),
    //         onClose: () => console.log(lastMessage),
    //         //Will attempt to reconnect on all close events, such as server shutting down
    //         //shouldReconnect: (closeEvent) => true,
    // });

    let websocketInstance = useWebSocket(url, 
        {
            onOpen: () => console.log('Websocket open with effectice authentication'),
            onClose: () => console.log("Websocket close"),
            //Will attempt to reconnect on all close events, such as server shutting down
            //shouldReconnect: (closeEvent) => true,
    });
    ;

    return (
        <div className="Home">
            <PageLayout>
            <text>Test de navigation réussi !!!</text>
            {/* <h3>{websocket.websocket.readyState}</h3> */}
            {/* <button onClick={() => dispatch(set(websocketInstance))}>Alexis</button> */}
            <h1>Redux project</h1>
        <h3>Counter</h3>
        <h3>{counter.counter}</h3>
        <button onClick={() => dispatch(increment())}>Increase</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
        <button onClick={() => dispatch(decrement())}>Decrease</button>

            </PageLayout>
        </div>
    );
};

export default Home;