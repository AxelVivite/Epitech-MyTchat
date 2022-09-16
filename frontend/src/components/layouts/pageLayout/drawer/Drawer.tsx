import {
    Box,
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    Typography
} from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';

import Rooms from "./Rooms";

interface DrawerProps {
    handleClickDrawerButton: () => void;
    isDrawerOpen: boolean;
}

const Drawer = (props: DrawerProps): JSX.Element => {
    const drawer = (
        <>
            <Box sx={{
                display: "flex",
                flexWrap: "nowrap",
                flexDirection: "row",
                height: "64px"
            }}>
                <Typography>Conversations</Typography>
                
                <IconButton onClick={props.handleClickDrawerButton}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Divider />
            <Rooms />
        </>
    );

    return (
        <>
        {
                <>
                    <MuiDrawer id="drawer"
                        variant="temporary"
                        open={props.isDrawerOpen}
                        onClose={props.handleClickDrawerButton}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: "block", md: "none" },
                            "& .MuiDrawer-paper": { width: "280px" },
                        }}
                    >
                        {drawer}
                    </MuiDrawer>
                    <MuiDrawer id="drawer"
                        variant="permanent"
                        sx={{
                            display: { xs: "none", md: "block" },
                            "& .MuiDrawer-paper": { width: "280px" },
                        }}
                    >
                        {drawer}
                    </MuiDrawer>
                </>
        }
        </>
    );
};

export default Drawer;