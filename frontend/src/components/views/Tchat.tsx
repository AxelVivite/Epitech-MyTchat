import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../atoms/InputBarMessage";
import Box from "@mui/material/Box";

const Tchat = (): JSX.Element => {
    return (
        <div className="Test">
            <PageLayout>
                <Box
                    sx={{ minHeight: "calc(100vh - 96px)" }}
                    className="col flex--space-between"
                >
                    <Box>
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                        <Message username="Axel" datetime="16/09/2022 18h32" message="Salut!" />
                    </Box>
                    <InputMessage />
                </Box>
            </PageLayout>
        </div>
    );
};

export default Tchat;