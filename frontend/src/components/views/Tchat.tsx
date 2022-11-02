import React from "react";

import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../molecules/InputBarMessage";
import Box from "@mui/material/Box";
import { createRoom } from "../../utils/roomsManagment";
import { Button } from "@mui/material";

const Tchat = (): JSX.Element => {

    // const [token] = useGlobalState("token");
    // const [user] = useGlobalState("user");

    const createRoomTest = async () => {
        await createRoom("token", "leTestEstmignon", ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzQxOGI3Zjk4ODk2ZTE3MTQ0YjVhOGIiLCJpYXQiOjE2NjUyMzk5NzYsImV4cCI6MTY2NjEwMzk3Nn0.ys0wYXdvT6ppHh1qZk8vXqn7rin25PxPR6Zz-AQWjK0"]);
    };

    const onSubmit = () => {
        console.log("ICH");
    };

    React.useEffect (() => {
        const element = document.getElementById("tchat");

        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [/* message state update */]);

    return (
        <PageLayout>
            <Box
                sx={{ minHeight: "calc(100vh - 96px)", maxHeight: "calc(100vh - 96px)" }}
                className="col"
            >
                <Box
                    id="tchat"
                    sx={{ maxHeight: "calc(100vh - 96px - 72px)" }}
                    className="pl--8 mr--8 tchat__scrollbar flex-shrink--1 mb--16 tchat"
                >
                    <Message username="Axel" datetime="16/09/2022 18h32" message="! SaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuut BISOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUS" />
                    <Message username="Jean-Marie El fou" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gaetan" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                    <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                </Box>
                <InputMessage onSubmit={onSubmit} />
            </Box>
        </PageLayout>
    );
};

export default Tchat;