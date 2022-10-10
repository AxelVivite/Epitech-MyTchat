import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../molecules/InputBarMessage";
import Box from "@mui/material/Box";

const Tchat = (): JSX.Element => {
    
    const onSubmit = () => {
        console.log("ICH");
    };

    return (
        <div className="Test">
            <PageLayout>
                <Box
                    sx={{ minHeight: "calc(100vh - 96px)" }}
                    className="col flex--space-between"
                >
                    <Box
                        sx={{ maxHeight: "calc(100vh - 96px - 72px)" }}
                        className="overflow_y--auto message--scrollbar"
                    >
                        <Message username="Axel" datetime="16/09/2022 18h32" message="! SaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutSaluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuut BISOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUS" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Gael" datetime="16/09/2022 18h32" message="Salut!" />
                    </Box>
                    <InputMessage onSubmit={onSubmit} />
                </Box>
            </PageLayout>
        </div>
    );
};

export default Tchat;