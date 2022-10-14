import React from "react";

import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../molecules/InputBarMessage";
import Box from "@mui/material/Box";

const Tchat = (): JSX.Element => {

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