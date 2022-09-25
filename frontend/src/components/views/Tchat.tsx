import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../molecules/InputMessage";
import Box from "@mui/material/Box";

const Tchat = (): JSX.Element => {
    return (
        <div className="Test">
            <PageLayout>
                <Box className="col ">
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