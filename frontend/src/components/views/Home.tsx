import React from "react";
import useWebSocket from "react-use-websocket";
import PageLayout from "../layouts/pageLayout/PageLayout";
//eslint-disable-next-line
import { setGlobalState, useGlobalState } from "../../utils/globalStateManager/globalStateInit";

const socketUrl: String = "ws://localhost:3000/room/websocket";

const Home: React.FC = (props: any) => {

    let [token] = useGlobalState("token");

    let url = socketUrl + "?token=" + token;

    //eslint-disable-next-line
    let websocketInstance = useWebSocket(url,
        {
            onOpen: () => console.log('Websocket open with effectice authentication'),
            onClose: () => console.log("Websocket close"),
            //Will attempt to reconnect on all close events, such as server shutting down
            //shouldReconnect: (closeEvent) => true,
        });

    //const [user]: any = useGlobalState("user");

    return (
        <div className="Home">
            <PageLayout>
                <text>Test de navigation réussi !!!</text>

            </PageLayout>
        </div>
    );
};

export default Home;