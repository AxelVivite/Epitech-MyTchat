import { useTranslation } from "react-i18next";

import {
    Box,
    Drawer as MuiDrawer,
    Fab,
    Typography
} from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';

import Rooms from "./Rooms";

interface DrawerProps {
    handleClickDrawerButton: () => void;
    isDrawerOpen: boolean;
}

const Drawer = (props: DrawerProps): JSX.Element => {
    const { t } = useTranslation();

    const drawer = (
        <>
            <Box className="row border--bottom pl--16 pr--16 flex--space-between" sx={{ height: "64px" }}>
                <Typography className="rooms">{t("rooms")}</Typography>
                <Fab
                    className="btn--circle"
                    onClick={props.handleClickDrawerButton}
                    size="small"
                    sx={{margin: "auto 0"}}
                >
                    <AddIcon />
                </Fab>
            </Box>
            <Rooms />
        </>
    );

    return (
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
    );
};

export default Drawer;