import PageLayout from "../layouts/pageLayout/PageLayout";

import Message from "../molecules/Message";
import InputMessage from "../atoms/InputBarMessage";
import Box from "@mui/material/Box";
import { setGlobalState, useGlobalState } from "../../utils/globalStateManager/globalStateInit";
import { createRoom } from "../../utils/roomsManagment";
import { Button } from "@mui/material";

const Tchat = (): JSX.Element => {

    const [token] = useGlobalState("token");
    const [user] = useGlobalState("user");

    const createRoomTest = async () => {
        await createRoom(token, "leTestEstmignon", ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzQxOGI3Zjk4ODk2ZTE3MTQ0YjVhOGIiLCJpYXQiOjE2NjUyMzk5NzYsImV4cCI6MTY2NjEwMzk3Nn0.ys0wYXdvT6ppHh1qZk8vXqn7rin25PxPR6Zz-AQWjK0"]);
    };

    return (
        <div className="Test">
            <PageLayout>
                <Box
                    sx={{ minHeight: "calc(100vh - 96px)" }}
                    className="col flex--space-between"
                >
                    <h3>{token}</h3>
                    <h3>{user.username}</h3>
                    <Button onClick={() => createRoomTest}>Create romm test</Button>
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